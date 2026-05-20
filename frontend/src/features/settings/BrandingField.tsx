interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'color';
  placeholder?: string;
}

export default function BrandingField({ label, value, onChange, type = 'text', placeholder }: FieldProps) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      {type === 'color' ? (
        <>
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={styles.colorInput}
          />
          <span style={styles.colorValue}>{value}</span>
        </>
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={styles.input}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

const styles = {
  field: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1d1d1f',
  },
  input: {
    padding: 12,
    borderRadius: 8,
    border: '1px solid #e0e0e0',
    fontSize: 14,
    outline: 'none' as const,
  },
  colorInput: {
    width: 60,
    height: 40,
    border: 'none' as const,
    cursor: 'pointer' as const,
  },
  colorValue: {
    fontSize: 14,
    color: '#86868b',
    marginLeft: 10,
  },
} as const;
