import { Ledfx } from '@/api/ledfx'
import { audioDevice } from '@/store/interfaces'
import { Dialog, DialogContent, DialogTitle, List, ListItem, ListItemText, Button } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'

export const AudioDeviceDialog = (open: boolean, handleClose: () => void) => {
	const [audioDevices, setAudioDevices] = useState<audioDevice[]>([])

	useEffect(() => {
		Ledfx('/api/bridge/get/inputs/local', 'GET').then(
			resp => setAudioDevices(resp as audioDevice[])
		)
	}, [])

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="md">
			<DialogTitle>Audio Inputs</DialogTitle>
			<DialogContent>
				<Box sx={{ width: '100%' }}>
					<List>
						{
							audioDevices.map((ad, i) => (
								<ListItem key={i} >
									<ListItemText primary={ad.name} />
									<Button variant="outlined" onClick={
										async () => { await Ledfx('/api/bridge/set/input/local', 'PUT', { 'device_id': ad.id }); handleClose() }}
									>Select</Button>
								</ListItem>
							))
						}
					</List>
				</Box>
			</DialogContent>
		</Dialog>
	)
}