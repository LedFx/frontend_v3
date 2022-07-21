import styles from '@/styles/app.module.scss'
import { Button, TextField, Stack, Typography } from '@mui/material'
import { useStore } from '../store/useStore'
import pkg from '../../../../package.json'
import Box from '@mui/material/Box'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { Brightness4, Brightness7 } from '@mui/icons-material'

const ipcRenderer = window.ipcRenderer || false

const DevMenu = () => {

	const [text, setText] = useState('Text')

	const snackbar = useStore((state) => state.ui.snackbar)
	const devices = useStore((state) => state.api.devices)
	const controllers = useStore((state) => state.api.controllers)
	const effects = useStore((state) => state.api.effects)
	const connections = useStore((state) => state.api.connections)
	const settings = useStore((state) => state.api.settings)
	const globalEffectConfig = useStore((state) => state.api.globalEffectConfig)
	const schema = useStore((state) => state.api.schema)
	const darkMode = useStore((state) => state.ui.darkMode)
	const setDarkMode = useStore((state) => state.ui.setDarkMode)
	const getSchema = useStore((state) => state.api.getSchema)
	const getEffects = useStore((state) => state.api.getEffects)
	const getSettings = useStore((state) => state.api.getSettings)
	const getDevices = useStore((state) => state.api.getDevices)
	const getControllers = useStore((state) => state.api.getControllers)
	const getConnections = useStore((state) => state.api.getConnections)
	const getGlobalEffectConfig = useStore((state) => state.api.getGlobalEffectConfig)
	const addDevice = useStore((state) => state.api.addDevice)
	const { enqueueSnackbar } = useSnackbar()

	const toggleDarkmode = () => {
		if (ipcRenderer) {
			ipcRenderer.sendSync('toggle-darkmode', 'try')
		} else {
			setDarkMode(!darkMode)
		}
	}

	useEffect(() => {
		if (ipcRenderer) {
			async function getDarkMode() {
				const dark = await ipcRenderer.sendSync('get-darkmode')
				setDarkMode(dark === 'yes')
			}
			getDarkMode()
		}
	}, [])

	useEffect(() => {
		enqueueSnackbar(snackbar.message, { variant: snackbar.variant })
	}, [snackbar])


	return (
		<Box
			sx={{
				bgcolor: 'background.default',
				color: 'text.primary',
				overflowX: 'hidden',
				width: 450
			}}
			className={styles.app}>
			<header
				className={styles.container}
				style={{
					maxWidth: 450,
					minHeight:
						ipcRenderer && pkg.env.VITRON_CUSTOM_TITLEBAR
							? 'calc(100vh - 30px)'
							: '100vh',
				}}>
				<p>Welcome to LedFx v3</p>
				<Typography>
					CORE:{' '}
					{`${import.meta.env.VITE_CORE_PROTOCOL || 'http'}://${import.meta.env.VITE_CORE_HOST || 'localhost'
					}:${import.meta.env.VITE_CORE_PORT || '8080'}`}
				</Typography>
				<Stack spacing={1}>
					<Button onClick={toggleDarkmode}>{darkMode ? <Brightness7 /> : <Brightness4 />}</Button>
					<Button onClick={() => enqueueSnackbar('I love hooks')}>
						Notification
					</Button>
					<Button onClick={() => getSettings()}>getSettings</Button>
					<Button onClick={() => getSchema()}>getSchema</Button>
					<Button onClick={() => getDevices()}>getDevices</Button>
					<Button onClick={() => getEffects()}>getEffects</Button>
					<Button onClick={() => getControllers()}>getControllers</Button>
					<Button onClick={() => getConnections()}>getConnections</Button>
					<Button onClick={() => getGlobalEffectConfig()}>getGlobalEffectConfig</Button>
					<TextField
						variant='outlined'
						value={text}
						onChange={(e) => setText(e.target.value)}
					/>
					<Button
						onClick={() =>
							addDevice({
								type: 'UDP Stream',
								base_config: {
									name: text, // @not_matt here we are passing the current `text` into the function addDevice
									pixel_count: 64,
								},
								impl_config: {
									ip: '192.168.0.69',
								},
							}).then(() => getDevices())
						}>
						addDevice
					</Button>
				</Stack>
			</header>
			<Box sx={{ textAlign: 'left' }}>
				<hr />
				<Typography>Settings:</Typography>
				<Typography component={'div'}><pre>{JSON.stringify(settings, null, 2)}</pre></Typography>
				<hr />
				<Typography>Effects:</Typography>
				<Typography component={'div'}><pre>{JSON.stringify(effects, null, 2)}</pre></Typography>
				<hr />
				<Typography>Controllers:</Typography>
				<Typography component={'div'}><pre>{JSON.stringify(controllers, null, 2)}</pre></Typography>
				<hr />
				<Typography>Devices:</Typography>
				<Typography component={'div'}><pre>{JSON.stringify(devices, null, 2)}</pre></Typography>
				<hr />
				<Typography>GlobalEffectConfig:</Typography>
				<Typography component={'div'}><pre>{JSON.stringify(globalEffectConfig, null, 2)}</pre></Typography>
				<hr />
				<Typography>Connections:</Typography>
				<Typography component={'div'}><pre>{JSON.stringify(connections, null, 2)}</pre></Typography>
				<hr />
				<Typography>Schema:</Typography>
				<Typography component={'div'}><pre>{JSON.stringify(schema, null, 2)}</pre></Typography>
				<hr />
			</Box>
		</Box>
	)
}

export default DevMenu
