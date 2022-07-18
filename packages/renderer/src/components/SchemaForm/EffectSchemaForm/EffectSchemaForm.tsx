import { Ledfx } from "@/api/ledfx";
import { effect, effectConfig, schemaEntry } from "@/store/interfaces";
import { useStore } from "@/store/useStore";
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import { Button, Checkbox, Dialog, DialogContent, DialogTitle, Grid, IconButton, Slider, Typography } from "@mui/material";
import { Component, useState } from "react";
import Frame from "../Frame";
import { BlurOff, BlurOn, DoNotDisturb, RotateLeft, TimerOff, Timer, InvertColorsOff, InvertColors, BrightnessLow, BrightnessHigh, FlashOff, FlashOn, AutoMode} from "@mui/icons-material";

export interface EffectSchemaProps {
    effect: effect
    open: boolean
    handleclose: () => void
}

export const EffectSchemaDialog = (props: EffectSchemaProps) => {
    const { effect, open, handleclose } = props

    return (
        <Dialog open={open} onClose={handleclose}>
            <DialogTitle>{effect.type} settings</DialogTitle>
            <DialogContent>
                {EffectSchemaForm(effect)}
            </DialogContent>
        </Dialog>
    )
}

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
    const schema = useStore((state) => state.api.schema.effect)
    const [applyOnChange, setApplyOnChange] = useState(true)
    const [config, setConfig] = useState(effect.base_config)
    const applyChanges = async () => {
        await Ledfx("/api/effects", "POST", effect)
    }
    let updatedSettings = {}

    const floatSlider = (key: string, StartIcon, EndIcon) => {
        return (
            <Frame
                title={schema.base[key].title}
                tip={schema.base[key].description}
                style={{columnGap: 15}}
            >
                <StartIcon/>
                <Slider
                    min={schema.base[key].validation.min}
                    max={schema.base[key].validation.max}
                    step={0.01}
                    value={config[key]}
                />
                <EndIcon/>
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

    const gradientPicker = (schemaEntry: schemaEntry) => {
        return (
            <Frame
                title={schemaEntry.title}
                tip={schemaEntry.description}
            >
                <Typography>Gradient Picker</Typography>
            </Frame>)
    }

    const boolEntry = (schemaEntry: schemaEntry) => {
        return (
            <Frame
                title={schemaEntry.title}
                tip={schemaEntry.description}
            >
                <IconButton>
                    {true ? <ToggleOnIcon color='primary' /> : <ToggleOffIcon />}
                </IconButton>
            </Frame>)
    }

    return (
        <>
            <Grid container alignItems="stretch" spacing={2}>
                <Grid item xs={6}>
                    {floatSlider("intensity", FlashOff, FlashOn)}
                </Grid>
                <Grid item xs={6}>
                    {floatSlider("decay", TimerOff, Timer)}
                </Grid>
                <Grid item xs={6}>
                    {floatSlider("blur", BlurOff, BlurOn)}
                </Grid>
                <Grid item xs={6}>
                    {floatSlider("hue_shift", DoNotDisturb, AutoMode)}
                </Grid>
                <Grid item xs={6}>
                    {floatSlider("brightness", BrightnessLow, BrightnessHigh)}
                </Grid>
                <Grid item xs={6}>
                    {floatSlider("saturation", InvertColorsOff, InvertColors)}
                </Grid>
                <Grid item xs={6}>
                    {gradientPicker(schema.base.palette)}
                </Grid>
                <Grid item xs={3}>
                    {boolEntry(schema.base.flip)}
                </Grid>
                <Grid item xs={3}>
                    {boolEntry(schema.base.mirror)}
                </Grid>
                <Grid item xs={12}>
                    {freqRange(schema.base.freq_max, schema.base.freq_min)}
                </Grid>
                <Grid item xs={6}>
                    {colorPicker(schema.base.bkg_color)}
                </Grid>
                <Grid item xs={6}>
                    {floatSlider("bkg_brightness", BrightnessLow, BrightnessHigh)}
                </Grid>
            </Grid>
            <Frame
                title="Options"
                style={{ "justifyContent": "space-around" }}
            >
                <Typography>Apply Settings Immedately on Change</Typography>
                <Checkbox
                    checked={applyOnChange}
                    onChange={() => { setApplyOnChange(!applyOnChange) }}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
                <Button disabled={applyOnChange} variant="outlined">Apply Settings</Button>
            </Frame>

        </>
    )
}