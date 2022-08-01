import { Ledfx } from '@/api/ledfx'
import { effect, effectConfig } from '@/store/interfaces'
import { useStore } from '@/store/useStore'
import { AutoMode, BlurOff, BlurOn, BrightnessHigh, BrightnessLow, DoNotDisturb, Edit, FlashOff, FlashOn, InvertColors, InvertColorsOff, Timer, TimerOff } from '@mui/icons-material'
import { Button, Dialog, Grid, IconButton, Slider, Switch } from '@mui/material'
import { useState } from 'react'
import ReactGPicker from 'react-gcolor-picker'
import { DeepCopy } from '../DeviceSchemaForm'
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
	const [paletteOpen, setPaletteOpen] = useState(false)
	const [bkgOpen, setBkgOpen] = useState(false)

	const schema = useStore((store) => store.api.schema.effect)
	const colors = useStore((store) => store.api.colors)
	const palettes = useStore((store) => store.api.palettes)
	const config = useStore((store) => effect ?
		Object.prototype.hasOwnProperty.call(store.api.effects, effect.id) && store.api.effects[effect.id].base_config : store.api.globalEffectConfig
	)
	const setConfig = useStore((store) => effect ?
		(newConfig: effectConfig) => store.api.setEffect({ ...effect, 'base_config': newConfig }) :
		store.api.setGlobalEffectConfig
	)

	if (config == false) {
		return 
	}

	const floatSlider = (key: keyof effectConfig, StartIcon: any, EndIcon: any) => {
		return (schema && schema.base[key] && 
			<Frame
				title={schema.base[key].title}
				tip={schema.base[key].description}
				style={{ columnGap: 15 }}
			>
				<IconButton onClick={async () => {
					const newConfig = DeepCopy(config)
					newConfig[key] = schema.base[key].validation.min
					setConfig(newConfig)

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
						const newConfig = DeepCopy(config)
						newConfig[key] = newValue
						setConfig(newConfig)
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
					const newConfig = DeepCopy(config)
					newConfig[key] = schema.base[key].validation.max
					setConfig(newConfig)
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
			</Frame >
		)
	}

	const Picker = (props: { type: 'palette' | 'background_color', open: boolean, setOpen: (open: boolean) => void }) => {
		const { type, open, setOpen } = props
		const predefs = type == 'palette' ? palettes : colors

		return (schema.base[type] && config && Object.prototype.hasOwnProperty.call(config, type) &&
			<Frame
				title={schema.base[type].title}
				tip={schema.base[type].description}
			>
				<Button
					style={{
						width: '100%',
						height: '40px',
						background: (predefs[(config && config[type] || '').toLowerCase()]) || config[type] || ''
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
							const newConfig = DeepCopy(config)
							newConfig[type] = c
							setConfig(newConfig)
							effect !== undefined ? await Ledfx('/api/effects', 'PUT', {
								'id': effect.id,
								'base_config': { [type]: c }
							}) : await Ledfx('/api/effects/global', 'PUT', {
								[type]: c
							})
						}}
						popupWidth={288}
						showAlpha={false}
						value={(predefs[(config && config[type] || '').toLowerCase()] || config[type] || '')}
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
		return (config &&
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
						const newConfig = DeepCopy(config)
						newConfig['freq_min'] = hzIt(val[0])
						newConfig['freq_min'] = hzIt(val[1])
						setConfig(newConfig)
					}}
					onChangeCommitted={async (_: any, v: number | number[]) => {
						const val = v as number[]
						const hzmin = hzIt(val[0])
						const hzmax = hzIt(val[1])
						const newConfig = DeepCopy(config)
						newConfig['freq_min'] = hzmin
						newConfig['freq_min'] = hzmax
						setConfig(newConfig)
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

	const boolEntry = (key: keyof effectConfig) => {
		return (schema.base[key] &&
			<Frame
				title={schema.base[key].title}
				tip={schema.base[key].description}
			>
				<Switch
					value={config[key]}
					onChange={async () => {
						const newConfig = DeepCopy(config)
						newConfig[key] = !config[key]
						setConfig(newConfig)
						effect !== undefined ? await Ledfx('/api/effects', 'PUT', {
							'id': effect.id,
							'base_config': { [key]: !config[key] },
						}) : await Ledfx('/api/effects/global', 'PUT', {
							[key]: !config[key]
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