import { makeStyles } from '@mui/styles';
import { ReactElement } from 'react';
import theme from '@/styles/theme';
import { DefaultTheme, ThemeProvider } from '@mui/system';
import { Theme, Tooltip } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    minWidth: '23.5%',
    padding: '16px 1.2rem 6px 1.2rem',
    border: '1px solid black',
    borderRadius: '10px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    height: 'auto',
    margin: '0.5rem 0',
    '@media (max-width: 580px)': {
      width: '100% !important',
      margin: '0.5rem 0',
    },
    '& > label': {
      top: '-0.5rem',
      display: 'flex',
      alignItems: 'center',
      left: '1rem',
      padding: '0 0.3rem',
      position: 'absolute',
      fontVariant: 'all-small-caps',
      fontSize: '0.9rem',
      letterSpacing: '0.1rem',
      color: "primary",
      // backgroundColor: theme.palette.background.paper,
      backgroundColor: "white",
      boxSizing: 'border-box',
    },
  },
}));

interface FrameProps {
  title?: string;
  index?: number;
  children?: any;
  full?: boolean;
  style?: any;
  required?: boolean;
  variant?: 'outlined' | 'contained' | 'inherit';
  className?: any;
  disabled?: boolean;
  tip?: string;
}

const Frame = ({
  index,
  title,
  children,
  full = false,
  style = { width: 'unset', order: 0 },
  required = false,
  variant = 'outlined',
  className,
  disabled,
  tip,
}: FrameProps): ReactElement<any, any> => {
  const classes = useStyles();
  return variant === 'outlined' ? (
    <Tooltip title={tip? tip:""} arrow disableInteractive>

    <div
      className={`${classes.wrapper} ${className}`}
      style={{
        ...style,
        width: full ? '100%' : style.width,
      }}
    >
      {/* eslint-disable-next-line */}
      <label className={`MuiFormLabel-root${disabled ? ' Mui-disabled' : ''}  step-effect-${index}`}>
        {title}
        {required ? '*' : ''}
      </label>
      {children}
    </div>
      </Tooltip>
  ) : (
    children
  );
};

Frame.defaultProps = {
  index: undefined,
  title: undefined,
  children: undefined,
  full: false,
  style: {
    width: 'unset',
    order: 0,
  },
  required: false,
  variant: 'outlined',
  className: undefined,
  disabled: undefined,
};

export default Frame;
