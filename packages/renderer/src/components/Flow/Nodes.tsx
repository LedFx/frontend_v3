import { device, effect, virtual, deviceState } from '@/store/storeApi';
import { Button, CardActions, IconButton, Tooltip, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TuneIcon from '@mui/icons-material/Tune';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import SignalWifiBadIcon from '@mui/icons-material/SignalWifiBad';
import SignalWifiStatusbar4BarIcon from '@mui/icons-material/SignalWifiStatusbar4Bar';
import WifiFindIcon from '@mui/icons-material/WifiFind';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Handle, Position } from 'react-flow-renderer';
import { Ledfx } from '@/api/ledfx';

const nodeWidth = "300px"
const nodeHeight = "160px"

export const EffectNode = (node: { data: effect; }) => {
    const effect = node.data as effect
    return (
        <Card variant="outlined" sx={{ "width": nodeWidth, "height": nodeHeight }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>{effect.id}</Typography>
                <Typography variant="h5">{effect.type}</Typography>
                <Typography variant="body2">Pixel visualisation goes here</Typography>
            </CardContent>
            <CardActions disableSpacing>
                <Tooltip title="Adjust Settings">
                    <IconButton aria-label="Adjust Settings">
                        <TuneIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton aria-label="Delete">
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </CardActions>
            <Handle type="source" position={Position.Right} />
        </Card>
    );
}

export const VirtualNode = (node: { data: virtual; }) => {
    const virtual = node.data as virtual
    const toggle = async () => {
        let data = {}
        data[virtual.id] = !virtual.active
        console.log(data)
        await Ledfx('/api/virtuals/state', "POST", data)
    }
    return (
        <Card variant="outlined" sx={{ "width": nodeWidth, "height": nodeHeight }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>{virtual.id}</Typography>
                <Typography variant="h5">{virtual.base_config.name}</Typography>
            </CardContent>
            <CardActions disableSpacing>
                <Tooltip title="Toggle Activation">
                    <IconButton aria-label="Toggle Activation" onClick={toggle}>
                        <PowerSettingsNewIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Configure">
                    <IconButton aria-label="Configure">
                        <SettingsIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton aria-label="Delete">
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </CardActions>
            <Handle type="source" position={Position.Right} />
            <Handle type="target" position={Position.Left} />
        </Card>
    );
}

export const DeviceNode = (node: { data: device; }) => {
    const device = node.data as device
    return (
        <Card variant="outlined" sx={{ "width": nodeWidth, "height": nodeHeight }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>{device.id}</Typography>
                <Typography variant="h5">{device.base_config.name}</Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="Status">
                    {ConnectionIcon(device.state)}
                </IconButton>
                <Tooltip title="Configure">
                    <IconButton aria-label="Configure">
                        <SettingsIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton aria-label="Delete">
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </CardActions>
            <Handle type="target" position={Position.Left} />
        </Card>
    );
}

function ConnectionIcon(state: deviceState) {
    switch (state) {
        case deviceState.Connected:
            return <Tooltip title="Connected" color='disabled'>
                <SignalWifiStatusbar4BarIcon />
            </Tooltip>
        case deviceState.Connecting:
            return <Tooltip title="Connecting" color='disabled'>
                <WifiFindIcon />
            </Tooltip>
        default:
            return <Tooltip title="Disconnected" color='disabled'>
                <SignalWifiBadIcon />
            </Tooltip>
    }
}

export const AddEffectNode = (_: any) => {
    return (
        <Card variant="outlined" sx={{ "width": nodeWidth, "height": "150px" }}>
            <CardContent>
                <Typography variant="h5">Effects</Typography>
                <Typography variant="body2">Generate pixel data</Typography>
            </CardContent>
            <CardActions disableSpacing>
                <Tooltip title="Adjust settings of all effects">
                    <IconButton aria-label="Adjust Settings">
                        <TuneIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Add Effect">
                    <IconButton aria-label="Add Effect">
                        <AddCircleIcon />
                    </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
    );
}

export const AddVirtualNode = (_: any) => {
    return (
        <Card variant="outlined" sx={{ "width": nodeWidth, "height": "150px" }}>
            <CardContent>
                <Typography variant="h5">Virtuals</Typography>
                <Typography variant="body2">Manage and distribute pixel data</Typography>
            </CardContent>
            <CardActions disableSpacing>
                <Tooltip title="Toggle Activation">
                    <IconButton aria-label="Toggle Activation">
                        <PowerSettingsNewIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Add Virtual">
                    <IconButton aria-label="Add Virtual">
                        <AddCircleIcon />
                    </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
    );
}

export const AddDeviceNode = (_: any) => {
    return (
        <Card variant="outlined" sx={{ "width": nodeWidth, "height": "150px" }}>
            <CardContent>
                <Typography variant="h5">Devices</Typography>
                <Typography variant="body2">Send pixel data to your hardware</Typography>
            </CardContent>
            <CardActions disableSpacing>
                <Tooltip title="Add Device">

                    <IconButton aria-label="Add Device">
                        <AddCircleIcon />
                    </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
    );
}
