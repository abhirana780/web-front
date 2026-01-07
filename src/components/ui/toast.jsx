import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ toast, onRemove }) => {
  const { id, title, description, type = 'info' } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [id, onRemove]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#d1fae5',
          borderColor: '#10b981',
          color: '#065f46'
        };
      case 'error':
        return {
          backgroundColor: '#fee2e2',
          borderColor: '#ef4444',
          color: '#dc2626'
        };
      case 'warning':
        return {
          backgroundColor: '#fef3c7',
          borderColor: '#f59e0b',
          color: '#d97706'
        };
      default:
        return {
          backgroundColor: '#dbeafe',
          borderColor: '#3b82f6',
          color: '#1d4ed8'
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={18} />;
      case 'error':
        return <AlertCircle size={18} />;
      case 'warning':
        return <AlertCircle size={18} />;
      default:
        return <Info size={18} />;
    }
  };

  const styles = getToastStyles();

  return (
    <div
      className="toast-notification"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px',
        borderRadius: '8px',
        border: `1px solid ${styles.borderColor}`,
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        marginBottom: '8px',
        animation: 'slideIn 0.3s ease-out',
        maxWidth: '400px',
        position: 'relative'
      }}
    >
      <div style={{ flexShrink: 0 }}>
        {getIcon()}
      </div>
      
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ 
          fontWeight: '600', 
          fontSize: '14px',
          lineHeight: '1.4',
          marginBottom: description ? '4px' : '0'
        }}>
          {title}
        </div>
        {description && (
          <div style={{ 
            fontSize: '13px',
            opacity: 0.9,
            lineHeight: '1.4'
          }}>
            {description}
          </div>
        )}
      </div>

      <button
        onClick={() => onRemove(id)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'inherit',
          opacity: 0.7,
          transition: 'opacity 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.opacity = '1'}
        onMouseLeave={(e) => e.target.style.opacity = '0.7'}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
