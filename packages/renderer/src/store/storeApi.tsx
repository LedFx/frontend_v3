import { Ledfx } from '@/api/ledfx'
import produce from 'immer'

export interface virtual {
  id: string
  base_config: {
    name: string
  }
  active: boolean
}

export interface device {
  id?: string
  type: string
  base_config: {
    name: string
    pixel_count: number
  }
  impl_config: Record<string, any>
  state?: deviceState
}

export interface effect {
  id: string
  type: string
  base_config: effectConfig
}

enum deviceState {
  Disconnected,
  Connected,
  Disconnecting,
  Connecting,
}

export interface connections {
  devices: Record<string, string>
  effects: Record<string, string>
}

export interface effectConfig {
  bkg_brightness: number
  bkg_color: string
  blur: number
  brightness: number
  decay: number
  flip: boolean
  freq_max: number
  freq_min: number
  hue_shift: number
  intensity: number
  mirror: boolean
  palette: string
  saturation: number
}

export interface settings {
  host: string
  port: number
  noLogo: boolean
  noUpdate: boolean
  noTray: boolean
  noScan: boolean
  openUi: boolean
  logLevel: number
}

// Schema interfaces

interface schema {
  effect: effectSchema
  device: deviceSchema
  virtual: Record<string, schemaEntry>
  setting: Record<string, schemaEntry>
}

interface schemaEntry {
  default: any
  description: string
  required: boolean
  title: string
  type: string
  validation: Record<string, any>
}

interface effectSchema {
  base: Record<string, schemaEntry>
  types: string[]
}

interface deviceSchema {
  base_config: Record<string, schemaEntry>
  impl_config: Record<string, schemaEntry>
  types: string[]
}


export const storeApi = (set: any, get: any) => ({
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
      set(
        produce((state: any) => {
          state.api.schema.effect = resp as schema['effect']
        }),
        false,
        'api/getEffectSchema'
      )
    }
    resp = await Ledfx('/api/devices/schema')
    if (resp) {
      set(
        produce((state: any) => {
          state.api.schema.device = resp as schema['device']
        }),
        false,
        'api/getDeviceSchema'
      )
    }
    resp = await Ledfx('/api/virtuals/schema')
    if (resp) {
      set(
        produce((state: any) => {
          state.api.schema.virtual = resp as schema['virtual']
        }),
        false,
        'api/getVirtualSchema'
      )
    }
    resp = await Ledfx('/api/settings/schema')
    if (resp) {
      set(
        produce((state: any) => {
          state.api.schema.settings = resp as schema['setting']
        }),
        false,
        'api/getSettingSchema'
      )
    }
  },
  getSettings: async () => {
    const resp = await Ledfx('/api/settings')
    if (resp) {
      set(
        produce((state: any) => {
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
      set(
        produce((state: any) => {
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
      set(
        produce((state: any) => {
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
      set(
        produce((state: any) => {
          const virts = {} as Record<string, virtual>
          for (const id in configs) {
            let v = {} as virtual
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
      set(
        produce((state: any) => {
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
      set(
        produce((state: any) => {
          state.api.globalEffectConfig = resp
        }),
        false,
        'api/getGlobalEffectConfig'
      )
    }
  },
  setEffect: async (newEffect: effect) => {
    set(
      produce((state: any) => {
        state.api.effects[newEffect.id] = { ...state.api.effects[newEffect.id], ...newEffect }
      }),
      false,
      'api/setEffect'
    )
  },
  setVirtual: async (newVirtual: virtual) => {
    set(
      produce((state: any) => {
        state.api.virtuals[newVirtual.id] = { ...state.api.virtuals[newVirtual.id], ...newVirtual }
      }),
      false,
      'api/setVirtual'
    )
  },
  setDevice: async (newDevice: device) => {
    set(
      produce((state: any) => {
        newDevice.id != null ? 
        state.api.devices[newDevice.id] = { ...state.api.devices[newDevice.id], ...newDevice } : null
      }),
      false,
      'api/setDevice'
    )
  },
  setConnections: async (connections: connections) => {
    set(
      produce((state: any) => {
        state.api.connections = connections
      }),
      false,
      'api/setConnections'
    )
  },
  setGlobalEffectConfig: async (config: effectConfig) => {
    set(
      produce((state: any) => {
        state.api.globalEffectConfig = config
      }),
      false,
      'api/setGlobalEffectConfig'
    )
  },
  setSettings: async (settings: settings) => {
    set(
      produce((state: any) => {
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
})

