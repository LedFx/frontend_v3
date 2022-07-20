import { device } from '@/store/interfaces'
import { useStore } from '@/store/useStore'
import { Grid, Input } from '@mui/material'
import { useEffect, useState } from 'react'
import Frame from './Frame'

export const DeviceSchemaForm = (id?: string) => {
	const deviceSchema = useStore((store: { api: { schema: { device: any } } }) => store.api.schema.device)
    const [device, setDevice] = useState({} as device)
    const newDevice = id ? false : true
    const storeDevice = id? useStore((store) => store.api.devices[id]) : {} as device

	return deviceSchema && deviceSchema.base_config && (
        <Grid container>
            <Grid item xs={8}>
                <Frame
                    title={deviceSchema.base_config.name.title}
                    tip={deviceSchema.base_config.name.description}
                >
                    <Input
                    // value={config.name}
                    // error={!valid}
                    // onChange={(event) => {
                    //     setConfig({
                    //         ...config,
                    //         name: event.target.value
                    //     })
                    //     setValid(event.target.value !== "")
                    // }}
                    />
                </Frame>
            </Grid>
            <Grid item xs={4}>
                <Frame
                    title={deviceSchema.base_config.pixel_count.title}
                    tip={deviceSchema.base_config.pixel_count.description}
                >
                    <Input
                    // value={config.name}
                    // error={!valid}
                    // onChange={(event) => {
                    //     setConfig({
                    //         ...config,
                    //         name: event.target.value
                    //     })
                    //     setValid(event.target.value !== "")
                    // }}
                    />
                </Frame>
            </Grid>

        </Grid>
    )
}