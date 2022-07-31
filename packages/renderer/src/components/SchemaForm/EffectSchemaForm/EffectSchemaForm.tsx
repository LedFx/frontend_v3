import { Ledfx } from '@/api/ledfx'
import { effect, effectConfig } from '@/store/interfaces'
import { useStore } from '@/store/useStore'
import { AutoMode, BlurOff, BlurOn, BrightnessHigh, BrightnessLow, DoNotDisturb, Edit, FlashOff, FlashOn, InvertColors, InvertColorsOff, Timer, TimerOff } from '@mui/icons-material'
import { Button, Dialog, Grid, IconButton, Slider, Switch } from '@mui/material'
import { palette } from '@mui/system'
import { useState } from 'react'
import ReactGPicker from 'react-gcolor-picker'
import Frame from '../Frame'

// frequency slider consts
const log13 = (x: number) => Math.log(x) / Math.log(13)
const logIt = (x: number) => 3700.0 * log13(1 + x / 200.0)
const hzIt = (x: number) => Math.round(200.0 * 13 ** (x / 3700.0) - 200.0)

const freqMarks = [
	{
		value: logIt(60),
		label: 'Beat',
	},
	{
		value: logIt(350),
		label: 'Bass',
	},
	{
		value: logIt(2000),
		label: 'Vocals, Instruments',
	},
	{
		value: logIt(10000),
		label: 'Highs, Percussion',
	},
]

