import * as React from 'react';
import { ILoadingSpinnerProps } from './ILoadingSpinnerProps';
import styles from './LoadingSpinner.module.scss';

// Helper function to convert hex to RGB values
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 0, 0';
};

export const LoadingSpinner: React.FC<ILoadingSpinnerProps> = ({
  size = 'md',
  color,
  className = '',
  label
}) => {
  const spinnerClasses = [
    styles.spinner,
    styles[size],
    className
  ].filter(Boolean).join(' ');

  const spinnerStyle = color ? { 
    borderTopColor: color,
    borderRightColor: `rgba(${hexToRgb(color)}, 0.2)`,
    borderBottomColor: `rgba(${hexToRgb(color)}, 0.2)`,
    borderLeftColor: `rgba(${hexToRgb(color)}, 0.2)`
  } : {};

  return (
    <div className={styles.container}>
      <div 
        className={spinnerClasses}
        style={spinnerStyle}
        role="status"
        aria-label={label || "Loading"}
      />
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
};

export default LoadingSpinner;