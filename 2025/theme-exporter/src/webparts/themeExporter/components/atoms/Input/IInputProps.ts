export interface IInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'url' | 'search';
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
  id?: string;
}