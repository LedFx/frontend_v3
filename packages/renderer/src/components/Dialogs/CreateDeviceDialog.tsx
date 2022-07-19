import { Ledfx } from '@/api/ledfx'
import { device, virtual } from '@/store/interfaces'
import { useStore } from '@/store/useStore'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Input, Slider } from '@mui/material'
import { useEffect, useState } from 'react'
import { DeviceSchemaForm } from '../SchemaForm/DeviceSchemaForm'
import Frame from '../SchemaForm/Frame'

export interface CreateDeviceDialogProps {
    id?: string
    open: boolean
    handleClose: () => void
}

export const CreateDeviceDialog = (props: CreateDeviceDialogProps) => {
	// const deviceSchema = useStore((store) => store.api.schema.device)
	const devices = useStore((store) => store.api.devices)
	const [device, setDevice] = useState({} as device)
	const { id, open, handleClose } = props
	const [valid, setValid] = useState(id !== undefined)

	const applyDefaults = () => {
		if (id == undefined) {
			// setDevice({            })
		} else {
			setDevice(devices[id])
		}
	}

	useEffect(applyDefaults, [])

	return (
		<Dialog open={open} onClose={handleClose} >
			<DialogTitle>{id === undefined ? 'Create' : 'Configure'} Device</DialogTitle>
			<DialogContent>
				{DeviceSchemaForm('UDP Stream')}
			</DialogContent>
			<DialogActions>
				<Button disabled={!valid} variant="outlined" onClick={async () => {
					// await Ledfx("/api/devices", "POST", { "id": id, "base_config": config })
					handleClose()
				}}>{id === undefined ? 'Create' : 'Update'}</Button>
			</DialogActions>
		</Dialog>
	)
}
