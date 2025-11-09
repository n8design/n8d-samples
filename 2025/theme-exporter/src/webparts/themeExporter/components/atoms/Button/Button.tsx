import * as React from 'react';
import HOOButton, { HOOButtonType } from '@n8d/htwoo-react/HOOButton';
import { IButtonProps } from './IButtonProps';

/**
 * Atomic Design Button component - DRY wrapper around HTWOO HOOButton
 * Maps our atomic design props to HTWOO HOOButton props
 */
export const Button: React.FC<IButtonProps> = ({
  label,
  onClick,
  variant = 'secondary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  type = 'button'
}) => {
  // Map our variant to HOOButtonType
  const hooButtonType = React.useMemo(() => {
    switch (variant) {
      case 'primary':
        return HOOButtonType.Primary;
      case 'secondary':
        return HOOButtonType.Standard;
      case 'ghost':
        return HOOButtonType.Standard; // HTWOO doesn't have ghost, use standard
      default:
        return HOOButtonType.Standard;
    }
  }, [variant]);

  // Add loading class if needed - using global CSS classes for HTWOO compatibility
  const buttonClasses = [
    'atomic-button',
    loading ? 'loading' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={buttonClasses} data-atomic-button="true">
      <HOOButton
        type={hooButtonType}
        label={label}
        onClick={onClick}
        disabled={disabled || loading}
      />
    </div>
  );
};

export default Button;