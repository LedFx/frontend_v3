import { Ledfx } from '@/api/ledfx'
import { effectInfo, effectSchema } from '@/store/interfaces'
import { useStore } from '@/store/useStore'
import { Dialog, DialogTitle, DialogContent, Card, CardContent, Typography, Grid, CardActions, Button } from '@mui/material'

export interface CreateEffectDialogProps {
    open: boolean
    handleClose: () => void
}

export const CreateEffectDialog = (props: CreateEffectDialogProps) => {
	const effects = useStore((store) => store.api.schema.effect)
	const {open, handleClose} = props

	const effectCard = (effectType: string) => {
        const effectInfo = effects.types[effectType as keyof effectSchema["types"]]
		return (
			<Card variant="outlined">
				<CardContent>
					<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {effectInfo.category}
					</Typography>
					<Typography variant="h5" text-transform="capitalize">{effectType}</Typography>
					<Typography sx={{ mb: 1.5 }} color="text.secondary">
                        preview
					</Typography>
					<Typography variant="body2">
                        {effectInfo.description}
					</Typography>
					<Typography variant="body2" color="text.secondary">
                        {effectInfo.good_for}
					</Typography>
				</CardContent>
				<CardActions disableSpacing>
					<Button variant="outlined" onClick={async ()=>{
						await Ledfx('/api/effects', 'POST', {'type': effectType})
                        handleClose()
                    }}>Create</Button>
				</CardActions>
			</Card>
		)
	}

	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle>Create Effect</DialogTitle>
			<DialogContent>
				<Grid container spacing={2}>
					{Object.entries(effects.types).map(([effectType, _],i:number) => (
						<Grid item xs={4} key={i}>
							{effectCard(effectType)}
						</Grid>
					))}
				</Grid>
			</DialogContent>
		</Dialog>
	)

}