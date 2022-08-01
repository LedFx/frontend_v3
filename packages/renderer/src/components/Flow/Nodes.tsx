import { Ledfx } from '@/api/ledfx'
import { controller, device, deviceState, effect } from '@/store/interfaces'
import { ArrowCircleRight, CellTower } from '@mui/icons-material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import SettingsIcon from '@mui/icons-material/Settings'
import SignalWifiBadIcon from '@mui/icons-material/SignalWifiBad'
import SignalWifiStatusbar4BarIcon from '@mui/icons-material/SignalWifiStatusbar4Bar'
import ToggleOffIcon from '@mui/icons-material/ToggleOff'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import TuneIcon from '@mui/icons-material/Tune'
import WifiFindIcon from '@mui/icons-material/WifiFind'
import { Box, CardActions, Chip, IconButton, Tooltip, Typography } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { useState } from 'react'
import { Handle, Position } from 'react-flow-renderer'
import { CreateControllerDialog } from '../Dialogs/CreateControllerDialog'
import { CreateDeviceDialog } from '../Dialogs/CreateDeviceDialog'
import { CreateEffectDialog } from '../Dialogs/CreateEffectDialog'
import { EditDeviceDialog } from '../Dialogs/EditDeviceDialog'
import { EffectSchemaDialog } from '../Dialogs/EffectSchemaDialog'

const nodeWidth = '300px'
const nodeHeight = '160px'

export const EffectNode = (node: { data: effect; }) => {
	const effect = node.data as effect
	const [open, setOpen] = useState(false)
	return (
		<>
			<Card variant="outlined" sx={{ 'width': nodeWidth, 'height': nodeHeight, cursor: 'pointer' }} onClick={() => setOpen(!open)}>
				<CardContent>
					<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>{effect.id}</Typography>
					<Typography variant="h5" textTransform="capitalize">{effect.type}</Typography>
					<Typography variant="body2">Pixel visualisation goes here</Typography>
				</CardContent>
				<CardActions disableSpacing>
					<Tooltip arrow title="Adjust Settings">
						<IconButton aria-label="Adjust Settings" onClick={() => setOpen(true)}>
							<TuneIcon />
						</IconButton>
					</Tooltip>
					<Tooltip arrow title="Delete">
						<IconButton aria-label="Delete" onClick={async (event: any) => { event.stopPropagation(); await Ledfx(`/api/effects?id=${effect.id}`, 'DELETE') }}>
							<DeleteIcon />
						</IconButton>
					</Tooltip>
					{/* <Popover onConfirm={async () => { event.stopPropagation(); await Ledfx(`/api/effects?id=${effect.id}`, 'DELETE') }} variant="text" /> */}

				</CardActions>
				<Handle type="source" position={Position.Right} />
			</Card>
			{EffectSchemaDialog({ effect: effect, open: open, handleclose: () => setOpen(false) })}
		</>

	)
}

export const ControllerNode = (node: { data: controller; }) => {
	const controller = node.data as controller
	const toggle = async () => {
		const data = {} as any
		data[controller.id] = !controller.active
		await Ledfx('/api/controllers/state', 'POST', data)
	}
	const [open, setOpen] = useState(false)
	return (
		<>
			<Card variant="outlined" onClick={toggle} sx={{ 'width': nodeWidth, 'height': nodeHeight, cursor: 'pointer', 'borderColor': controller.active ? 'blue' : '' }}>
				<CardContent>
					<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>{controller.id}</Typography>
					<Typography noWrap variant="h5">{controller.base_config.name}</Typography>
				</CardContent>
				<CardActions disableSpacing>
					<Tooltip arrow title="Toggle Activation">
						<IconButton aria-label="Toggle Activation" onClick={toggle}>
							{controller.active ? <ToggleOnIcon color='primary' /> : <ToggleOffIcon />}
						</IconButton>
					</Tooltip>
					<Tooltip arrow title="Configure">
						<IconButton aria-label="Configure" onClick={(event: any) => { event.stopPropagation(); setOpen(!open) }}>
							<SettingsIcon />
						</IconButton>
					</Tooltip>
					<Tooltip arrow title="Delete">
						<IconButton aria-label="Delete" onClick={async (event: any) => { event.stopPropagation(); Ledfx(`/api/controllers?id=${controller.id}`, 'DELETE') }}>
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				</CardActions>
				<Handle type="source" position={Position.Right} />
				<Handle type="target" position={Position.Left} />
			</Card>
			{CreateControllerDialog({
				id: controller.id,
				open: open,
				handleClose: () => setOpen(false)
			})}
		</>
	)
}

