import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { combine } from 'zustand/middleware';
import { storeApi } from './storeApi'
import { storeBears } from './storeBears';
import { storeTours } from './storeTours';
import { storeUI } from './storeUI';

export const useStore = create(
  devtools(
    combine(
      {
        hackedBy: 'Blade',
      },
      (set:any, get: any)=> ({
        ui: storeUI(set),
        api: storeApi(set, get),
        tours: storeTours(set),
        example: storeBears(set)
      })
    )
  )
);
