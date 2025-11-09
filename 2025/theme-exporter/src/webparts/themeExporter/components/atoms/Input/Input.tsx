import * as React from 'react';
import HOOText from '@n8d/htwoo-react/HOOText';
import { IInputProps } from './IInputProps';

/**
 * Atomic Design Input component - DRY wrapper around HTWOO HOOText
 * Maps our atomic design props to HTWOO HOOText props
 */
export const Input: React.FC<IInputProps> = ({
  label,
  placeholder,
  value = '',
  onChange,
  type = 'text',
  disabled = false,
  required = false,
  error,
  className = '',
  id
}) => {
  // Note: inputId not needed when using HOOText as it handles its own ID generation
  
  const containerClasses = [
    'atomic-input-container',
    error ? 'error' : '',
    className
  ].filter(Boolean).join(' ');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <div className={containerClasses}>
      {label && <label>{label}{required && <span style={{ color: 'red' }}>*</span>}</label>}
      <HOOText
        value={value}
        onChange={handleChange}
        inputElementAttributes={{ 
          placeholder,
          disabled,
          required,
          type
        }}
      />
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default Input;