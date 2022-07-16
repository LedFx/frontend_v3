import Drawer from '@mui/material/Drawer';
import { useStore } from '../../store/useStore'
import DevMenu from '../DevMenu';

const DrawerRight = () => {
  const drawerOpen = useStore((state) => state.ui.drawer.right)
  const setDrawerOpen = useStore((state) => state.ui.setDrawer)

  return (
      <Drawer
        anchor={'right'}
        open={drawerOpen}
        onClose={() => setDrawerOpen('right', false)}
      >
        <DevMenu />
      </Drawer>
  );
}
export default DrawerRight
