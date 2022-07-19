/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unsafe-optional-chaining */
import { makeStyles, Theme } from '@mui/material';
import { useState } from 'react';
import {Slider, Card, CardContent, CardHeader, Tooltip, InputAdornment, TextField} from '@mui/material';
import { useStore } from '@/store/useStore';
import Frame from '../Frame';

const log13 = (x: number) => Math.log(x) / Math.log(13);
const logIt = (x: number) => 3700.0 * log13(1 + x / 200.0);
const hzIt = (x: number) => 200.0 * 13 ** (x / 3700.0) - 200.0;

const useStyles = makeStyles((theme: Theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: theme.spacing(2),
    paddingBottom: 0,
  },
  formControl: {
    marginRight: theme.spacing(3),
  },
  card: {
    width: '100%',
    maxWidth: '540px',
    '@media (max-width: 580px)': {
      maxWidth: '97vw',
      margin: '0 auto',
    },
  },
}));

function ValueLabelComponent(props: any) {
  const { children, open, value } = props;

  return (
    <Tooltip
      open={open}
      enterTouchDelay={0}
      placement="top"
      title={`${Math.round(hzIt(value))} Hz`}
    >
      {children}
    </Tooltip>
  );
}

const FrequenciesCard = ({ virtual, style }: any) => {
  const classes = useStyles();
  const addVirtual = useStore((state) => state.addVirtual);
  const getVirtuals = useStore((state) => state.getVirtuals);
  const config = useStore((state) => state.config);

  const [value, setValue] = useState([
    logIt(virtual.config.frequency_min),
    logIt(virtual.config.frequency_max),
  ]);

  const freq_max = config.melbanks?.max_frequencies.map((f: number) => ({
    value: f,
    label: `${f > 1000 ? `${f / 1000}kHz` : `${f}Hz`}`,
  }));

  const freq_min = {
    value: config.melbanks?.min_frequency,
    label: `${
      config.melbanks?.min_frequency > 1000
        ? `${config.melbanks?.min_frequency / 1000}kHz`
        : `${config.melbanks?.min_frequency}Hz`
    }`,
  };
  const marks = freq_max && [freq_min, ...freq_max];

  const convertedMarks = marks?.map((m: any) => ({
    value: logIt(m.value),
    label: m.label,
  }));

  const handleChange = (_event: React.ChangeEvent<any>, newValue: number[]) => {
    const copy = [...newValue];
    convertedMarks.forEach((m: any) => {
      if (Math.abs(newValue[0] - m.value) < 100) {
        copy[0] = m.value;
      }
      if (Math.abs(newValue[1] - m.value) < 100) {
        copy[1] = m.value;
      }
    });
    setValue(copy);
  };

  return (
    <Card
      variant="outlined"
      className={`${classes.card} step-device-four`}
      style={style}
    >
      <CardHeader
        title="Frequencies"
        subheader="Adjust the audio range used for this strip"
      />
      <CardContent className={classes.content}>
        <div style={{ width: '100%' }}>
          <Frame
            title="Range"
            style={{ padding: '16px 2rem 6px 2rem', marginBottom: '1rem' }}
          >
            <Slider
              value={[value[0], value[1]]}
              aria-labelledby="discrete-slider-custom"
              step={0.001}
              valueLabelDisplay="auto"
              marks={convertedMarks}
              min={logIt(config.melbanks?.min_frequency)}
              max={logIt(
                config.melbanks?.max_frequencies[
                  config.melbanks?.max_frequencies.length - 1
                ]
              )}
              onChange={(e: any, v: any) => handleChange(e, v)}
              ValueLabelComponent={ValueLabelComponent}
              style={{ color: '#aaa' }}
              onChangeCommitted={() => {
                // Backend cannot do partial updates yet, sending whole config
                addVirtual({
                  id: virtual.id,
                  config: {
                    ...virtual.config,
                    frequency_min: Math.round(hzIt(value[0])),
                    frequency_max: Math.round(hzIt(value[1])),
                  },
                }).then(() => getVirtuals());
              }}
            />
          </Frame>
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ maxWidth: '120px' }}>
              <TextField
                id="min"
                label="Min"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">Hz</InputAdornment>
                  ),
                }}
                inputProps={{
                  style: { textAlign: 'right' },
                  min: 20,
                  max: 20000,
                }}
                value={
                  Math.round(hzIt(value[0])) < 5
                    ? value[0]
                    : Math.round(hzIt(value[0]))
                }
                variant="outlined"
                onChange={(e: any) => {
                  setValue([logIt(e.target.value), value[1]]);
                }}
              />
            </div>
            <div style={{ maxWidth: '120px' }}>
              <TextField
                id="max"
                label="Max"
                type="number"
                value={
                  Math.round(hzIt(value[1])) > 20001
                    ? value[1]
                    : Math.round(hzIt(value[1]))
                }
                onChange={(e: any) => {
                  setValue([value[0], logIt(e.target.value)]);
                }}
                inputProps={{
                  min: 20,
                  max: 20000,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">Hz</InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FrequenciesCard;
