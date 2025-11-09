import * as React from 'react';
import HOOValidationMsg from '@n8d/htwoo-react/HOOValidationMsg';
import { IMessageProps } from './IMessageProps';

export const Message: React.FC<IMessageProps> = ({
  message,
  type,
  onDismiss,
  className = ''
}) => {
  // Map our message types to HTWOO CSS classes
  const getHtwooClass = (messageType: string): string => {
    switch (messageType) {
      case 'error':
        return 'hoo-error';
      case 'success':
        return 'hoo-success';
      case 'warning':
        return 'hoo-warning'; // If available, otherwise fallback
      case 'info':
        return 'hoo-info'; // If available, otherwise fallback
      default:
        return 'hoo-success'; // Default fallback
    }
  };

  // Use HTWOO validation message for error types
  if (type === 'error') {
    return (
      <div className={className}>
        <HOOValidationMsg validationMsg={message} />
        {onDismiss && (
          <button
            onClick={onDismiss}
            aria-label="Dismiss message"
            type="button"
            style={{ marginLeft: '8px', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            ×
          </button>
        )}
      </div>
    );
  }

  // For other message types, use HTWOO classes with our structure
  const messageClasses = [
    'atomic-message',
    getHtwooClass(type),
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={messageClasses} role="alert">
      <div className="content">
        {message}
      </div>
      {onDismiss && (
        <button
          className="action"
          onClick={onDismiss}
          aria-label="Dismiss message"
          type="button"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Message;