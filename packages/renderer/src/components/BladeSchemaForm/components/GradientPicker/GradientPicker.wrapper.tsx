/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
import { useEffect } from 'react';
import useStore from '../../../../store/useStore';
import GradientPicker from './GradientPicker';

const GradientPickerWrapper = ({
  pickerBgColor,
  title,
  index,
  virtId,
  isGradient = false,
  wrapperStyle,
}: any) => {
  const updateVirtualEffect = useStore((state) => state.updateVirtualEffect);
  const getVirtuals = useStore((state) => state.getVirtuals);
  const virtuals = useStore((state) => state.virtuals);
  const colors = useStore((state) => state.colors);
  const getColors = useStore((state) => state.getColors);
  const addColor = useStore((state) => state.addColor);

  const getV = () => {
    for (const prop in virtuals) {
      if (virtuals[prop].id === virtId) {
        return virtuals[prop];
      }
    }
  };

  const virtual = getV();

  const sendColorToVirtuals = (e: any) => {
    if (virtual && virtual.effect && virtual.effect.type) {
      updateVirtualEffect(
        virtual.id,
        virtual.effect.type,
        { [title]: e },
        false
      ).then(() => {
        getVirtuals();
      });
    }
  };

  const handleAddGradient = (name: string) => {
    addColor({ [name]: pickerBgColor }).then(() => {
      getColors();
    });
  };

  useEffect(() => {
    getColors();
  }, []);

  return (
    <GradientPicker
      pickerBgColor={pickerBgColor}
      title={title}
      index={index}
      isGradient={isGradient}
      wrapperStyle={wrapperStyle}
      colors={colors}
      handleAddGradient={handleAddGradient}
      sendColorToVirtuals={sendColorToVirtuals}
    />
  );
};
export default GradientPickerWrapper;
