import * as React from 'react';
import HOOFieldset from '@n8d/htwoo-react/HOOFieldset';
import { ColorSwatch } from '../../atoms';
import { IColorPickerProps } from './IColorPickerProps';
import styles from './ColorPicker.module.scss';

/**
 * ColorPicker molecule - DRY implementation using HTWOO HOOFieldset
 * Combines HTWOO fieldset functionality with our atomic ColorSwatch components
 */
export const ColorPicker: React.FC<IColorPickerProps> = ({
  label,
  value,
  onChange,
  colors = [
    '#0078d4', // Primary blue
    '#106ebe', // Dark blue  
    '#005a9e', // Darker blue
    '#004578', // Darkest blue
    '#deecf9', // Light blue
    '#c7e0f4', // Lighter blue
    '#71afe5', // Medium blue
    '#2b88d8', // Secondary blue
    '#323130', // Dark gray
    '#605e5c', // Medium gray
    '#a19f9d', // Light gray
    '#d2d0ce', // Lighter gray
    '#edebe9', // Lightest gray
    '#ffffff', // White
    '#f8f9fa', // Off white
    '#000000'  // Black
  ],
  disabled = false,
  required = false,
  className = ''
}) => {
  const fieldsetClasses = [
    styles.colorPicker,
    className
  ].filter(Boolean).join(' ');

  const handleColorClick = (color: string): void => {
    if (!disabled && onChange) {
      onChange(color);
    }
  };

  return (
    <div className={fieldsetClasses}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span style={{ color: 'red' }}>*</span>}
        </label>
      )}
      
      {/* Use HTWOO Fieldset to group color options */}
      <HOOFieldset>
        <div className={styles.colorGrid}>
          {colors.map((color) => (
            <ColorSwatch
              key={color}
              color={color}
              size="md"
              showTooltip={true}
              onClick={() => handleColorClick(color)}
              className={value === color ? styles.selected : ''}
              aria-label={`Select color ${color}${value === color ? ' (selected)' : ''}`}
            />
          ))}
        </div>
      </HOOFieldset>
    </div>
  );
};

export default ColorPicker;