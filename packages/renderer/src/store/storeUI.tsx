import produce from 'immer'
import { VariantType } from 'notistack'
import { State, useStore } from './useStore';

export const storeUI = (set: any) => ({
  darkMode: false,
  snackbar: {
    isOpen: false,
    variant: 'info' as VariantType,
    message: 'Welcome to LedFx v3'
  },
  showSnackbar: (variant: VariantType, message: string): void =>
   useStore.setState(
      produce((state: any) => {
        state.ui.snackbar = { isOpen: false, message, variant };
      }),
      false,
      'ui/showSnackbar'
    ),
  setDarkMode: (dark: boolean): void =>
    useStore.setState(
      produce<State>((state) => {
        state.ui.darkMode = dark
      }),
      false,
      "ui/darkmode"),
})
