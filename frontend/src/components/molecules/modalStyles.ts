interface ModalStyles {
  overlay: React.CSSProperties;
  modal: React.CSSProperties;
  header: React.CSSProperties;
  title: React.CSSProperties;
  closeButton: React.CSSProperties;
  body: React.CSSProperties;
  sizeStyles: Record<string, React.CSSProperties>;
}

export const modalStyles: ModalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: 16,
    animation: 'fadeIn 0.2s ease-out',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  header: {
    padding: '24px 24px 16px',
    borderBottom: '1px solid #F2F2F7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    color: '#1D1D1F',
    fontFamily: 'inherit',
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 8,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#86868B',
    fontSize: 20,
    transition: 'all 0.2s ease',
  },
  body: {
    padding: 24,
    fontFamily: 'inherit',
  },
  sizeStyles: {
    sm: { maxWidth: 400 },
    md: { maxWidth: 600 },
    lg: { maxWidth: 800 },
    full: { maxWidth: '95vw', height: '90vh' },
  },
};
