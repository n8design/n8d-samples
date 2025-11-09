export interface IColorSwatchProps {
  color: string;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  onClick?: (color: string) => void;
  className?: string;
  'aria-label'?: string;
}