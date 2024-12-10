'use client';
import Image from 'next/image';
import {useCallback} from 'react';
import '@/styles/button.scss';
export default function Button({
  type = 'solid',
  image,
  text,
  borderRadius,
  bgColor,
  color,
  borderColor,
  padding,
  disabled,
  width = 'auto',
  onClick,
}) {
  const style = useCallback(
    (type) => {
      switch (type) {
        case 'solid':
          return {
            borderRadius,
            backgroundColor: bgColor,
            color,
            padding,
            width,
            border: 'none',
          };
        case 'outline':
          return {
            borderRadius,
            backgroundColor: bgColor,
            color,
            padding,
            border: `1.5px solid ${borderColor}`,
            width,
          };

        default:
          return {
            borderRadius,
            backgroundColor: bgColor,
            color,
            padding,
            width,
            border: 'none',
          };
      }
    },
    [bgColor, borderColor, borderRadius, color, padding, width]
  );
  return (
    <button
      style={style(type)}
      className='button_style'
      disabled={disabled}
      onClick={onClick}
    >
      {image && (
        <Image
          loading='lazy'
          src={image}
          width={20}
          height={20}
          alt='button_image'
        />
      )}
      {text}
    </button>
  );
}
