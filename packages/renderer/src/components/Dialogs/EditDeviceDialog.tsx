import { Ledfx } from '@/api/ledfx'
import { device } from '@/store/interfaces'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useState } from 'react'
import { DeepCopy, DeviceSchemaForm } from '../SchemaForm/DeviceSchemaForm'

export const EditDeviceDialog = (dialogOpen: boolean, handleClose: () => void, firstDevice: device) => {
	const [device, setDevice] = useState(firstDevice)

	const setBaseConfig = (baseConfig: device['base_config']) => {
		const newDevice = DeepCopy(device)
		newDevice.base_config = baseConfig
		setDevice(newDevice)
	}

	const setImplConfig = (implConfig: device['impl_config']) => {
		const newDevice = DeepCopy(device)
		newDevice.impl_config = implConfig
		setDevice(newDevice)
	}

	return ( device.type &&
		<Dialog open={dialogOpen} onClose={handleClose} maxWidth="lg" fullWidth>
			<DialogTitle>Create Device</DialogTitle>
			<DialogContent>
				{
					DeviceSchemaForm({
						type: device.type,
						baseConfig: device.base_config,
						setBaseConfig: setBaseConfig,
						implConfig: device.impl_config,
						setImplConfig: setImplConfig,
					})
				}
			</DialogContent>
			<DialogActions>
				<Button variant="outlined" onClick={async () => {
					Ledfx('/api/devices', 'POST', device).then(response => { response && handleClose() })
				}}>Submit</Button>
			</DialogActions>
		</Dialog>
	)
}