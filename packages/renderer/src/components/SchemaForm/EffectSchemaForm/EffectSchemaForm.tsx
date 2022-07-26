import { Ledfx } from '@/api/ledfx'
import { effect, schemaEntry } from '@/store/interfaces'
import { useStore } from '@/store/useStore'
import { Grid, Slider, Switch, Typography } from '@mui/material'
import { useState } from 'react'
import Frame from '../Frame'
import { BlurOff, BlurOn, DoNotDisturb, TimerOff, Timer, InvertColorsOff, InvertColors, BrightnessLow, BrightnessHigh, FlashOff, FlashOn, AutoMode } from '@mui/icons-material'
import ReactGPicker from 'react-gcolor-picker'

const freqRange = (schemaEntryMax: schemaEntry, schemaEntryMin: schemaEntry) => {
	return (
		<Frame
			title="Frequency Range"
			tip="Reactive audio frequency range"
		>
			<Typography>Frequency Range</Typography>
		</Frame>
	)
}

export const EffectSchemaForm = (effect: effect) => {
	const schema = useStore((store) => store.api.schema.effect)
	const colors = useStore((store) => store.api.colors)
	const palettes = useStore((store) => store.api.palettes)
	const [config, setConfig] = useState(effect.base_config)

	console.log(Object.values(palettes).slice(0, 5))

	const floatSlider = (key: string, StartIcon: any, EndIcon: any) => {
		return (effect && // this prevents global effects from working?
			<Frame
				title={schema.base[key].title}
				tip={schema.base[key].description}
				style={{ columnGap: 15 }}
			>
				<StartIcon />
				<Slider
					min={schema.base[key].validation.min}
					max={schema.base[key].validation.max}
					step={0.01}
					value={config[key]}
					onChange={async (_: Event, newValue: number | number[]) => {
						setConfig({
							...config,
							[key]: newValue
						})
					}}
					onChangeCommitted={async (event) => {
						await Ledfx('/api/effects', 'PUT', {
							'id': effect.id,
							'base_config': { [key]: config[key] }
						})
					}}

				/>
				<EndIcon />
			</Frame>)
	}

	const colorPicker = (schemaEntry: schemaEntry) => {
		return (
			<Frame
				title={schemaEntry.title}
				tip={schemaEntry.description}
			>
				<Typography>Color Picker</Typography>
			</Frame>)
	}

	const gradientPicker = (key: string) => {
		return (
			<Frame
				title={schema.base[key].title}
				tip={schema.base[key].description}
			>
				<ReactGPicker
					showGradientAngle={false}
					showGradientMode={false}
					showGradientPosition={false}
					showGradientStops
					colorBoardHeight={150}
					debounce
					debounceMS={300}
					format="hex"
					gradient={true}
					solid={false}
					onChange={(c) => { }}
					popupWidth={288}
					showAlpha={false}
					value={config[key]}
					defaultColors={Object.values(palettes)}
				/>
			</Frame>)
	}

	const boolEntry = (key: string) => {
		return (
			<Frame
				title={schema.base[key].title}
				tip={schema.base[key].description}
			>
				<Switch
					value={!config[key]}
					onChange={async (event) => {
						console.log(event)
						console.log(config)
						setConfig({
							...config,
							[key]: !config[key]
						})
						console.log(config)
						await Ledfx('/api/effects', 'PUT', {
							'id': effect.id,
							'base_config': { [key]: config[key] },
						})
					}} />
			</Frame>)
	}

	return (
		<>
			<Grid container alignItems="stretch" spacing={2}>
				<Grid item xs={6}>
					{floatSlider('intensity', FlashOff, FlashOn)}
				</Grid>
				<Grid item xs={6}>
					{floatSlider('decay', TimerOff, Timer)}
				</Grid>
				<Grid item xs={6}>
					{floatSlider('blur', BlurOff, BlurOn)}
				</Grid>
				<Grid item xs={6}>
					{floatSlider('hue_shift', DoNotDisturb, AutoMode)}
				</Grid>
				<Grid item xs={6}>
					{floatSlider('brightness', BrightnessLow, BrightnessHigh)}
				</Grid>
				<Grid item xs={6}>
					{floatSlider('saturation', InvertColorsOff, InvertColors)}
				</Grid>
				<Grid item xs={6}>
					<gradientPicker key="palette"/>
				</Grid>
				<Grid item xs={3}>
					{boolEntry('flip')}
				</Grid>
				<Grid item xs={3}>
					{boolEntry('mirror')}
				</Grid>
				<Grid item xs={12}>
					{freqRange(schema.base.freq_max, schema.base.freq_min)}
				</Grid>
				<Grid item xs={6}>
					{colorPicker(schema.base.bkg_color)}
				</Grid>
				<Grid item xs={6}>
					{floatSlider('bkg_brightness', BrightnessLow, BrightnessHigh)}
				</Grid>
			</Grid>
		</>
	)
}