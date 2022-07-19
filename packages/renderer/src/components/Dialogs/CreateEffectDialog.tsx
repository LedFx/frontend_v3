import { Ledfx } from "@/api/ledfx"
import { useStore } from "@/store/useStore"
import { Dialog, DialogTitle, DialogContent, Card, CardContent, Typography, Grid, CardActions, Button } from "@mui/material"

export interface CreateEffectDialogProps {
    open: boolean
    handleClose: () => void
}

export const CreateEffectDialog = (props: CreateEffectDialogProps) => {
    const effects = useStore((store) => store.api.schema.effect)
    const {open, handleClose} = props

    const effectCard = (effectType: string) => {
        return (
            <Card variant="outlined">
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        Category
                    </Typography>
                    <Typography variant="h5">{effectType}</Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        preview
                    </Typography>
                    <Typography variant="body2">
                        description
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <Button variant="outlined" onClick={async ()=>(
                        await Ledfx("/api/effects", "POST", {"type": effectType})
                    )}>Create</Button>
                </CardActions>
            </Card>
        )
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Create Effect</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    {Object.entries(effects.types).map(([_, effectType]) => (
                        <Grid item xs={4}>
                            {effectCard(effectType)}
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>
        </Dialog>
    )

}