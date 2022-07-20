import { useEffect } from 'react'
import ReactFlow, { useNodesState, useEdgesState, addEdge, Background, Edge, Position } from 'react-flow-renderer'
import { useStore } from '../../store/useStore'
import { EffectNode, VirtualNode, DeviceNode, AddEffectNode, AddDeviceNode, AddVirtualNode } from './Nodes'
import ButtonEdge from './ButtonEdge'
import { VariantType } from 'notistack'
import { Ledfx } from '@/api/ledfx'

const edgeTypes = { buttonedge: ButtonEdge }
const nodeTypes = {
	effectNode: EffectNode,
	virtualNode: VirtualNode,
	deviceNode: DeviceNode,
	addEffectNode: AddEffectNode,
	addDeviceNode: AddDeviceNode,
	addVirtualNode: AddVirtualNode
}

const initialNodes: never[] = []
const initialEdges: Edge<any>[] = []


const Flow = () => {

	const effects = useStore((state) => state.api.effects)
	const virtuals = useStore((state) => state.api.virtuals)
	const devices = useStore((state) => state.api.devices)
	const connections = useStore((state) => state.api.connections)
	const showSnackbar = useStore((state) => state.ui.showSnackbar)

	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes as any)
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

	const makeConnection = async (params: any) => {
		const sourceType = nodes.find(x => x.id === params.source)?.type
		const targetType = nodes.find(x => x.id === params.target)?.type
		if (sourceType === 'effectNode' && targetType == 'deviceNode') {
			showSnackbar('info' as VariantType, 'Use a virtual to join an effect to a device')
			return
		}
		interface dataProps {
			'device_id': string | undefined, 'virtual_id': string | undefined, 'effect_id': string | undefined
		}
		const data = {} as dataProps

		if (sourceType === 'effectNode') {
			data.effect_id = params.source
			data.virtual_id = params.target
		} else {
			data.virtual_id = params.source
			data.device_id = params.target
		}
		await Ledfx('/api/virtuals/connect', 'POST', data)
	}

	useEffect(() => {
		setEdges((edges) => {
			edges = []
			for (const effect_id in connections.effects) {
				const virtual_id = connections.effects[effect_id]
				edges.push(
					{
						id: effect_id + virtual_id,
						source: effect_id,
						type: 'buttonedge',
						target: virtual_id,
						animated: true,
					}
				)
			}
			for (const device_id in connections.devices) {
				const virtual_id = connections.devices[device_id]
				edges.push(
					{
						id: virtual_id + device_id,
						source: virtual_id,
						type: 'buttonedge',
						target: device_id,
						animated: true,
					}
				)
			}
			return edges
		})
	}, [connections])

	useEffect(() => {
		setNodes((nodes) => {
			// empty out the nodes, we will make it fresh each time
			nodes = []
			// add header nodes
			nodes.push(
				{
					id: 'add_effect',
					type: 'addEffectNode',
					position: { x: -400, y: -200 },
					data: {}
				},
				{
					id: 'add_virtual',
					type: 'addVirtualNode',
					position: { x: 0, y: -200 },
					data: {}
				},
				{
					id: 'add_device',
					type: 'addDeviceNode',
					position: { x: 400, y: -200 },
					data: {}
				},
			)
			const dy = 170
			let i = 0
			for (const effect_id in effects) {
				nodes.push(
					{
						id: effect_id,
						type: 'effectNode',
						sourcePosition: Position.Right,
						position: { x: -400, y: i },
						data: effects[effect_id]
					},
				)
				i += dy
			}
			i = 0
			for (const virtual_id in virtuals) {
				nodes.push(
					{
						id: virtual_id,
						type: 'virtualNode',
						targetPosition: Position.Left,
						sourcePosition: Position.Right,
						position: { x: 0, y: i },
						data: virtuals[virtual_id]
					},
				)
				i += dy
			}
			i = 0
			for (const device_id in devices) {
				nodes.push(
					{
						id: device_id,
						type: 'deviceNode',
						targetPosition: Position.Left,
						position: { x: 400, y: i },
						data: devices[device_id]
					},
				)
				i += dy
			}
			return nodes
		}
		)
	}, [effects, virtuals, devices])


	return (
		<ReactFlow
			nodes={nodes}
			edges={edges}
			onNodesChange={onNodesChange}
			onEdgesChange={onEdgesChange}
			onConnect={makeConnection}
			nodeTypes={nodeTypes}
			edgeTypes={edgeTypes}
			fitView
			nodesDraggable={false}
			elementsSelectable={true}
			attributionPosition="top-right"
		>
			<Background />
		</ReactFlow>
	)
}

export default Flow