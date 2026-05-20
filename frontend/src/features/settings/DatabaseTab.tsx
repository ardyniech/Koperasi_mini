interface DatabaseTabProps {
  confirmText: string;
  setConfirmText: (text: string) => void;
  handleResetDB: () => void;
  deleting: boolean;
}

function DatabaseTab({ confirmText, setConfirmText, handleResetDB, deleting }: DatabaseTabProps) {
  return (
    <div style={styles.form}>
      <h3 style={styles.subtitle}>Reset Database</h3>
      <p style={styles.warning}>
        ⚠️ PERINGATAN: Tindakan ini akan menghapus SEMUA data dan membuat ulang database kosong.
      </p>
      
      <div style={styles.field}>
        <label style={styles.label}>
          Ketik <strong>KONFIRMASI HAPUS DATA</strong> untuk mengaktifkan tombol:
        </label>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          style={styles.input}
          placeholder="KONFIRMASI HAPUS DATA"
        />
      </div>

      <button
        onClick={handleResetDB}
        disabled={confirmText !== 'KONFIRMASI HAPUS DATA' || deleting}
        style={{
          ...styles.deleteButton,
          opacity: confirmText !== 'KONFIRMASI HAPUS DATA' || deleting ? 0.5 : 1,
          cursor: confirmText !== 'KONFIRMASI HAPUS DATA' || deleting ? 'not-allowed' as const : 'pointer' as const,
        }}
      >
        {deleting ? 'Menghapus...' : '🗑️ Hapus Database'}
      </button>
    </div>
  );
}

const styles = {
  form: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#1d1d1f',
    marginTop: 0,
    marginBottom: 10,
  },
  warning: {
    color: '#ff9500',
    fontSize: 14,
    padding: '12px 16px',
    backgroundColor: 'rgba(255,149,0,0.1)',
    borderRadius: 12,
    borderLeft: '3px solid #ff9500',
    marginBottom: 16,
  },
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
    padding: '14px 16px',
    borderRadius: 12,
    border: '2px solid #e5e5ea',
    fontSize: 14,
    backgroundColor: 'white',
    color: '#1d1d1f',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  deleteButton: {
    padding: '14px 24px',
    borderRadius: 12,
    border: 'none' as const,
    backgroundColor: '#ff3b30',
    color: 'white',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer' as const,
    boxShadow: '0 4px 12px rgba(255,59,48,0.3)',
    marginTop: 8,
  },
};

export default DatabaseTab;
