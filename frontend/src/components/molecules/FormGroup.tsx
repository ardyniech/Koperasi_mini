import React from 'react';
import Label from '../atoms/Label';
import Input from '../atoms/Input';

interface FormGroupProps {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const FormGroup: React.FC<FormGroupProps> = ({
  label,
  htmlFor,
  required = false,
  error,
  hint,
  children,
  style,
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    fontFamily: 'inherit',
    ...style,
  };

  return (
    <div style={containerStyle}>
      {label && (
        <Label htmlFor={htmlFor} required={required}>
          {label}
        </Label>
      )}
      {children || (
        <Input
          id={htmlFor}
          error={error}
          hint={hint}
        />
      )}
      {error && (
        <span style={{ fontSize: 12, color: '#FF3B30', fontFamily: 'inherit' }}>
          {error}
        </span>
      )}
      {hint && !error && (
        <span style={{ fontSize: 12, color: '#86868B', fontFamily: 'inherit' }}>
          {hint}
        </span>
      )}
    </div>
  );
};

export default FormGroup;
