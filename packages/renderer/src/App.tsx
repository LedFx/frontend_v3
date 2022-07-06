import { useEffect, useMemo } from 'react'
import Example from './pages/example/Example'
import { useStore } from './store/useStore'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Info from './pages/example/Info'
import pkg from '../../../package.json'
import Home from './pages/Home'
import { SnackbarProvider } from 'notistack'
import ws, { WsContext } from './api/Websocket'

const App = () => {
  const darkMode = useStore((state) => state.ui.darkMode)
  const showSnackbar = useStore((state) => state.ui.showSnackbar)

  const theme = useMemo(
    () =>
      createTheme({
        components: {
          MuiButton: {
            defaultProps: {
              variant: 'contained',
              size: 'small',
            },
          },
          MuiChip: {
            defaultProps: {
              variant: 'outlined',
              sx: {
                m: 0.3,
              },
            },
          },
        },
        palette: {
          primary: {
            main:
              pkg.env.VITRON_PRIMARY_COLOR === 'default'
                ? '#1976d2'
                : pkg.env.VITRON_PRIMARY_COLOR,
          },
          mode: darkMode ? 'dark' : 'light',
        },
      }),
    [darkMode]
  )

  useEffect(() => {
    const handleWebsockets = (e: any) => {
      showSnackbar(e.detail.type, e.detail.message)
    }
    document.addEventListener('YZNEW', handleWebsockets)
    return () => {
      document.removeEventListener('YZNEW', handleWebsockets)
    }
  }, [])
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={5}>
        <WsContext.Provider value={ws}>
          <HashRouter>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/Example' element={<Example />} />
              <Route path='/Info' element={<Info />} />
            </Routes>
          </HashRouter>
        </WsContext.Provider>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default App
