import { Ledfx } from '@/api/ledfx'
import { VariantType } from 'notistack'
import { useEffect } from 'react'
import ReactFlow, { Background, Edge, Position, useEdgesState, useNodesState } from 'react-flow-renderer'
import { useStore } from '../../store/useStore'
import ButtonEdge from './ButtonEdge'
import { AddControllerNode, AddDeviceNode, AddEffectNode, ControllerNode, DeviceNode, EffectNode } from './Nodes'

const edgeTypes = { buttonedge: ButtonEdge }
const nodeTypes = {
	effectNode: EffectNode,
	controllerNode: ControllerNode,
	deviceNode: DeviceNode,
	addEffectNode: AddEffectNode,
	addDeviceNode: AddDeviceNode,
	addControllerNode: AddControllerNode
}

const initialNodes: never[] = []
const initialEdges: Edge<any>[] = []


const Flow = () => {

	const effects = useStore((state) => state.api.effects)
	const controllers = useStore((state) => state.api.controllers)
	const devices = useStore((state) => state.api.devices)
	const connections = useStore((state) => state.api.connections)
	const showSnackbar = useStore((state) => state.ui.showSnackbar)

	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes as any)
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

	const makeConnection = async (params: any) => {
		const sourceType = nodes.find(x => x.id === params.source)?.type
		const targetType = nodes.find(x => x.id === params.target)?.type
		if (sourceType === 'effectNode' && targetType == 'deviceNode') {
			showSnackbar('info' as VariantType, 'Use a controller to join an effect to a device')
			return
		}
		interface dataProps {
			'device_id': string | undefined, 'controller_id': string | undefined, 'effect_id': string | undefined
		}
		const data = {} as dataProps

		if (sourceType === 'effectNode') {
			data.effect_id = params.source
			data.controller_id = params.target
		} else {
			data.controller_id = params.source
			data.device_id = params.target
		}
		await Ledfx('/api/controllers/connect', 'POST', data)
	}

	useEffect(() => {
		setEdges((edges) => {
			edges = []
			for (const effect_id in connections.effects) {
				const controller_id = connections.effects[effect_id]
				edges.push(
					{
						id: effect_id + controller_id,
						source: effect_id,
						type: 'buttonedge',
						target: controller_id,
						animated: true,
					}
				)
			}
			for (const device_id in connections.devices) {
				const controller_id = connections.devices[device_id]
				edges.push(
					{
						id: controller_id + device_id,
						source: controller_id,
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
					id: 'add_controller',
					type: 'addControllerNode',
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
			for (const controller_id in controllers) {
				nodes.push(
					{
						id: controller_id,
						type: 'controllerNode',
						targetPosition: Position.Left,
						sourcePosition: Position.Right,
						position: { x: 0, y: i },
						data: controllers[controller_id]
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
	}, [effects, controllers, devices])


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
			zoomOnScroll={false}
			panOnDrag={false}
			panOnScroll={true}
			panOnScrollMode='vertical'
			zoomOnPinch={false}
			zoomOnDoubleClick={false}
			nodesDraggable={false}
			elementsSelectable={true}
			attributionPosition="top-right"
		>
			<Background />
		</ReactFlow>
	)
}

export default Flow