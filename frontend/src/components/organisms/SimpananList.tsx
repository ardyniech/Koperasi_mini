interface Simpanan {
  id: number;
  jenis: string;
  nominal: number;
  created_at: string;
}

interface SimpananListProps {
  simpanan: Simpanan[];
}

function SimpananList({ simpanan }: SimpananListProps) {
  if (simpanan.length === 0) {
    return <p style={styles.empty}>Belum ada simpanan</p>;
  }

  return (
    <div>
      <h3 style={styles.subtitle}>Riwayat Simpanan</h3>
      <div style={styles.list}>
        {simpanan.map((s) => (
          <div key={s.id} style={styles.item}>
            <div>
              <p style={styles.jenis}>{s.jenis}</p>
              <p style={styles.date}>
                {new Date(s.created_at).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })}
              </p>
            </div>
            <p style={styles.nominal}>+Rp{s.nominal.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  subtitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 15,
    color: '#1d1d1f'
  },
  empty: {
    color: '#86868b',
    fontStyle: 'italic' as const
  },
  list: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: 10
  },
  item: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: 10,
    borderBottom: '1px solid #f5f5f7'
  },
  jenis: {
    fontWeight: 600,
    color: '#1d1d1f'
  },
  date: {
    fontSize: 12,
    color: '#86868b'
  },
  nominal: {
    fontWeight: 600,
    color: '#34c759'
  }
} as const;

export default SimpananList;
