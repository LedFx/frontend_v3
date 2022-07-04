import { Ledfx } from '@/api/ledfx'
import produce from 'immer'

export const storeApi = (set: any) => ({
  settings: null as any,
  getSettings: async () => {
    const resp = await Ledfx('/api/settings')
    console.log(resp)
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
  scanForDevices: async () => {
    const resp = await Ledfx('/api/find_devices', 'POST', {});
    if (!(resp && resp.status === 'success')) {
      set(
        produce((state: any) => {
          state.ui.snackbar.message = JSON.stringify(resp);
        }),
        false,
        'api/scanForDevices'
      );
    }
  },
})
