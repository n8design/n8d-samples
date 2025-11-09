import * as React from 'react';
import { IColorSwatchProps } from './IColorSwatchProps';
import styles from './ColorSwatch.module.scss';

/**
 * Atomic Design ColorSwatch component - DRY implementation using HTWOO patterns
 * Note: While HTWOO has color swatch functionality in HOOFieldset, 
 * this provides a simpler, more focused API for basic color display needs.
 * Could be enhanced to use HTWOO color picker components in the future.
 */
export const ColorSwatch: React.FC<IColorSwatchProps> = ({
  color,
  size = 'md',
  showTooltip = false,
  onClick,
  className = '',
  'aria-label': ariaLabel
}) => {
  const [showTooltipState, setShowTooltipState] = React.useState(false);

  // Use HTWOO-like styling patterns but keep simple for basic color display
  const swatchClasses = [
    styles.colorSwatch,
    `hoo-color-swatch`, // Add HTWOO-like class for consistency
    styles[size],
    onClick ? styles.clickable : styles.nonClickable,
    className
  ].filter(Boolean).join(' ');

  const handleClick = (): void => {
    if (onClick) {
      onClick(color);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if ((event.key === 'Enter' || event.key === ' ') && onClick) {
      event.preventDefault();
      onClick(color);
    }
  };

  return (
    <div className={styles.swatchContainer}>
      <div
        className={swatchClasses}
        style={{ backgroundColor: color }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setShowTooltipState(true)}
        onMouseLeave={() => setShowTooltipState(false)}
        tabIndex={onClick ? 0 : -1}
        role={onClick ? 'button' : 'presentation'}
        aria-label={ariaLabel || `Color swatch ${color}`}
        title={showTooltip ? color : undefined}
      >
        {showTooltip && showTooltipState && (
          <div className={styles.tooltip}>
            {color}
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorSwatch;