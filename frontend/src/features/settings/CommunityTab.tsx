interface CommunityStructure {
  ketua: string;
  bendahara: string;
  sekretaris: string;
}

interface CommunityTabProps {
  community: CommunityStructure;
  handleCommunityChange: (field: keyof CommunityStructure, value: string) => void;
}

function CommunityTab({ community, handleCommunityChange }: CommunityTabProps) {
  return (
    <div style={styles.form}>
      <h3 style={styles.subtitle}>Struktur Komunitas</h3>
      <p style={styles.hint}>Atur hierarki pengurus koperasi:</p>
      
      <div style={styles.field}>
        <label style={styles.label}>Ketua</label>
        <input
          type="text"
          value={community.ketua}
          onChange={(e) => handleCommunityChange('ketua', e.target.value)}
          style={styles.input}
          placeholder="Nama Ketua"
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Bendahara</label>
        <input
          type="text"
          value={community.bendahara}
          onChange={(e) => handleCommunityChange('bendahara', e.target.value)}
          style={styles.input}
          placeholder="Nama Bendahara"
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Sekretaris</label>
        <input
          type="text"
          value={community.sekretaris}
          onChange={(e) => handleCommunityChange('sekretaris', e.target.value)}
          style={styles.input}
          placeholder="Nama Sekretaris"
        />
      </div>

      <button style={styles.submitButton}>
        Simpan Struktur
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
  hint: {
    fontSize: 14,
    color: '#86868b',
    margin: '0 0 8px 0',
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
    fontSize: 16,
    backgroundColor: 'white',
    color: '#1d1d1f',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  submitButton: {
    background: 'linear-gradient(135deg, #007aff 0%, #5856d6 100%)',
    color: 'white',
    border: 'none',
    borderRadius: 24,
    padding: '14px 24px',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,122,255,0.3)',
    marginTop: 8,
  },
};

export default CommunityTab;
