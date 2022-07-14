import { device, effect, virtual } from '@/store/storeApi';
import { CardActions, IconButton, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TuneIcon from '@mui/icons-material/Tune';
import DeleteIcon from '@mui/icons-material/Delete';
import { Handle, Position } from 'react-flow-renderer';

export const EffectNode = (node) => {
    const effect = node.data as effect
    return (
        <Card variant="outlined">
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>{effect.id}</Typography>
                <Typography variant="h5">{effect.type}</Typography>
                <Typography variant="body2">Pixel visualisation goes here</Typography>

                {/* <Typography variant="body4"><pre>{JSON.stringify(effect.base_config, null, 2)}</pre></Typography> */}

            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="Adjust Settings">
                    <TuneIcon />
                </IconButton>
                <IconButton aria-label="Delete">
          <DeleteIcon />
        </IconButton>
            </CardActions>
            <Handle type="source" position={Position.Right} />
        </Card>
    );
}

export const VirtualNode = (node) => {
    const virtual = node.data as virtual
    return (
        <Card variant="outlined">
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>{virtual.id}</Typography>
                <Typography variant="h5">{virtual.base_config.name}</Typography>
                <Typography variant="body4"><pre>{JSON.stringify(virtual.base_config, null, 2)}</pre></Typography>
            </CardContent>
            <Handle type="source" position={Position.Right} />
            <Handle type="target" position={Position.Left} />
        </Card>
    );
}

export const DeviceNode = (node) => {
    const device = node.data as device
    return (
        <Card variant="outlined">
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>{device.id}</Typography>
                <Typography variant="h5">{device.base_config.name}</Typography>
                <Typography variant="body4"><pre>{JSON.stringify(device.base_config, null, 2)}</pre></Typography>
                <Typography variant="body4"><pre>{JSON.stringify(device.impl_config, null, 2)}</pre></Typography>
            </CardContent>
            <Handle type="target" position={Position.Left} />
        </Card>
    );
}
