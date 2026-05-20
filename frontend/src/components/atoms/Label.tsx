import React from 'react';

interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}

const Label: React.FC<LabelProps> = ({
  children,
  htmlFor,
  required = false,
  size = 'md',
  style,
}) => {
  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { fontSize: 12, marginBottom: 4 },
    md: { fontSize: 13, marginBottom: 6 },
    lg: { fontSize: 15, marginBottom: 8 },
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: 'inherit',
    fontWeight: 600,
    color: '#86868B',
    letterSpacing: '-0.2px',
    display: 'inline-block',
    ...sizeStyles[size],
    ...style,
  };

  return (
    <label htmlFor={htmlFor} style={labelStyle}>
      {children}
      {required && <span style={{ color: '#FF3B30', marginLeft: 4 }}>*</span>}
    </label>
  );
};

export default Label;
