import React, { useEffect, useState } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge } from 'react-flow-renderer';
import { useStore } from '../../store/useStore'
import { EffectNode, VirtualNode, DeviceNode } from './Nodes';
import './nodes.css';

const nodeTypes = { effectNode: EffectNode, virtualNode: VirtualNode, deviceNode: DeviceNode };

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

    const effects = useStore((state) => state.api.effects)
    const virtuals = useStore((state) => state.api.virtuals)
    const devices = useStore((state) => state.api.devices)

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes as any);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const onConnect = (params: any) => setEdges((els) => addEdge(params, els));

    useEffect(() => {
        setNodes((nodes) => {
            // empty out the nodes, we will make it fresh each time
            nodes = []
            for (const effect_id in effects) {
                nodes.push(
                    {
                        id: effect_id,
                        type: 'effectNode',
                        sourcePosition: 'right',
                        position: { x: 0, y: 0 },
                        data: effects[effect_id]
                    },
                )
            }
            for (const virtual_id in virtuals) {
                nodes.push(
                    {
                        id: virtual_id,
                        type: 'virtualNode',
                        targetPosition: 'left',
                        sourcePosition: 'right',
                        position: { x: 0, y: 0 },
                        data: virtuals[virtual_id]
                    },
                )
            }
            for (const device_id in devices) {
                nodes.push(
                    {
                        id: device_id,
                        type: 'deviceNode',
                        targetPosition: 'left',
                        position: { x: 0, y: 0 },
                        data: devices[device_id]
                    },
                )
            }
            return nodes
        }
            // nodes.map((node) => {
            //     if (node.id === '1') {
            //         // it's important that you create a new object here
            //         // in order to notify react flow about the change
            //         node.data = {
            //             ...node.data,
            //             label: nodeName,
            //         };
            //     }

            //     return node;
            // })
        );
    }, [effects, virtuals, devices]);


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

