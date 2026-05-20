interface Transaction {
  id: number;
  type: 'simpanan' | 'pinjaman' | 'angsuran' | 'funding';
  amount: number;
  date: string;
  status: string;
  description: string;
}

interface CardProps {
  tx: Transaction;
}

export default function TransactionCard({ tx }: CardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#34c759';
      case 'pending': return '#ff9500';
      case 'rejected': return '#ff3b30';
      case 'lunas': return '#34c759';
      case 'belum_bayar': return '#ff9500';
      case 'disetujui': return '#34c759';
      case 'diajukan': return '#ff9500';
      case 'dicairkan': return '#34c759';
      default: return '#8e8e93';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'simpanan': return '💰';
      case 'pinjaman': return '🏦';
      case 'angsuran': return '✅';
      case 'funding': return '💎';
      default: return '📋';
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <span style={styles.icon}>{getTypeIcon(tx.type)}</span>
        <span style={styles.type}>{tx.type.toUpperCase()}</span>
        <span style={{...styles.status, backgroundColor: getStatusColor(tx.status)}}>
          {tx.status}
        </span>
      </div>
      <p style={styles.description}>{tx.description}</p>
      <p style={styles.date}>
        {new Date(tx.date).toLocaleDateString('id-ID', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        })}
      </p>
      <p style={styles.amount}>Rp {tx.amount.toLocaleString('id-ID')}</p>
    </div>
  );
}

const styles = {
  card: { 
    backgroundColor: 'white', 
    padding: 16, 
    borderRadius: 12, 
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)', 
    border: '1px solid #f0f0f0' 
  },
  cardHeader: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 },
  icon: { fontSize: 20 },
  type: { fontSize: 12, fontWeight: 700, color: '#007aff', flex: 1 },
  status: { 
    fontSize: 11, 
    fontWeight: 600, 
    color: 'white', 
    padding: '4px 8px', 
    borderRadius: 6, 
    textTransform: 'uppercase' as const 
  },
  description: { fontSize: 14, color: '#1d1d1f', marginBottom: 8 },
  date: { fontSize: 12, color: '#8e8e93', marginBottom: 4 },
  amount: { fontSize: 18, fontWeight: 700, color: '#1d1d1f' },
} as const;
