import { useCallback } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { useStore } from '../../store/useStore'
import { Button, TextField, Stack, Typography } from '@mui/material'
import { effect, virtual, device } from '@/store/storeApi';

export const EffectNode = (node) => {
    const effect = node.data as effect
    return (
        <div className='node'>
            <div>
                <Typography>{effect.id}</Typography>
                <Typography align="left"><pre>{JSON.stringify(effect.base_config, null, 2)}</pre></Typography>
            </div>
            <Handle type="source" position={Position.Right} id="a" />
        </div>
    );
}

export const VirtualNode = (node) => {
    const virtual = node.data as virtual
    return (
        <div className='node'>
            <div>
                <Typography>{virtual.id}</Typography>
                <Typography>Active: {virtual.active}</Typography>
                <Typography align="left"><pre>{JSON.stringify(virtual.base_config, null, 2)}</pre></Typography>
            </div>
            <Handle type="source" position={Position.Right} id="a" />
        </div>
    );
}

export const DeviceNode = (node) => {
    const device = node.data as device
    return (
        <div className='node'>
            <div>
                <Typography>{device.id}</Typography>
                <Typography>State: {device.state}</Typography>
                <Typography>Type: {device.type}</Typography>
                <Typography align="left"><pre>{JSON.stringify(device.base_config, null, 2)}</pre></Typography>
                <Typography align="left"><pre>{JSON.stringify(device.impl_config, null, 2)}</pre></Typography>
            </div>
            <Handle type="source" position={Position.Right} id="a" />
        </div>
    );
}
