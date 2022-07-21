import { Ledfx } from '@/api/ledfx'
import { device, deviceInfo } from '@/store/interfaces'
import { useStore } from '@/store/useStore'
import { Box, Button, Card, CardActions, CardContent, Chip, Grid, Input, Slider, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import Frame from './Frame'

export interface DeviceSchemaFormProps {
    id?: string
}

const DeepCopy = (object: object) => {
    return JSON.parse(JSON.stringify(object))
}

export interface DeviceTypeCardProps {
    type: string
    info: deviceInfo
}

const DeviceTypeCard = (props: DeviceTypeCardProps) => {
    const { type, info } = props
    console.log(type, info)
    return (
        <Card variant="outlined" style={{ "height": "100%" }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {type}
                </Typography>
                <Typography variant="h5">{info.name}</Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {info.info}
                </Typography>
            </CardContent>
            <CardActions>
                <Stack direction="row" spacing={1} alignItems="center">
                    {Object.entries(info.protocols).map(([_, tip], i: number) => (
                        <Chip key={i} label={tip} variant="outlined" />
                    ))}
                </Stack>
                <Box sx={{ justifyContent: 'flex-end', display: 'flex', width: "100%" }}>
                    <Button variant="outlined" onClick={async () => {
                        // await Ledfx('/api/effects', 'POST', { 'type': effectType })
                        // handleClose()
                    }}>Select</Button>
                </Box>
            </CardActions>
        </Card>
    )
}

export const DeviceSchemaForm = (props: DeviceSchemaFormProps) => {
    const deviceSchema = useStore((store) => store.api.schema.device)
    const storeDevices = useStore((store) => store.api.devices)
    const [device, setDevice] = useState({ base_config: {} } as device)
    const { id } = props

    useEffect(() => {
        if (id !== undefined) {
            setDevice(storeDevices[id])
        }
    }, [])

    return (
        <Grid container alignItems="stretch" spacing={2}>
            <Grid item xs={12}>
                <Typography>{JSON.stringify(device, null, 2)}</Typography>
            </Grid>
            <Grid item xs={8}>
                <Frame
                    title={deviceSchema.base.name.title}
                    tip={deviceSchema.base.name.description}
                >
                    <Input
                        value={device.base_config.name || ""}
                        // error={}     
                        onChange={(event) => {
                            let newDevice = DeepCopy(device)
                            newDevice.base_config.name = event.target.value
                            setDevice(newDevice)
                        }}
                    />
                </Frame>
            </Grid>
            <Grid item xs={4}>
                <Frame
                    title={deviceSchema.base.pixel_count.title}
                    tip={deviceSchema.base.pixel_count.description}
                >
                    <Input
                        value={device.base_config.pixel_count || 0}
                        onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                                return
                            }
                        }}
                        onChange={(event) => {
                            let newDevice = DeepCopy(device) as device
                            newDevice.base_config.pixel_count = parseInt(event.target.value, 10)
                            setDevice(newDevice)
                        }}
                    />
                </Frame>
            </Grid>
            {
                Object.entries(deviceSchema.types).map(([type, info], i: number) => (
                    <Grid item xs={6} key={i}>
                        <DeviceTypeCard type={type} info={info}/>
                    </Grid>
                ))
            }
        </Grid>
    )
}