export const EffectSchemaForm = (effect: effect | undefined) => {
	const defaultEffectConfig = () => {
		return Object.entries(schema.base).reduce(
			(acc, [key, value]) => ({ ...acc, [key]: value.default }),
			{}
		)
	}
	const [paletteOpen, setPaletteOpen] = useState(false)
	const [bkgOpen, setBkgOpen] = useState(false)

	const schema = useStore((store) => store.api.schema.effect)
	const colors = useStore((store) => store.api.colors)
	const palettes = useStore((store) => store.api.palettes)
	const config = useStore((store) => effect ?
		store.api.effects.hasOwnProperty(effect.id) && store.api.effects[effect.id].base_config :
		store.api.globalEffectConfig
	)
	const setConfig = useStore((store) => effect ?
		(newConfig: object) => store.api.setEffect({ ...effect, 'base_config': { ...config, ...newConfig } }) :
		store.api.setGlobalEffectConfig
	)

	const floatSlider = (key: keyof effectConfig, StartIcon: any, EndIcon: any) => {
		return (schema && schema.base[key] &&// this prevents global effects from working?
			<Frame
				title={schema.base[key].title}
				tip={schema.base[key].description}
				style={{ columnGap: 15 }}
			>
				<IconButton onClick={async () => {
					setConfig({
						[key]: schema.base[key].validation.min
					})
					if (effect === undefined) {
						await Ledfx('/api/effects/global', 'PUT', {
							[key]: schema.base[key].validation.min
						})
					} else {
						await Ledfx('/api/effects', 'PUT', {
							'id': effect.id,
							'base_config': { [key]: schema.base[key].validation.min }
						})
					}
				}}>
					<StartIcon />
				</IconButton>
				<Slider
					min={schema.base[key].validation.min}
					max={schema.base[key].validation.max}
					step={0.01}
					value={config[key] as number}
					onChange={(_: Event, newValue: number | number[]) => {
						setConfig({
							[key]: newValue
						})
					}}
					onChangeCommitted={async () => {
						if (effect === undefined) {
							await Ledfx('/api/effects/global', 'PUT', {
								[key]: config[key]
							})
						} else {
							await Ledfx('/api/effects', 'PUT', {
								'id': effect.id,
								'base_config': { [key]: config[key] }
							})
						}
					}}

				/>
				<IconButton onClick={async () => {
					setConfig({
						[key]: schema.base[key].validation.max
					})
					if (effect === undefined) {
						await Ledfx('/api/effects/global', 'PUT', {
							[key]: schema.base[key].validation.max
						})
					} else {
						await Ledfx('/api/effects', 'PUT', {
							'id': effect.id,
							'base_config': { [key]: schema.base[key].validation.max }
						})
					}
				}}>
					<EndIcon />
				</IconButton>
			</Frame>)
	}

	const Picker = (props: { type: 'palette' | 'background_color', open: boolean, setOpen }) => {
		const { type, open, setOpen } = props
		const predefs = type == 'palette' ? palettes : colors

		return (schema.base[type] &&
			<Frame
				title={schema.base[type].title}
				tip={schema.base[type].description}
			>
				<Button
					style={{
						width: '100%',
						height: '40px',
						background: config.hasOwnProperty(type) && (predefs[config[type].toLowerCase()] || config[type])
					}}
					onClick={() => { setOpen(true) }}
					startIcon={<Edit />}
				/>
				<Dialog
					open={open}
					onClose={() => { setOpen(false) }}
				>
					<ReactGPicker
						showGradientAngle={false}
						showGradientMode={false}
						showGradientPosition={false}
						showGradientStops={true}
						showInputs={false}
						colorBoardHeight={150}
						debounce
						debounceMS={200}
						format="rgb"
						gradient={type == 'palette'}
						solid={type == 'background_color'}
						onChange={async (c) => {
							setConfig({
								[type]: c
							})
							effect !== undefined ? await Ledfx('/api/effects', 'PUT', {
								'id': effect.id,
								'base_config': { [type]: c }
							}) : await Ledfx('/api/effects/global', 'PUT', {
								[type]: c
							})
						}}
						popupWidth={288}
						showAlpha={false}
						value={config.hasOwnProperty(type) && (predefs[config[type].toLowerCase()] || config[type])}
						defaultColors={type == 'palette' ? Object.values(palettes) : Object.values(colors)}
					/>
				</Dialog>
			</Frame>
		)
	}

	const freqRange = () => {
		const formatFreq = (f: number) => {
			const hz = hzIt(f)
			return `${hz > 1000 ? `${Math.round(hz / 1000)} kHz` : `${Math.round(hz)} Hz`}`
		}
		return (
			<Frame
				title="Audio Range"
				tip="Reactive audio frequency range"
			>
				<Slider
					value={[logIt(config.freq_min), logIt(config.freq_max)]}
					aria-labelledby="discrete-slider-custom"
					step={0.001}
					valueLabelDisplay="auto"
					marks={freqMarks}
					min={logIt(schema.base.freq_min.validation.min)}
					max={logIt(schema.base.freq_max.validation.max)}
					valueLabelFormat={formatFreq}
					getAriaValueText={formatFreq}
					onChange={(_: Event, v: any) => {
						const val = v as number[]
						const hzmin = hzIt(val[0])
						const hzmax = hzIt(val[1])
						setConfig({
							'freq_min': hzmin,
							'freq_max': hzmax
						})
					}}
					onChangeCommitted={async (_: any, v: number | number[]) => {
						const val = v as number[]
						const hzmin = hzIt(val[0])
						const hzmax = hzIt(val[1])
						setConfig({
							'freq_min': hzmin,
							'freq_max': hzmax
						})
						effect !== undefined ? await Ledfx('/api/effects', 'PUT', {
							'id': effect.id,
							'base_config': {
								'freq_min': hzmin,
								'freq_max': hzmax
							}
						}) : await Ledfx('/api/effects/global', 'PUT', {
							'freq_min': hzmin,
							'freq_max': hzmax
						})
					}}
				/>
			</Frame>
		)
	}

	const boolEntry = (key: string) => {
		return (schema.base[key] &&
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
							[key]: !config[key]
						})
						effect !== undefined ? await Ledfx('/api/effects', 'PUT', {
							'id': effect.id,
							'base_config': { [key]: config[key] },
						}) : await Ledfx('/api/effects/global', 'PUT', {
							[key]: config[key]
						})
					}} />
			</Frame>)
	}

	return (schema &&
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
				{(!effect || (effect && schema.types[effect.type].category == 'Audio Reactive')) &&
					<Grid item xs={12}>
						{freqRange()}
					</Grid>
				}
				<Grid item xs={6}>
					{Picker({ type: 'palette', open: paletteOpen, setOpen: setPaletteOpen })}
				</Grid>
				<Grid item xs={3}>
					{boolEntry('flip')}
				</Grid>
				<Grid item xs={3}>
					{boolEntry('mirror')}
				</Grid>
				<Grid item xs={6}>
					{Picker({ type: 'background_color', open: bkgOpen, setOpen: setBkgOpen })}
				</Grid>
				<Grid item xs={6}>
					{floatSlider('background_brightness', BrightnessLow, BrightnessHigh)}
				</Grid>
			</Grid>
		</>
	)
}