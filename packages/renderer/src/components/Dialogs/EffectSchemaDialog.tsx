import { effect } from '@/store/interfaces'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { EffectSchemaForm } from '../SchemaForm/EffectSchemaForm/EffectSchemaForm'

export interface EffectSchemaProps {
    effect?: effect
    open: boolean
    handleclose: () => void
}

export const EffectSchemaDialog = (props: EffectSchemaProps) => {
	const { effect, open, handleclose } = props

	return (
		<Dialog open={open} onClose={handleclose}>
			<DialogTitle textTransform="capitalize">{effect? `${effect.type} effect - settings` : 'Modify settings for all effects'}</DialogTitle>
			<DialogContent>
				{EffectSchemaForm(effect)}
			</DialogContent>
		</Dialog>
	)
}
