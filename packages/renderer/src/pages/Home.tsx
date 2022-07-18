import styles from '@/styles/app.module.scss'
import { useStore } from '../store/useStore'
import pkg from '../../../../package.json'
import Box from '@mui/material/Box'
import { useSnackbar } from 'notistack'
import { useEffect } from 'react'
import DrawerRight from '@/components/Drawer/DrawerRight'
import { Fab } from '@mui/material'
import { Code } from '@mui/icons-material'
import Flow from '../components/Flow/Flow'
import TopBar from '@/components/Bars/TopBar'

const ipcRenderer = window.ipcRenderer || false

const Home = () => {
  const setDrawerOpen = useStore((state) => state.ui.setDrawer)
  const snackbar = useStore((state) => state.ui.snackbar)
  const { enqueueSnackbar } = useSnackbar()

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
              : '100vh' }}>
            
          <TopBar/>
          <Flow />
          <DrawerRight />          
        </div>
    </Box>
  )
}

export default Home
