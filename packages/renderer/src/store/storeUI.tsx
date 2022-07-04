import produce from 'immer'
import { VariantType } from 'notistack'

export const storeUI = (set:any) => ({
  darkMode: false,
  snackbar: {
    isOpen: false,
    variant: 'info' as VariantType,
    message: 'Welcome to LedFx v3'
  },
  showSnackbar: (variant: VariantType, message: string): void =>
    set(
      produce((state: any) => {
        state.ui.snackbar = { isOpen: true, message, variant };
      }),
      false,
      'ui/showSnackbar'
    ),
  setDarkMode: (dark: boolean):void => set(produce((state:any) => { state.ui.darkMode = dark }), false, "ui/darkmode"),    
})