export const DeviceNode = (node: { data: device; }) => {
	const [open, setOpen] = useState(false)
	const device = node.data as device
	return (
		<>
			<Card variant="outlined" sx={{ 'width': nodeWidth, 'height': nodeHeight, cursor: 'default' }}>
				<CardContent>
					<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>{device.id}</Typography>
					<Typography noWrap variant="h5">{device.base_config.name}</Typography>
				</CardContent>
				<CardActions disableSpacing>
					<IconButton aria-label="Status">
						{device.state === undefined ? null : ConnectionIcon(device.state)}
					</IconButton>
					<Tooltip arrow title="Configure">
						<IconButton aria-label="Configure" onClick={() => setOpen(!open)}>
							<SettingsIcon />
						</IconButton>
					</Tooltip>
					<Tooltip arrow title="Delete">
						<IconButton aria-label="Delete" onClick={async (event: any) => { event.stopPropagation(); Ledfx(`/api/devices?id=${device.id}`, 'DELETE') }}>
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				</CardActions>
				<Handle type="target" position={Position.Left} />
			</Card>
			{EditDeviceDialog(open, () => { setOpen(false) }, device)}
		</>
	)
}

function ConnectionIcon(state: deviceState) {
	switch (state) {
		case deviceState.Connected:
			return <Tooltip arrow title="Connected" color='primary'>
				<SignalWifiStatusbar4BarIcon />
			</Tooltip>
		case deviceState.Connecting:
			return <Tooltip arrow title="Connecting" color='disabled'>
				<WifiFindIcon />
			</Tooltip>
		default:
			return <Tooltip arrow title="Disconnected" color='disabled'>
				<SignalWifiBadIcon />
			</Tooltip>
	}
}

export const AddEffectNode = () => {
	const [open, setOpen] = useState(false)
	const [globalOpen, setGlobalOpen] = useState(false)

	return (
		<>
			<Card variant="outlined" sx={{ 'width': nodeWidth, 'height': '150px', cursor: 'pointer' }} onClick={() => setGlobalOpen(!globalOpen)}>
				<CardContent>
					<Typography variant="h5">Effects</Typography>
					<Typography variant="body2">Generate pixel data</Typography>
				</CardContent>
				<CardActions disableSpacing>
					<Tooltip arrow title="Adjust settings of all effects">
						<IconButton aria-label="Adjust Settings" onClick={() => setGlobalOpen(!globalOpen)}>
							<TuneIcon />
						</IconButton>
					</Tooltip>
					<Tooltip arrow title="Add Effect">
						<IconButton aria-label="Add Effect" onClick={(event: any) => { event.stopPropagation(); setOpen(!open) }}>
							<AddCircleIcon />
						</IconButton>
					</Tooltip>
					<Box sx={{ justifyContent: 'flex-end', display: 'flex', width: '100%' }}>
						<Chip label="Sends pixels to" onDelete={() => { null }} variant="filled" disabled deleteIcon={<ArrowCircleRight />} />
					</Box>
				</CardActions>
			</Card>
			{CreateEffectDialog({
				open: open,
				handleClose: () => setOpen(false)
			})}
			{EffectSchemaDialog({
				open: globalOpen,
				handleclose: () => setGlobalOpen(false)
			})}
		</>
	)
}

export const AddControllerNode = () => {
	const [toggleState, setToggleState] = useState(false)
	const toggle = async () => {
		setToggleState(!toggleState as boolean)
	}
	const [open, setOpen] = useState(false)
	return (
		<Card variant="outlined" sx={{ 'width': nodeWidth, 'height': '150px', cursor: 'default' }}>
			<CardContent>
				<Typography variant="h5">Controllers</Typography>
				<Typography variant="body2">Manage and distribute pixel data</Typography>
			</CardContent>
			<CardActions disableSpacing>
				<Tooltip arrow title="Toggle activation of all controllers">
					<IconButton aria-label="Toggle Activation of All Controllers" onClick={toggle}>
						{toggleState ? <ToggleOffIcon /> : <ToggleOnIcon color='primary' />}
					</IconButton>
				</Tooltip>
				<Tooltip arrow title="Add Controller">
					<IconButton aria-label="Add Controller" onClick={() => setOpen(!open)}>
						<AddCircleIcon />
					</IconButton>
				</Tooltip>
				<Box sx={{ justifyContent: 'flex-end', display: 'flex', width: '100%' }}>
					<Chip label="Sends pixels to" onDelete={() => { null }} variant="filled" disabled deleteIcon={<ArrowCircleRight />} />
				</Box>
			</CardActions>
			{CreateControllerDialog({
				open: open,
				handleClose: () => setOpen(false)
			})}
		</Card>
	)
}

export const AddDeviceNode = () => {
	const [dialogOpen, setDialogOpen] = useState(false)

	return (
		<Card variant="outlined" sx={{ 'width': nodeWidth, 'height': '150px', cursor: 'default' }}>
			<CardContent>
				<Typography variant="h5">Devices</Typography>
				<Typography variant="body2">Send pixel data to your hardware</Typography>
			</CardContent>
			<CardActions disableSpacing>
				<Tooltip arrow title="Add Device">
					<IconButton aria-label="Add Device" onClick={() => setDialogOpen(true)}>
						<AddCircleIcon />
					</IconButton>
				</Tooltip>
				<Box sx={{ justifyContent: 'flex-end', display: 'flex', width: '100%' }}>
					<Chip label="Output" onDelete={() => { null }} variant="filled" disabled deleteIcon={<CellTower />} />
				</Box>
			</CardActions>
			{CreateDeviceDialog(dialogOpen, () => setDialogOpen(false))}
		</Card>
	)
}
