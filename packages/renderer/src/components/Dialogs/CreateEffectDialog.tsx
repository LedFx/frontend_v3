import { Ledfx } from '@/api/ledfx'
import { effectInfo, effectSchema } from '@/store/interfaces'
import { useStore } from '@/store/useStore'
import { Dialog, DialogTitle, DialogContent, Card, CardContent, Typography, Grid, CardActions, Button, Chip, Stack, Box } from '@mui/material'

export interface CreateEffectDialogProps {
    open: boolean
    handleClose: () => void
}

export const CreateEffectDialog = (props: CreateEffectDialogProps) => {
    const effects = useStore((store) => store.api.schema.effect)
    const { open, handleClose } = props

    const effectCard = (effectType: string) => {
        const effectInfo = effects.types[effectType as keyof effectSchema["types"]]
        return (
            <Card variant="outlined" style={{ "height": "100%" }}>
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {effectInfo.category}
                    </Typography>
                    <Typography variant="h5">{effectType}</Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {effectInfo.description}
                    </Typography>
                    <Typography variant="body2">
                        Preview will go here
                    </Typography>

                </CardContent>
                <CardActions>
                    <Stack direction="row" spacing={1} alignItems="center">
                        {Object.entries(effectInfo.good_for).map(([_, tip], i: number) => (
                            <Chip key={i} label={tip} variant="outlined" />
                        ))}
                    </Stack>
                    <Box sx={{ justifyContent: 'flex-end', display: 'flex', width: "100%" }}>
                        <Button variant="outlined" onClick={async () => {
                            await Ledfx('/api/effects', 'POST', { 'type': effectType })
                            handleClose()
                        }}>Create</Button>
                    </Box>
                </CardActions>
            </Card>
        )
    }

    return (
        effects && <Dialog open={open} onClose={handleClose} maxWidth="lg">
            <DialogTitle>Create Effect</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    {Object.entries(effects.types).map(([effectType, _], i: number) => (
                        <Grid item xs={6} key={i}>
                            {effectCard(effectType)}
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>
        </Dialog>
    )

}