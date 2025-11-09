export interface IColorPickerProps {
  label?: string;
  value?: string;
  onChange?: (color: string) => void;
  colors?: string[];
  disabled?: boolean;
  required?: boolean;
  className?: string;
}