import styles from '@/styles/app.module.scss'
import { useStore } from '../store/useStore'
import pkg from '../../../../package.json'
import Box from '@mui/material/Box'
import { useSnackbar } from 'notistack'
import { useEffect } from 'react'
import DrawerRight from '@/components/Drawer/DrawerRight'
import { Fab, Tooltip } from '@mui/material'
import { Refresh } from '@mui/icons-material'
import Flow from '../components/Flow/Flow'
import TopBar from '@/components/Bars/TopBar'
import { hydrateStore } from '@/App'

const ipcRenderer = window.ipcRenderer || false

const Home = () => {
	const snackbar = useStore((state) => state.ui.snackbar)
	const { enqueueSnackbar } = useSnackbar()
	const hydrate = hydrateStore()

	useEffect(() => {
		enqueueSnackbar(snackbar.message, { variant: snackbar.variant })
	}, [snackbar])

	return (
		<Box
			sx={{
				bgcolor: 'background.default',
				color: 'text.primary',
				overHorizontalFlowX: 'hidden',
			}}
			className={styles.app}>
			<div style={{
				width: '100%',
				height: ipcRenderer && pkg.env.VITRON_CUSTOM_TITLEBAR
					? 'calc(100vh - 30px)'
					: '100vh'
			}}>

				<TopBar />
				<Flow />
				<Tooltip arrow placement='left' title="If the interface is not updating, you can try to refresh it">
					<Fab color="primary" aria-label="add" sx={{ position: 'fixed', right: '1.3rem', bottom: '1.3rem' }} onClick={hydrate}>
						<Refresh />
					</Fab>
				</Tooltip>
				<DrawerRight />
			</div>
		</Box>
	)
}

export default Home
