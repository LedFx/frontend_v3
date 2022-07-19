import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Chat, Close, Code, GitHub, Language, Menu as MenuIcon, ShoppingCart } from '@mui/icons-material';
import { IconButton, ListItemIcon } from '@mui/material';
import { useStore } from '@/store/useStore';

export default function TopMenu() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const setDrawerOpen = useStore((state) => state.ui.setDrawer)
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton onClick={handleClick} color="inherit">
                {open ? <Close /> : <MenuIcon />}
            </IconButton>

            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >

                <MenuItem onClick={()=>{window.open("https://ledfx.app", "_blank")}}><ListItemIcon><Language/></ListItemIcon>Website</MenuItem>
                <MenuItem onClick={()=>{window.open("https://git.ledfx.app", "_blank")}}><ListItemIcon><GitHub/></ListItemIcon>GitHub</MenuItem>
                <MenuItem onClick={()=>{window.open("https://discord.gg/wJ755dY", "_blank")}}><ListItemIcon><Chat/></ListItemIcon>Discord</MenuItem>
                <MenuItem onClick={()=>{window.open("https://www.etsy.com/shop/LedFx/", "_blank")}}><ListItemIcon><ShoppingCart/></ListItemIcon>Store</MenuItem>
                <MenuItem onClick={() => {
                    setDrawerOpen("right", true)
                    handleClose()
                }
                }><ListItemIcon><Code/></ListItemIcon>Dev</MenuItem>

            </Menu>
        </div>
    );
}
