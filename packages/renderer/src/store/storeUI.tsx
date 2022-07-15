import { VariantType } from 'notistack'
import { useStore, produce } from './useStore';

export const storeUI = {
  darkMode: false,
  snackbar: {
    isOpen: false,
    variant: 'info' as VariantType,
    message: 'Welcome to LedFx v3'
  },
  showSnackbar: (variant: VariantType, message: string): void =>
   useStore.setState(
      produce((state) => {
        state.ui.snackbar = { isOpen: true, message, variant };
      }),
      false,
      'ui/showSnackbar'
    ),
  setDarkMode: (dark: boolean): void =>
    useStore.setState(
      produce((state) => {
        state.ui.darkMode = dark
      }),
      false,
      "ui/darkmode"),
};
