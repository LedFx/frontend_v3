import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { combine } from 'zustand/middleware';
import { storeApi } from './storeApi'
import { storeUI } from './storeUI';

export const useStore = create(
  devtools(
    combine(
      {
        hackedBy: 'Blade',
      },
      (set:any, get: any)=> ({
        ui: storeUI(set),
        api: storeApi(set, get)
      })
    )
  )
);
