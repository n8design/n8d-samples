import { IButtonProps } from '../../atoms';

export interface IButtonGroupProps {
  buttons: Array<IButtonProps & { key: string }>;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
}