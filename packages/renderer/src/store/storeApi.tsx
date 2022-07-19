import { Ledfx } from '@/api/ledfx'
import { settings, effect, device, virtual, schema, connections, effectConfig } from './interfaces'
import { useStore, produce } from './useStore'  

export const storeApi = {
	settings: {} as settings,
	effects: {} as Record<string, effect>,
	devices: {} as Record<string, device>,
	virtuals: {} as Record<string, virtual>,
	schema: {} as schema,
	connections: {} as connections,
	globalEffectConfig: {} as effectConfig,

	getSchema: async () => {
		let resp = await Ledfx('/api/effects/schema')
		if (resp) {
			useStore.setState(
				produce((state) => {
					state.api.schema.effect = resp as schema['effect']
				}),
				false,
				'api/getEffectSchema'
			)
		}
		resp = await Ledfx('/api/devices/schema')
		if (resp) {
			useStore.setState(
				produce((state) => {
					state.api.schema.device = resp as schema['device']
				}),
				false,
				'api/getDeviceSchema'
			)
		}
		resp = await Ledfx('/api/virtuals/schema')
		if (resp) {
			useStore.setState(
				produce((state) => {
					state.api.schema.virtual = resp as schema['virtual']
				}),
				false,
				'api/getVirtualSchema'
			)
		}
		resp = await Ledfx('/api/settings/schema')
		if (resp) {
			useStore.setState(
				produce((state) => {
					state.api.schema.setting = resp as schema['setting']
				}),
				false,
				'api/getSettingSchema'
			)
		}
	},
	getSettings: async () => {
		const resp = await Ledfx('/api/settings')
		if (resp) {
			useStore.setState(
				produce((state) => {
					state.api.settings = resp
				}),
				false,
				'api/getSettings'
			)
		}
	},
	getDevices: async () => {
		const resp = await Ledfx('/api/devices')
		if (resp) {
			useStore.setState(
				produce((state) => {
					state.api.devices = resp
				}),
				false,
				'api/getDevices'
			)
		}
	},
	getEffects: async () => {
		const resp = await Ledfx('/api/effects')
		if (resp) {
			useStore.setState(
				produce((state) => {
					state.api.effects = resp
				}),
				false,
				'api/getEffects'
			)
		}
	},
	getVirtuals: async () => {
		const configs = await Ledfx('/api/virtuals')
		const states = await Ledfx('/api/virtuals/state')
		if (configs && states) {
			useStore.setState(
				produce((state) => {
					const virts = {} as Record<string, virtual>
					for (const id in configs) {
						const v = {} as virtual
						v.id = id
						v.base_config = configs[id].base_config
						v.active = states[id]
						virts[id] = v
					}
					state.api.virtuals = virts
				}),
				false,
				'api/getVirtuals'
			)
		}
	},
	getConnections: async () => {
		const resp = await Ledfx('/api/virtuals/connect')
		if (resp) {
			useStore.setState(
				produce((state) => {
					state.api.connections = resp
				}),
				false,
				'api/getConnections'
			)
		}
	},
	getGlobalEffectConfig: async () => {
		const resp = await Ledfx('/api/effects/global')
		if (resp) {
			useStore.setState(
				produce((state) => {
					state.api.globalEffectConfig = resp
				}),
				false,
				'api/getGlobalEffectConfig'
			)
		}
	},
	setEffect: async (newEffect: effect) => {
		useStore.setState(
			produce((state) => {
				state.api.effects[newEffect.id] = { ...state.api.effects[newEffect.id], ...newEffect }
			}),
			false,
			'api/setEffect'
		)
	},
	setVirtual: async (newVirtual: virtual) => {
		useStore.setState(
			produce((state) => {
				state.api.virtuals[newVirtual.id] = { ...state.api.virtuals[newVirtual.id], ...newVirtual }
			}),
			false,
			'api/setVirtual'
		)
	},
	setDevice: async (newDevice: device) => {
		useStore.setState(
			produce((state) => {
				newDevice.id != null ?
					state.api.devices[newDevice.id] = { ...state.api.devices[newDevice.id], ...newDevice } : null
			}),
			false,
			'api/setDevice'
		)
	},
	setConnections: async (connections: connections) => {
		useStore.setState(
			produce((state) => {
				state.api.connections = connections
			}),
			false,
			'api/setConnections'
		)
	},
	setGlobalEffectConfig: async (config: effectConfig) => {
		useStore.setState(
			produce((state) => {
				state.api.globalEffectConfig = config
			}),
			false,
			'api/setGlobalEffectConfig'
		)
	},
	setSettings: async (settings: settings) => {
		useStore.setState(
			produce((state) => {
				state.api.settings = settings
			}),
			false,
			'api/setSettings'
		)
	},
	addDevice: async (device: device) => {
		const resp = await Ledfx('/api/devices', 'POST', {
			type: device.type,
			base_config: {
				name: device.base_config.name,
				pixel_count: device.base_config.pixel_count,
			},
			impl_config: {
				ip: device.impl_config.ip,
			},
		})
		// TODO: proper resp & resp handling
		if (resp) {
			console.log(resp)
		}

		// OR you could now do it like this, if you are enforcing device as a param
		// const res = await Ledfx('/api/devices', 'POST', device);
		// if (res) {
		//   console.log(res)
		// }
	},
}

