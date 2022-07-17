import { Ledfx } from '@/api/ledfx';
import React from 'react';
import { getBezierPath, getEdgeCenter, getMarkerEnd, useReactFlow } from 'react-flow-renderer';

import './edge.css';

const foreignObjectSize = 40;

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
}:{
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
  const reactFlowInstance = useReactFlow();
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const onEdgeClick = async (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: any) => {
    evt.stopPropagation();
    const edge = reactFlowInstance.getEdge(id)
    const sourceType = reactFlowInstance.getNode(edge?.source)?.type === "effectNode" ? "effect_id" : "virtual_id"
    const targetType = reactFlowInstance.getNode(edge?.target)?.type === "virtualNode" ? "virtual_id" : "device_id"
    const data = {}
    data[sourceType] = edge?.source
    data[targetType] = edge?.target
    await Ledfx('/api/virtuals/disconnect', 'POST', data)
  };

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
        <body>
          <button className="edgebutton" onClick={(event) => onEdgeClick(event, id)}>
            ×
          </button>
        </body>
      </foreignObject>
    </>
  );
}
