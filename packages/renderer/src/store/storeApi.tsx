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
  id: string
  type: string
  base_config: {
    name: string
    pixel_count: number
  }
  impl_config: Record<string, any>
  state: deviceState
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
  addDevice: async () => {
    const resp = await Ledfx('/api/devices', 'POST', {
      "type": "UDP Stream",
      "base_config": {
        "name": "test device udp",
        "pixel_count": 64
      },
      "impl_config": {
        "ip": "192.168.0.69"
      }
    });
    // TODO: proper resp & resp handling
    if (resp) {
      console.log(resp)
    }
  },
})
