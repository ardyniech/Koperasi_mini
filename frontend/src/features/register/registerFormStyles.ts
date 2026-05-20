export const styles = {
  form: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: 20,
  },
  inputGroup: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1d1d1f',
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  labelIcon: {
    fontSize: 16,
  },
  input: {
    padding: '14px 18px',
    borderRadius: 12,
    border: '1.5px solid #e5e5ea',
    fontSize: 16,
    outline: 'none' as const,
    transition: 'all 0.2s ease',
    backgroundColor: '#fafafa',
    fontFamily: 'inherit',
  },
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
