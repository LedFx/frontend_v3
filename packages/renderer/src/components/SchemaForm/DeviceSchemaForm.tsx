import { device, deviceInfo } from '@/store/interfaces'
import { useStore } from '@/store/useStore'
import { Info } from '@mui/icons-material'
import { Autocomplete, Box, Button, Card, CardActions, CardContent, Chip, Grid, IconButton, Input, MenuItem, Select, Switch, TextField, Tooltip, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import Frame from './Frame'

const patternIP = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

const infoURIs: Record<string, string> = {
	artnet: 'https://kno.wled.ge/interfaces/e1.31-dmx/',
	e131: 'https://kno.wled.ge/interfaces/e1.31-dmx/',
	udp_stream: 'https://kno.wled.ge/interfaces/udp-realtime/',
	udp_serial: 'https://kno.wled.ge/interfaces/serial/'
}

export interface DeviceSchemaFormProps {
    id?: string
}

const DeepCopy = (object: object) => {
	return JSON.parse(JSON.stringify(object))
}

interface DeviceTypeCardProps {
    type: string
    info: deviceInfo
    selected: string | undefined
    implConfigs: Record<string, device['impl_config']>
    setImplConfig: (deviceType: string, impl_config: device['impl_config']) => void
    onSelect: (deviceType: string | undefined) => void
}

const ImplSettings = (props: DeviceTypeCardProps) => {
	const { type, info, selected, onSelect, implConfigs, setImplConfig } = props
	const deviceSchema = useStore((store) => store.api.schema.device)
	const [receivers, setReceivers] = useState([] as string[])

	return (
		Object.entries(deviceSchema.impl[type]).map(([key, schema]) => {
			if (schema.type == 'int' && schema.validation.hasOwnProperty('max') && schema.validation.hasOwnProperty('min')) {
				return (
					<Frame
						title={schema.title}
						tip={schema.description}
					>
						<Input
							fullWidth
							value={0} // todo default? get from impl?
							onKeyPress={(event) => {
								if (!/[0-9]/.test(event.key)) {
									event.preventDefault()
									return
								}
							}}
							onChange={(event) => {
								const newImplConfig = DeepCopy(implConfigs[type])
								newImplConfig[key] = parseInt(event.target.value, 10)
								setImplConfig(type, newImplConfig)
							}}
						/>
					</Frame>
				)
			}
			if (schema.validation.hasOwnProperty('oneof')) {
				return (
					<Frame
						title={schema.title}
						tip={schema.description}
					>
						<Select
							size="small"
							variant="standard"
							fullWidth
							value={schema.validation.oneof[0]}// todo 
							onChange={(event) => {
								const newImplConfig = DeepCopy(implConfigs[type])
								newImplConfig[key] = event.target.value
								setImplConfig(type, newImplConfig)
							}}
						>
							{schema.validation.oneof.map((item) => (
								<MenuItem value={item}>{item}</MenuItem>
							))}
						</Select>
					</Frame>
				)
			}
			if (schema.validation.hasOwnProperty('special') && schema.validation.special == 'ip' && schema.type == 'string') {
				return (
					<Frame
						title={schema.title}
						tip={schema.description}
					>
						<Input
							fullWidth
							value={'ip'} // todo default? get from impl?
							onChange={(event) => {
								if (!patternIP.test(event.target.value)) {
									console.log('invalid IP')
								}
								const newImplConfig = DeepCopy(implConfigs[type])
								newImplConfig[key] = event.target.value
								setImplConfig(type, newImplConfig)
							}}
						/>
					</Frame>
				)
			}
			if (schema.type == 'bool') {
				return (
					<Frame
						title={schema.title}
						tip={schema.description}
					>
						<Switch
							defaultChecked={false}// TODO
							onChange={(event) => {
								if (!patternIP.test(event.target.value)) {
									console.log('invalid IP')
								}
								const newImplConfig = DeepCopy(implConfigs[type])
								newImplConfig[key] = event.target.value
								setImplConfig(type, newImplConfig)
							}}
						/>
					</Frame>
				)
			}
			if (schema.type == 'string') {
				return (
					<Frame
						title={schema.title}
						tip={schema.description}
					>
						<Input
							value={''} // TODO
							onChange={(event) => {
								const newImplConfig = DeepCopy(implConfigs[type])
								newImplConfig[key] = event.target.value
								setImplConfig(type, newImplConfig)
							}}
						/>
					</Frame>
				)
			}
			if ((schema.type == 'list') && schema.validation.hasOwnProperty('special') && (schema.validation.special == 'ip')) {
				return (
					<Frame
						title={schema.title}
						tip={schema.description}
					>
						<Autocomplete
							fullWidth
							multiple
							id="tags-filled"
							options={[]}
							defaultValue={[]}
							freeSolo
							renderTags={(
								value: string[],
								getTagProps: (arg0: { index: any }) => JSX.IntrinsicAttributes
							) =>
								value.map((option: any, index: any) => {
									setReceivers(value)
									return (
										<Chip
											key={index}
											variant="outlined"
											label={option}
											{...getTagProps({ index })}
										/>
									)
								})
							}
							renderInput={(params: any) => (
								<TextField
									{...params}
									variant="standard"
									placeholder="Type an IP and press Enter"
								/>
							)}
						/>
					</Frame>
				)
			}

			console.log('unimplemented device setting schema:', schema)
		})
	)
}

const DeviceTypeCard = (props: DeviceTypeCardProps) => {
	const { type, info, selected, onSelect, implConfigs, setImplConfig } = props
	const deviceSchema = useStore((store) => store.api.schema.device)
	const uri = infoURIs[type]
	// FOR MULTI IP INPUT
	return (
		<Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderColor: type == selected ? 'primary.main' : 'default' }}>
			<CardContent>
				<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
					{type}
				</Typography>
				<Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}  >
					<Typography noWrap variant="h5">{info.name}</Typography>
					<Tooltip arrow title="More info">
						<IconButton onClick={() => { window.open(uri, '_blank') }}>
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
							<Chip size='small' key={i} label={tip} variant="outlined" />
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

