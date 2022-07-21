/* eslint-disable no-plusplus */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useStore } from '../store/useStore'
import { useLocation } from 'react-router-dom'
import Sockette from 'sockette'
import { VariantType } from 'notistack'
import { controller, device, effect, effectConfig, connections, settings } from '@/store/interfaces'

enum eventType {
  Log,
  Shutdown,
  EffectRender,
  EffectUpdate,
  EffectDelete,
  GlobalEffectUpdate,
  ControllerUpdate,
  ControllerDelete,
  DeviceUpdate,
  DeviceDelete,
  ConnectionsUpdate,
  SettingsUpdate,
}

interface LedFxEvent {
  Timestamp: string,
  Type: eventType,
  Title: string,
  Data: Record<string, any>
}

function handleMessage(e: MessageEvent) {
	const showSnackbar = useStore.getState().ui.showSnackbar
	const setController = useStore.getState().api.setController
	const setDevice = useStore.getState().api.setDevice
	const setEffect = useStore.getState().api.setEffect
	const getEffects = useStore.getState().api.getEffects
	const getDevices = useStore.getState().api.getDevices
	const getControllers = useStore.getState().api.getControllers
	const setGlobalEffectConfig = useStore.getState().api.setGlobalEffectConfig
	const setConnections = useStore.getState().api.setConnections
	const setSettings = useStore.getState().api.setSettings
	const event: LedFxEvent = JSON.parse(e.data)
	switch (event.Type) {
	case eventType.Log:
		showSnackbar(event.Data.level as VariantType, event.Data.msg)
		break
	case eventType.EffectUpdate:
		setEffect(event.Data as effect)
		break
	case eventType.DeviceUpdate:
		setDevice(event.Data as device)
		break
	case eventType.ControllerUpdate:
		setController(event.Data as controller)
		break
	case eventType.EffectDelete:
		getEffects()
		break
	case eventType.DeviceDelete:
		getDevices()
		break
	case eventType.ControllerDelete:
		getControllers()
		break
	case eventType.GlobalEffectUpdate:
		setGlobalEffectConfig(event.Data.config as effectConfig)
		break
	case eventType.ConnectionsUpdate:
		setConnections(event.Data as connections)
		break
	case eventType.SettingsUpdate:
		setSettings(event.Data.settings as settings)
		break
	case eventType.Shutdown:
		console.log('Shutdown event!')
		break
	default:
		console.log('Event type not implemented:', event.Type)
	}
}

function createSocket() {
	const _ws = new Sockette(
		`${import.meta.env.VITE_CORE_PROTOCOL === 'https' ? 'wss' : 'ws'}://${import.meta.env.VITE_CORE_HOST || 'localhost'}:${import.meta.env.VITE_CORE_PORT || '8080'}/websocket`,
		{
			timeout: 5e3,
			maxAttempts: 10,
			onopen: (e: Event) => {
				console.log('Connected to LedFx Server', e);
				(_ws as any).ws = e.target
			},
			onmessage: (e: Event) => {
				handleMessage(e as MessageEvent)
			},
			onreconnect: (e: Event) => console.log('Reconnecting to LedFx Server...', e),
			onmaximum: (e: Event) => console.log('Maximum reconnect attempts to LedFx Server', e),
			onclose: (e: Event) => {
				console.log('Disconnected from LedFx Server', e)
				// document.dispatchEvent(
				//   new CustomEvent("disconnected", {
				//     detail: {
				//       isDisconnected: true
				//     }
				//   })
				// );
			},
			// onerror: e => console.log('Error:', e)
		}
	)
	return _ws
}
const ws = createSocket()
export default ws
export const WsContext = React.createContext(ws)

export const HandleWs = () => {
	const { pathname } = useLocation()
	const [wsReady, setWsReady] = useState(false)

	useLayoutEffect(() => {
		if (!wsReady) {
			if (ws && (ws as any).ws) {
				setWsReady(true)
			}
		}
	}, [pathname])

	useEffect(() => {
		if (wsReady) {
			const getWs = async () => {
				const request = {
					message: 'frontend connected',
					id: 1,
					type: 'success',
				};
				(ws as any).send(JSON.stringify(++request.id && request))
			}
			getWs()

			return () => {
				const removeGetWs = async () => {
					const request = {
						id: 2,
						type: 'unsubscribe_event',
						event_type: 'visualisation_update',
					};
					(ws as any).send(JSON.stringify(++request.id && request))
				}
				removeGetWs()
			}
		}
	}, [wsReady])

	useEffect(() => {
		if (!wsReady) {
			if (ws && (ws as any).ws) {
				setWsReady(true)
			}
		}
	}, [wsReady, ws])

	return null
}
