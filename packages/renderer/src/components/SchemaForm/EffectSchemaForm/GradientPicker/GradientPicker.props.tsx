import { CSSProperties } from '@mui/material/styles/createTypography';

export interface GradientPickerProps {
  pickerBgColor: string;
  title?: string;
  index?: number;
  isGradient?: boolean;
  wrapperStyle: CSSProperties;
  colors?: any;
  handleAddGradient?: any;
  sendColorToVirtuals?: any;
}

export const GradientPickerDefaultProps = {
  pickerBgColor: '#800000',
  title: 'Color',
  index: 1,
  isGradient: false,
  wrapperStyle: {},
  colors: undefined,
  handleAddGradient: undefined,
  sendColorToVirtuals: undefined,
};
