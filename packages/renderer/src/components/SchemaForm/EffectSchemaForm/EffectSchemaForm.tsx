import { Ledfx } from '@/api/ledfx'
import { effect, schemaEntry } from '@/store/interfaces'
import { useStore } from '@/store/useStore'
import { Avatar, Button, Dialog, Grid, Slider, Switch, Typography, typographyClasses } from '@mui/material'
import { useState } from 'react'
import Frame from '../Frame'
import { BlurOff, BlurOn, DoNotDisturb, TimerOff, Timer, InvertColorsOff, InvertColors, BrightnessLow, BrightnessHigh, FlashOff, FlashOn, AutoMode, Edit } from '@mui/icons-material'
import ReactGPicker from 'react-gcolor-picker'
import { Box } from '@mui/system'

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
];

export const EffectSchemaForm = (effect: effect) => {
	const schema = useStore((store) => store.api.schema.effect)
	const colors = useStore((store) => store.api.colors)
	const palettes = useStore((store) => store.api.palettes)
	const [config, setConfig] = useState(effect.base_config)

	const floatSlider = (key: string, StartIcon: any, EndIcon: any) => {
		return (effect && schema.base[key] &&// this prevents global effects from working?
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

	const Picker = (props: { type: "palette" | "background_color" }) => {
		const { type } = props
		const [open, setOpen] = useState(false)
		const predefs = type == "palette" ? palettes : colors

		return (schema.base[type] &&
			<Frame
				title={schema.base[type].title}
				tip={schema.base[type].description}
			>
				<Button
					style={{
						width: "100%",
						height: "40px",
						background: predefs[config[type].toLowerCase()] || config[type]
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
						colorBoardHeight={150}
						debounce
						debounceMS={200}
						format="rgb"
						gradient={type == "palette"}
						solid={type == "background_color"}
						onChange={async (c) => {
							setConfig({
								...config,
								[type]: c
							})
							await Ledfx('/api/effects', 'PUT', {
								'id': effect.id,
								'base_config': { [type]: c }
							})
						}}
						popupWidth={288}
						showAlpha={false}
						value={predefs[config[type].toLowerCase()] || config[type]}
						defaultColors={type == "palette" ? Object.values(palettes) : Object.values(colors)}
					/>
				</Dialog>
			</Frame>
		)
	}

	const freqRange = () => {
		const [value, setValue] = useState([
			logIt(config.freq_min),
			logIt(config.freq_max),
		]);

		const formatFreq = (f: number) => {
			let hz = hzIt(f)
			return `${hz > 1000 ? `${Math.round(hz / 1000)} kHz` : `${Math.round(hz)} Hz`}`
		}
		return (
			<Frame
				title="Frequency Range"
				tip="Reactive audio frequency range"
			>
				<Slider
					value={[value[0], value[1]]}
					aria-labelledby="discrete-slider-custom"
					step={0.001}
					valueLabelDisplay="auto"
					marks={freqMarks}
					min={logIt(schema.base.freq_min.validation.min)}
					max={logIt(schema.base.freq_max.validation.max)}
					valueLabelFormat={formatFreq}
					getAriaValueText={formatFreq}
					onChange={(_: Event, v: any) => setValue(v)}
					onChangeCommitted={async (_: any, v: number | number[]) => {
						const val = v as number[]
						const hzmin = hzIt(val[0])
						const hzmax = hzIt(val[1])
						setConfig({
							...config,
							"freq_min": hzmin,
							"freq_max": hzmax
						})
						await Ledfx('/api/effects', 'PUT', {
							'id': effect.id,
							'base_config': {
								"freq_min": hzmin,
								"freq_max": hzmax
							}
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
				<Grid item xs={12}>
					{freqRange()}
				</Grid>
				<Grid item xs={6}>
					{Picker({ type: "palette" })}
				</Grid>
				<Grid item xs={3}>
					{boolEntry('flip')}
				</Grid>
				<Grid item xs={3}>
					{boolEntry('mirror')}
				</Grid>
				<Grid item xs={6}>
					{Picker({ type: "background_color" })}
				</Grid>
				<Grid item xs={6}>
					{floatSlider('background_brightness', BrightnessLow, BrightnessHigh)}
				</Grid>
			</Grid>
		</>
	)
}