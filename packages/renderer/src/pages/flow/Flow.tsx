import React, { useEffect, useState } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, Background } from 'react-flow-renderer';
import { useStore } from '../../store/useStore'
import { EffectNode, VirtualNode, DeviceNode } from './Nodes';
import ButtonEdge from "./ButtonEdge";
import './nodes.css';

const nodeTypes = { effectNode: EffectNode, virtualNode: VirtualNode, deviceNode: DeviceNode };
const edgeTypes = { buttonedge: ButtonEdge };

const initialNodes = [];
const initialEdges = [];

const HorizontalFlow = () => {

    const effects = useStore((state) => state.api.effects)
    const virtuals = useStore((state) => state.api.virtuals)
    const devices = useStore((state) => state.api.devices)
    const connections = useStore((state) => state.api.connections)

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes as any);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const onConnect = (params: any) => setEdges((els) => addEdge({ ...params, type: 'buttonedge' }, els));

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
    }, [connections]);

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
                        position: { x: -400, y: 0 },
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
                        position: { x: 400, y: 0 },
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
                edgeTypes={edgeTypes}
                fitView
                attributionPosition="bottom-left"
            >
                <Background />
            </ReactFlow>
            
        </div>
    );
};

export default HorizontalFlow;

