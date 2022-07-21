import { Ledfx } from '@/api/ledfx'
import { controller } from '@/store/interfaces'
import { useStore } from '@/store/useStore'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Input, Slider } from '@mui/material'
import { useEffect, useState } from 'react'
import Frame from '../SchemaForm/Frame'

export interface CreateControllerDialogProps {
    id?: string
    open: boolean
    handleClose: () => void
}

export const CreateControllerDialog = (props: CreateControllerDialogProps) => {
	const controllerSchema = useStore((store) => store.api.schema.controller)
	const controllers = useStore((store) => store.api.controllers)
	const [config, setConfig] = useState({} as controller['base_config'])
	const { id, open, handleClose } = props
	const [valid, setValid] = useState(id!==undefined)

	const applyDefaults = () => {
		if (controllerSchema) {            
			if (id === undefined) {
				setConfig({
					name: controllerSchema['name'].default,
					framerate: controllerSchema['framerate'].default
				})
			} else {
				const controller = controllers[id]
				setConfig({
					name: controller.base_config?.name,
					framerate: controller.base_config?.framerate 
				})
			}
		}
	}

	useEffect(applyDefaults, [])

	return controllerSchema && (
		<Dialog open={open} onClose={handleClose} >
			<DialogTitle>{id===undefined?'Create':'Configure'} Controller</DialogTitle>
			<DialogContent>
				<Frame
					title={controllerSchema['name'].title}
					tip={controllerSchema['name'].description}
				>
					<Input
						value={config.name || ''}
						error={!valid}
						onChange={(event) => {
							setConfig({
								...config,
								name: event.target.value
							})
							setValid(event.target.value !== '')
						}}
					/>
				</Frame>
				<Frame
					title={controllerSchema['framerate'].title}
					tip={controllerSchema['framerate'].description}
				>
					<Slider
						min={controllerSchema['framerate'].validation.min}
						max={controllerSchema['framerate'].validation.max}
						valueLabelDisplay="auto"
						step={5}
						marks
						value={config.framerate}
						onChange={(_event: Event, newValue: number | number[], _activeThumb: number) => {
							setConfig({
								...config,
								framerate: typeof newValue === 'number' ? newValue : 0,
							})
						}}
					/>
				</Frame>
			</DialogContent>
			<DialogActions>
				<Button disabled={!valid} variant="outlined" onClick={async () => {
					await Ledfx('/api/controllers', 'POST', { 'id': id, 'base_config': config })
					handleClose()
				}}>{id===undefined?'Create':'Update'}</Button>
			</DialogActions>
		</Dialog>
	)
}
