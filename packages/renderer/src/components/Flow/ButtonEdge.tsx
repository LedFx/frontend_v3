import { Ledfx } from '@/api/ledfx'
import React from 'react'
import { getBezierPath, getEdgeCenter, useReactFlow } from 'react-flow-renderer'

import './edge.css'

const foreignObjectSize = 40

export default function CustomEdge({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	style = {},
	markerEnd,
}: {
    id: any,
    sourceX: any,
    sourceY: any,
    targetX: any,
    targetY: any,
    sourcePosition: any,
    targetPosition: any,
    style?: any,
    markerEnd?: any,
}) {
	const reactFlowInstance = useReactFlow()
	const edgePath = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	})
	const [edgeCenterX, edgeCenterY] = getEdgeCenter({
		sourceX,
		sourceY,
		targetX,
		targetY,
	})

	const onEdgeClick = async (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: any) => {
		evt.stopPropagation()
		const edge = reactFlowInstance.getEdge(id)
		const sourceType = !!edge && reactFlowInstance.getNode(edge.source)?.type === 'effectNode' ? 'effect_id' : 'controller_id'
		const targetType = !!edge && reactFlowInstance.getNode(edge.target)?.type === 'controllerNode' ? 'controller_id' : 'device_id'
        interface dataProps {
            'device_id': string | undefined, 'controller_id': string | undefined, 'effect_id': string | undefined
        }
        const data = { 'device_id': '', 'controller_id': '', 'effect_id': '' } as dataProps
        data[sourceType] = edge?.source
        data[targetType] = edge?.target
        await Ledfx('/api/controllers/disconnect', 'POST', data)
	}

	return (
		<>
			<path
				id={id}
				style={style}
				className="react-flow__edge-path"
				d={edgePath}
				markerEnd={markerEnd}
			/>
			<foreignObject
				width={foreignObjectSize}
				height={foreignObjectSize}
				x={edgeCenterX - foreignObjectSize / 2}
				y={edgeCenterY - foreignObjectSize / 2}
				className="edgebutton-foreignobject"
				requiredExtensions="http://www.w3.org/1999/xhtml"
			>
				<button className="edgebutton" onClick={(event) => onEdgeClick(event, id)}>
                    ×
				</button>
			</foreignObject>
		</>
	)
}
