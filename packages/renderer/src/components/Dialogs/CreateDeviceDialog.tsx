import { Ledfx } from '@/api/ledfx'
import { device, deviceInfo, schemaEntry } from '@/store/interfaces'
import { useStore } from '@/store/useStore'
import { CheckCircle, Info } from '@mui/icons-material'
import { Box, Button, Card, CardActions, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Grid, Step, StepContent, StepLabel, Stepper, Tooltip, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { DeviceSchemaForm } from '../SchemaForm/DeviceSchemaForm'

interface DeviceTypeCardProps {
    type: string
    info: deviceInfo
    onSelect: (deviceType: string) => void
}

export const infoURIs: Record<string, string> = {
	artnet: 'https://kno.wled.ge/interfaces/e1.31-dmx/',
	e131: 'https://kno.wled.ge/interfaces/e1.31-dmx/',
	udp_stream: 'https://kno.wled.ge/interfaces/udp-realtime/',
	udp_serial: 'https://kno.wled.ge/interfaces/serial/'
}

const blankBaseConfig = () => {
	return {
		'name': '',
		'pixel_count': 0
	} as device['base_config']
}

const DeviceTypeCard = (props: DeviceTypeCardProps) => {
	const { type, info, onSelect } = props

	return (
		<Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
			<CardContent>
				<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
					{type}
				</Typography>
				<Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}  >
					<Typography noWrap variant="h5">{info.name}</Typography>
					<Tooltip arrow title="More info">
						<IconButton onClick={() => { window.open(infoURIs[type], '_blank') }}>
							<Info />
						</IconButton>
					</Tooltip>
				</Box>
				<Typography sx={{ mb: 1.5 }} color="text.secondary">
					{info.info}
				</Typography>


			</CardContent>
			<CardActions sx={{ mb: 0 }}>
				<Box sx={{ width: '100%', display: 'inline-flex' }}>
					<Box sx={{ width: '100%', flexWrap: 'wrap', mr: 2 }}>
						{Object.entries(info.protocols).map(([_, tip], i: number) => (
							<Chip size='small' key={i} label={tip} icon={(tip=='WLED' && <CheckCircle />) || undefined} color={tip=='WLED'? 'success':'default'} variant="outlined" />
						))}
					</Box>
					<Box sx={{ alignSelf: 'flex-end' }}>
						<Button variant="outlined" onClick={() => {
							onSelect(type)
						}}>Select</Button>
					</Box>
				</Box>
			</CardActions>
		</Card>
	)
}

export const CreateDeviceDialog = (dialogOpen: boolean, handleClose: () => void) => {
	const deviceSchema = useStore((store) => store.api.schema.device)
	const [deviceType, setDeviceType] = useState('')
	const [activeStep, setActiveStep] = useState(0)
	const [baseConfig, setBaseConfig] = useState(blankBaseConfig() as device['base_config'])
	const [implConfig, setImplConfig] = useState({} as device['impl_config'])

	const handleNext = () => setActiveStep(1)
	const handleReset = () => setActiveStep(0)

	useEffect(() => {
		if (!deviceType) { return }
		const blankImplConfig = {} as device['impl_config']
		Object.entries(deviceSchema.impl[deviceType]).forEach(([key, schema]: [string, schemaEntry]) => {
			blankImplConfig[key] = schema.default
		})
		setImplConfig(blankImplConfig)
	}, [deviceType])

	return (
		<Dialog open={dialogOpen} onClose={handleClose} maxWidth="lg" fullWidth>
			<DialogTitle>Create Device</DialogTitle>
			<DialogContent>
				<Stepper activeStep={activeStep} orientation="vertical">
					<Step>
						<StepLabel>Choose Device Type</StepLabel>
						<StepContent>
							{deviceSchema && <Grid container spacing={2}>
								{
									Object.entries(deviceSchema.types).map(([type, info], i: number) => (
										<Grid item xs={6} key={i}>
											{DeviceTypeCard({ type: type, info: info, onSelect: (d: string)=>{setDeviceType(d); handleNext() }})}
										</Grid>
									))
								}
							</Grid>
							}
						</StepContent>
					</Step>
					<Step>
						<StepLabel>Configure Device Settings</StepLabel>
						<StepContent>
							{
								DeviceSchemaForm({
									type: deviceType,
									baseConfig: baseConfig,
									setBaseConfig: setBaseConfig,
									implConfig: implConfig,
									setImplConfig: setImplConfig,
								})
							}
						</StepContent>
					</Step>
				</Stepper>
			</DialogContent>
			<DialogActions>
				<Button disabled={activeStep == 0} variant="outlined" onClick={handleReset}>Reset</Button>
				<Button disabled={activeStep == 0} variant="outlined" onClick={async () => {
					Ledfx('/api/devices', 'POST', {
						'type': deviceType,
						'base_config': baseConfig,
						'impl_config': implConfig
					}).then(response => { response && handleClose()})
				}}>Submit</Button>
			</DialogActions>
		</Dialog>
	)
}


