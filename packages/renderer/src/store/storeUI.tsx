import { VariantType } from 'notistack'
import { useStore, produce } from './useStore';

export const storeUI = {
  darkMode: false,
  snackbar: {
    isOpen: false,
    variant: 'info' as VariantType,
    message: 'Welcome to LedFx v3'
  },
  drawer: {
    top: false,
    bottom: false,
    left: false,
    right: false,

  },
  showSnackbar: (variant: VariantType, message: string): void =>
   useStore.setState(
      produce((state) => {
        state.ui.snackbar = { isOpen: true, message, variant };
      }),
      false,
      'ui/showSnackbar'
    ),
  setDrawer: (variant: 'top' | 'bottom' | 'left' | 'right', open: boolean): void =>
   useStore.setState(
      produce((state) => {
        state.ui.drawer[variant] = open;
      }),
      false,
      'ui/setDrawer'
    ),
  setDarkMode: (dark: boolean): void =>
    useStore.setState(
      produce((state) => {
        state.ui.darkMode = dark
      }),
      false,
      "ui/darkmode"),
};
