/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
import { useEffect } from 'react'
import { useStore } from '../../../../store/useStore'
import GradientPicker from './GradientPicker'

const GradientPickerWrapper = ({
	pickerBgColor,
	title,
	index,
	virtId,
	isGradient = false,
	wrapperStyle,
}: any) => {
	const updateControllerEffect = useStore((state) => state.updateControllerEffect)
	const getControllers = useStore((state) => state.getControllers)
	const controllers = useStore((state) => state.controllers)
	const colors = useStore((state) => state.colors)
	const getColors = useStore((state) => state.getColors)
	const addColor = useStore((state) => state.addColor)

	const getV = () => {
		for (const prop in controllers) {
			if (controllers[prop].id === virtId) {
				return controllers[prop]
			}
		}
	}

	const controller = getV()

	const sendColorToControllers = (e: any) => {
		if (controller && controller.effect && controller.effect.type) {
			updateControllerEffect(
				controller.id,
				controller.effect.type,
				{ [title]: e },
				false
			).then(() => {
				getControllers()
			})
		}
	}

	const handleAddGradient = (name: string) => {
		addColor({ [name]: pickerBgColor }).then(() => {
			getColors()
		})
	}

	useEffect(() => {
		getColors()
	}, [])

	return (
		<GradientPicker
			pickerBgColor={pickerBgColor}
			title={title}
			index={index}
			isGradient={isGradient}
			wrapperStyle={wrapperStyle}
			colors={colors}
			handleAddGradient={handleAddGradient}
			sendColorToControllers={sendColorToControllers}
		/>
	)
}
export default GradientPickerWrapper
