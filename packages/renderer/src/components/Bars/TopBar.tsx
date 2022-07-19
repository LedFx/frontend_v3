import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import TopMenu from './TopMenu'


export default function TopBar() {
	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            LedFx V3
					</Typography>
					<TopMenu/>
				</Toolbar>
			</AppBar>
		</Box>
	)
}
