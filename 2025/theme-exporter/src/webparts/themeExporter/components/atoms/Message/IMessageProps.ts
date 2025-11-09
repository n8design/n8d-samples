export type MessageType = 'success' | 'error' | 'warning' | 'info';

export interface IMessageProps {
  message: string;
  type: MessageType;
  onDismiss?: () => void;
  className?: string;
}