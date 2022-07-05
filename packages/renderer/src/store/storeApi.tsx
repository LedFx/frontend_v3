import { Ledfx } from '@/api/ledfx'
import produce from 'immer'

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

export const storeApi = (set: any) => ({
  settings: {} as settings,
  effects: {} as Record<string, effect>,
  devices: {} as Record<string, device>,
  virtuals: {} as Record<string, virtual>,
  connections: {} as connections,
  globalEffectConfig: {} as effectConfig,
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
