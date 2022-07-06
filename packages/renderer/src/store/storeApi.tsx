import { Ledfx } from '@/api/ledfx'
import produce from 'immer'
import { useStore } from './useStore'

interface connections {
  devices: Record<string, string>
  effects: Record<string, string>
}

interface virtual {
  id: string
  base_config: {
    name: string
  }
  active: boolean
}

enum deviceState {
  Disconnected,
  Connected,
  Disconnecting,
  Connecting,
}

interface device {
  id?: string
  type: string
  base_config: {
    name: string
    pixel_count: number
  }
  impl_config: Record<string, any>
  state?: deviceState
}

interface effect {
  id: string
  type: string
  base_config: effectConfig
}

interface effectConfig {
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

interface settings {
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


// startup operations flow
// 1. get schema into store
// 2. use schema to generate effect (interface) populated with defaults
// 3. get effects (will be partial config)
// 4. for each effect:
//  .   update default effect interface with config
//  .   save to store
// 5. repeat for devices, settings, virtuals







export const storeApi = (set: any) => ({
  settings: {} as settings,
  effects: {} as Record<string, effect>,
  devices: {} as Record<string, device>,
  rawDevices: {} as any,
  virtuals: {} as Record<string, virtual>,
  schema: {} as schema,
  connections: {} as connections,
  globalEffectConfig: {} as effectConfig,

  getSchema: async () => {
    // hydrate schema
    let resp = await Ledfx('/api/effects/schema')
    if (resp) {
      set(
        produce((state: any) => {
          state.api.schema.effect = resp as schema["effect"]
        }),
        false,
        'api/getEffectSchema'
      )
    }
    resp = await Ledfx('/api/devices/schema')
    if (resp) {
      set(
        produce((state: any) => {
          state.api.schema.device = resp as schema["device"]
        }),
        false,
        'api/getDeviceSchema'
      )
    }
    resp = await Ledfx('/api/virtuals/schema')
    if (resp) {
      set(
        produce((state: any) => {
          state.api.schema.virtual = resp as schema["virtual"]
        }),
        false,
        'api/getVirtualSchema'
      )
    }
    resp = await Ledfx('/api/settings/schema')
    if (resp) {
      set(
        produce((state: any) => {
          state.api.schema.settings = resp as schema["setting"]
        }),
        false,
        'api/getSettingSchema'
      )
    }
  },
  enrichDevices: () => {
    //console.log.keys(useStore.getState().api.rawDevices)
  },
  getDefaultDeviceConfig: (deviceType: string): device["impl_config"] => {
    const config = {} as Record<string, any>
    const deviceSchema = useStore.getState().api.schema.device[deviceType]
    for (const [key, value] of deviceSchema) {
      config[key] = value.default
    }
    console.log("PITA WORKS", config)
    return config as device["impl_config"]
  },
  // Returns a fully filled effect config using the store's schema 
  // getDefaultDeviceConfig: (deviceSchema: schema["device"], deviceType: string, deviceId: string) => {
  //   // Do not modify state, just give back default config for type
  //   // use schema in state to build it
  //   console.log("NEW PITA", deviceSchema.impl[deviceType], "?")
  //   set(
  //     produce((state: any) => {
  //       state.api.devices[deviceId].impl_config = { ...deviceSchema.impl[deviceType], ...state.api.devices[deviceId].impl_config } // so at a certain key right? but only when updating effects?
  //     }), // this is a helper function for parsing the effects we receive, it returns an effectConfig set to defaults which we use to create effects in the store
  //     // it is based off the schema, which we get once at the
  //     false,
  //     'api/getDeviceConfig'
  //   )
  // },
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
      // const res = { ...resp }
      set(
        produce((state: any) => {
          // state.api.devices = Object.keys(res).map(deviceId => Object.keys(state.api.schema.device.impl).map(deviceType =>
          //   res[deviceId].impl_config = { ...state.api.schema.device.impl[deviceType], ...res[deviceId].impl_config }
          // ))


          // const devices = resp
          // for (const id in devices) {
          //   const device = devices[id] as device
          //   console.log("OH", device.type)
          //   console.log("nice", state.api?.schema?.device?.impl[device.type])
          //   const default_impl = getDefaultDeviceConfig(state.api.schema.device.impl[device.type]).then(()=>{
          //     devices[id].impl_config = { ...default_impl, ...device.impl_config }
          //   })
            
          // }
          state.api.rawDevices = resp
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
  addDevice: async (device: device) => {
    const resp = await Ledfx('/api/devices', 'POST', {
      "type": device.type,
      "base_config": {
        "name": device.base_config.name,
        "pixel_count": device.base_config.pixel_count
      },
      "impl_config": {
        "ip": device.impl_config.ip
      }
    });
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
