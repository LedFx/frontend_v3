import { useStore } from '@/store/useStore'
import { Grid, Input } from '@mui/material'
import Frame from './Frame'

export const DeviceSchemaForm = (deviceType: string, id?: string) => {
	const deviceSchema = useStore((store) => store.api.schema.device)

	return (
		<Grid container>
			<Grid item xs={6}>
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
			<Grid item xs={6}>
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