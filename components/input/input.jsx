'use client';
// import {IconEye, IconEyeOff} from '@/public';
import Image from 'next/image';
import {useState} from 'react';
import '@/styles/customInput.scss';

export default function Input({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  required,
  isPassword,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const handleType = (str) => {
    if (str === 'password')
      if (showPassword) return 'text';
      else return 'password';
    return str;
  };
  return (
    <div className='custom_input'>
      {label && <label htmlFor={name}>{label}</label>}
      <div className='custom_input_wrapper'>
        <input
          type={handleType(type)}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />
        {/* {type === 'password' && (
          <Image
            onClick={() => setShowPassword(!showPassword)}
            className='icon_password'
            src={showPassword ? IconEye : IconEyeOff}
            style={{cursor: 'pointer'}}
          />
        )} */}
      </div>
    </div>
  );
}
