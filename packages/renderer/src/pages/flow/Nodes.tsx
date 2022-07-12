import { useCallback } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { useStore } from '../../store/useStore'
import { Button, TextField, Stack, Typography } from '@mui/material'
import { effect } from '@/store/storeApi';

const handleStyle = { left: 10 };

export const EffectNode = ( node ) => {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  const effects = useStore((state) => state.api.effects)

  return (
    <div className='effect-node'>
      <Handle type="target" position={Position.Top} />
      <div>
        <Typography>{node.id}</Typography>
        <Typography align="left"><pre>{JSON.stringify(node.data.base_config, null, 2)}</pre></Typography>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle type="source" position={Position.Bottom} id="b" style={handleStyle} />
    </div>
  );
}
