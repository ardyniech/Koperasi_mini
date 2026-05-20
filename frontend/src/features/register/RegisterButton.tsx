interface ButtonProps {
  loading: boolean;
}

export default function RegisterButton({ loading }: ButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      style={loading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
    >
      <div style={styles.buttonContent}>
        {loading ? (
          <>
            <span style={styles.spinner}>⏳</span> Mendaftar...
          </>
        ) : (
          <>
            <span style={styles.buttonIcon}>✨</span> Daftar Sekarang
          </>
        )}
      </div>
    </button>
  );
}

const styles = {
  button: {
    padding: '16px 24px',
    borderRadius: 12,
    border: 'none' as const,
    background: 'linear-gradient(135deg, #007aff 0%, #5856d6 100%)',
    color: 'white',
    fontSize: 17,
    fontWeight: 600,
    cursor: 'pointer' as const,
    marginTop: 8,
    boxShadow: '0 4px 12px rgba(0, 122, 255, 0.3), 0 1px 3px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
  },
  buttonDisabled: {
    background: 'linear-gradient(135deg, #a2a2a7 0%, #8e8e93 100%)',
    cursor: 'not-allowed' as const,
    boxShadow: 'none' as const,
  },
  buttonContent: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
  },
  buttonIcon: {
    fontSize: 20,
  },
  spinner: {
    fontSize: 16,
  },
} as const;
