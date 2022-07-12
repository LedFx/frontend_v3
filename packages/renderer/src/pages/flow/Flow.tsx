import React, { useEffect, useState } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge } from 'react-flow-renderer';
import { useStore } from '../../store/useStore'
import { EffectNode } from './Nodes';
import './nodes.css';

const nodeTypes = { effectNode: EffectNode };

const initialNodes = [
    {
        id: 'node-1',
        type: 'effectNode',
        position: { x: 0, y: 0 },
        data: { value: 123 }
    },
    {
        id: 'node-2',
        type: 'effectNode',
        position: { x: 0, y: 100 },
        data: { value: 456 }
    },
];

const initialEdges = [
    {
        id: 'e1-2',
        source: 'node-1',
        type: 'smoothstep',
        target: 'node-2',
        animated: true,
    },
];

const HorizontalFlow = () => {

    // const effects = useStore.getState().api.effects
    const virtuals = useStore.getState().api.virtuals
    const devices = useStore.getState().api.virtuals
    const effects = useStore.subscribe(
        (state) => {
            console.log("Got effects change!", state.api.effects);
        },
        (state) => state.api.effects
    )
    // const unsub2 = useStore.subscribe(console.log, state.api => state.api.effects)

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes as any);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const onConnect = (params: any) => setEdges((els) => addEdge(params, els));

    useEffect(() => {
        setNodes((nodes) =>
          nodes.map((node) => {
            if (node.id === '1') {
              // it's important that you create a new object here
              // in order to notify react flow about the change
              node.data = {
                ...node.data,
                label: nodeName,
              };
            }
    
            return node;
          })
        );
      }, [nodeName, setNodes]);


    return (
        <div style={{ height: 800 }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                attributionPosition="bottom-left"
            ></ReactFlow>
        </div>
    );
};

export default HorizontalFlow;

