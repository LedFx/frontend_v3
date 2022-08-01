import { device, schemaEntry } from '@/store/interfaces'
import { useStore } from '@/store/useStore'
import { Info } from '@mui/icons-material'
import { Autocomplete, Card, CardActions, CardContent, Chip, Grid, IconButton, Input, MenuItem, Select, Switch, TextField, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { infoURIs } from '../Dialogs/CreateDeviceDialog'
import Frame from './Frame'

export const DeepCopy = (object: object) => {
	return JSON.parse(JSON.stringify(object))
}

export interface DeviceSchemaFormProps {
    type: string
    baseConfig: device['base_config']
    setBaseConfig: (c: device['base_config']) => void
    implConfig: device['impl_config']
    setImplConfig: (c: device['impl_config']) => void
}

export const DeviceSchemaForm = (props: DeviceSchemaFormProps) => {
	const { type, baseConfig, setBaseConfig, implConfig, setImplConfig } = props
	const [valids, setValids] = useState<boolean[]>([])
	const deviceSchema = useStore((store) => store.api.schema.device)
	const [receivers, setReceivers] = useState([] as string[])

	useEffect(() => {
		console.log('validating')
	}, [baseConfig, implConfig])

	return (type &&
        <>
        	<Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        		<CardContent>
        			<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        				{type}
        			</Typography>
        			<Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}  >
        				<Typography noWrap variant="h5">{deviceSchema.types[type].name}</Typography>
        				<Tooltip arrow title="More info">
        					<IconButton onClick={() => { window.open(infoURIs[type], '_blank') }}>
        						<Info />
        					</IconButton>
        				</Tooltip>
        			</Box>
        			<Typography sx={{ mb: 1.5 }} color="text.secondary">
        				{deviceSchema.types[type].info}
        			</Typography>
        		</CardContent>
        	</Card>
        	<Grid container spacing={2}>
        		<Grid item xs={6}>
        			<Frame
        				title={deviceSchema.base['name'].title}
        				tip={deviceSchema.base['name'].description}
        			>
        				<Input
        					fullWidth
        					value={baseConfig['name'] || ''} // todo default? get from impl?
        					onKeyPress={(event) => { }}
        					onChange={(event) => {
        						const newBaseConfig = DeepCopy(baseConfig)
        						newBaseConfig['name'] = event.target.value
        						setBaseConfig(newBaseConfig)
        					}}
        				/>
        			</Frame>
        		</Grid>
        		<Grid item xs={6}>
        			<Frame
        				title={deviceSchema.base['pixel_count'].title}
        				tip={deviceSchema.base['pixel_count'].description}
        			>
        				<Input
        					fullWidth
        					value={baseConfig['pixel_count'] || 0} // todo default? get from impl?
        					onKeyPress={(event) => {
        						if (!/[0-9]/.test(event.key)) {
        							event.preventDefault()
        							return
        						}
        					}}
        					onChange={(event) => {
        						const newBaseConfig = DeepCopy(baseConfig)
        						newBaseConfig['pixel_count'] = parseInt(event.target.value, 10)
        						setBaseConfig(newBaseConfig)
        					}}
        				/>
        			</Frame>
        		</Grid>
        		{
        			Object.entries(deviceSchema.impl[type]).map(([key, schema]: [string, schemaEntry]) => {
        				if (schema.type == 'int' && schema.validation.hasOwnProperty('max') && schema.validation.hasOwnProperty('min')) {
        					return (
        						<Grid item xs={6}>
        							<Frame
        								title={schema.title}
        								tip={schema.description}
        							>
        								<Input
        									fullWidth
        									value={implConfig[key] || schema.default}
        									onKeyPress={(event) => {
        										if (!/[0-9]/.test(event.key)) {
        											event.preventDefault()
        											return
        										}
        									}}
        									onChange={(event) => {
        										const newImplConfig = DeepCopy(implConfig)
        										newImplConfig[key] = parseInt(event.target.value, 10)
        										setImplConfig(newImplConfig)
        									}}
        								/>
        							</Frame>
        						</Grid>
        					)
        				}
        				if (schema.validation.hasOwnProperty('oneof')) {
        					return (
        						<Grid item xs={6}>
        							<Frame
        								title={schema.title}
        								tip={schema.description}
        							>
        								<Select
        									size="small"
        									variant="standard"
        									fullWidth
        									value={implConfig[key] || schema.default} 
        									onChange={(event) => {
        										const newImplConfig = DeepCopy(implConfig)
        										newImplConfig[key] = event.target.value
        										setImplConfig(newImplConfig)
        									}}
        								>
        									{schema.validation.oneof.map((item: string | number) => (
        										<MenuItem value={item}>{item}</MenuItem>
        									))}
        								</Select>
        							</Frame>
        						</Grid>
        					)
        				}
        				if (schema.validation.hasOwnProperty('special') && schema.validation.special == 'ip' && schema.type == 'string') {
        					return (
        						<Grid item xs={6}>
        							<Frame
        								title={schema.title}
        								tip={schema.description}
        							>
        								<Input
        									fullWidth
        									value={implConfig[key]}
        									onChange={(event) => {
        										// if (!patternIP.test(event.target.value)) {
        										//     console.log('invalid IP')
        										// }
        										const newImplConfig = DeepCopy(implConfig)
        										newImplConfig[key] = event.target.value
        										setImplConfig(newImplConfig)
        									}}
        								/>
        							</Frame>
        						</Grid>
        					)
        				}
        				if (schema.type == 'bool') {
        					return (
        						<Grid item xs={6}>
        							<Frame
        								title={schema.title}
        								tip={schema.description}
        							>
        								<Switch
        									defaultChecked={implConfig[key]  || schema.default}
        									onChange={(event) => {
        										// if (!patternIP.test(event.target.value)) {
        										//     console.log('invalid IP')
        										// }
        										const newImplConfig = DeepCopy(implConfig)
        										newImplConfig[key] = event.target.value
        										setImplConfig(newImplConfig)
        									}}
        								/>
        							</Frame>
        						</Grid>
        					)
        				}
        				if (schema.type == 'string') {
        					return (
        						<Grid item xs={6}>
        							<Frame
        								title={schema.title}
        								tip={schema.description}
        							>
        								<Input
        									fullWidth
        									value={implConfig[key]  || schema.default}
        									onChange={(event) => {
        										const newImplConfig = DeepCopy(implConfig)
        										newImplConfig[key] = event.target.value
        										setImplConfig(newImplConfig)
        									}}
        								/>
        							</Frame>
        						</Grid>
        					)
        				}
        				if ((schema.type == 'list') && schema.validation.hasOwnProperty('special') && (schema.validation.special == 'ip')) {
        					return (
        						<Grid item xs={6}>
        							<Frame
        								title={schema.title}
        								tip={schema.description}
        							>
        								<Autocomplete
        									fullWidth
        									multiple
        									id="tags-filled"
        									options={[]}
        									defaultValue={implConfig[key]}
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
        						</Grid>
        					)
        				}
        				console.log('unimplemented device setting schema:', schema)
        			})
        		}
        	</Grid>
        </>
	)
}