import * as React from 'react';
import { Button } from '../../atoms';
import { IButtonGroupProps } from './IButtonGroupProps';

/**
 * ButtonGroup molecule - DRY component using atomic Button (which wraps HTWOO HOOButton)
 * Provides consistent spacing and layout for multiple buttons
 */
export const ButtonGroup: React.FC<IButtonGroupProps> = ({
  buttons,
  orientation = 'horizontal',
  spacing = 'md',
  className = ''
}) => {
  const groupClasses = [
    'atomic-button-group',
    orientation,
    spacing,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={groupClasses}>
      {buttons.map(({ key, ...buttonProps }) => (
        <Button key={key} {...buttonProps} />
      ))}
    </div>
  );
};

export default ButtonGroup;