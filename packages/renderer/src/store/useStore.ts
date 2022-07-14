import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { combine } from 'zustand/middleware';
import { storeApi } from './storeApi'
import { storeUI } from './storeUI';
export type State = ReturnType<typeof useStore.getState>;


export const useStore = create(
  devtools(
    combine(
      {
        hackedBy: 'Blade',
      },
      (set, get)=> ({
        ui: storeUI(set),
        api: storeApi(set, get),
        disconnected: true
      })
    )
  )
);