export const DeviceSchemaForm = (props: DeviceSchemaFormProps) => {
	const deviceSchema = useStore((store) => store.api.schema.device)
	const storeDevices = useStore((store) => store.api.devices)
	const [device, setDevice] = useState({ base_config: {} } as device)
	// Object.entries(deviceSchema.types).map(([deviceType, _], i: number) => ({{deviceType}: {}})
	const { id } = props
	const onSelect = (deviceType: string | undefined) => {
		const newDevice = DeepCopy(device) as device
		newDevice.type = deviceType
		newDevice.impl_config = deviceType ? implConfigs[deviceType] : {}
		setDevice(newDevice)
	}
	const setImplConfig = (deviceType: string, impl_config: device['impl_config']) => {
		const newImplConfigs = DeepCopy(implConfigs) as Record<string, device['impl_config']>
		newImplConfigs[deviceType] = impl_config
		setImplConfigs(newImplConfigs)
		if (deviceType == device.type) {
			const newDevice = DeepCopy(device) as device
			newDevice.impl_config = impl_config
			setDevice(newDevice)
		}
	}
	const buildEmptyImplConfigs = () => {
		// populate with keys here from schema
		const blankImplConfigs = {} as Record<string, device['impl_config']>
		Object.entries(deviceSchema.types).forEach(([deviceType, _]: [string, deviceInfo]) => (blankImplConfigs[deviceType] = {}))
		// console.log(device, id)

		if ((id !== undefined) && (storeDevices[id] !== undefined) && (storeDevices[id].type !== undefined)) {
			blankImplConfigs[storeDevices[id].type] = storeDevices[id].impl_config
		}
		// console.log(blankImplConfigs)
		return blankImplConfigs
	}
	const [implConfigs, setImplConfigs] = useState(buildEmptyImplConfigs)

	useEffect(() => {
		if (id !== undefined) {
			setDevice(storeDevices[id])
		}
		console.log(device, storeDevices, id)
		setImplConfigs(buildEmptyImplConfigs)
	}, [])

	return (
		<Grid container alignItems="stretch" spacing={2}>
			<Grid item xs={12}>
				<Typography>{JSON.stringify(device, null, 2)}</Typography>
			</Grid>
			<Grid item xs={6}>
				<Frame
					title={deviceSchema.base.name.title}
					tip={deviceSchema.base.name.description}
				>
					<Input
						fullWidth
						value={device.base_config.name || ''}
						// error={}     
						onChange={(event) => {
							const newDevice = DeepCopy(device)
							newDevice.base_config.name = event.target.value
							setDevice(newDevice)
						}}
					/>
				</Frame>
			</Grid>
			<Grid item xs={6}>
				<Frame
					title={deviceSchema.base.pixel_count.title}
					tip={deviceSchema.base.pixel_count.description}
				>
					<Input
						fullWidth
						value={device.base_config.pixel_count || 0}
						onKeyPress={(event) => {
							if (!/[0-9]/.test(event.key)) {
								event.preventDefault()
								return
							}
						}}
						onChange={(event) => {
							const newDevice = DeepCopy(device) as device
							newDevice.base_config.pixel_count = parseInt(event.target.value, 10)
							setDevice(newDevice)
						}}
					/>
				</Frame>
			</Grid>
			{
				Object.entries(deviceSchema.types).map(([type, info], i: number) => (
					<Grid item xs={3} key={i}>
						{DeviceTypeCard({type:type, info:info, selected:device.type, onSelect:onSelect})}
					</Grid>
				))
			}
		</Grid>
	)
}