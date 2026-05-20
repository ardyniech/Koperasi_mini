import { Pinjaman } from './approvalTypes';

interface ApprovalCardProps {
pinjaman: Pinjaman;
onApprove: (id: number) => void;
onReject: (id: number) => void;
}

export default function ApprovalCard({ pinjaman, onApprove, onReject }: ApprovalCardProps) {
const calculateEstimate = () => {
const total = pinjaman.nominal + (pinjaman.nominal * pinjaman.margin_persen * pinjaman.tenor_bulan) / (12 * 100);
return (total / pinjaman.tenor_bulan).toLocaleString('id-ID');
};

return (
  <>
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div>
          <h3 style={styles.cardTitle}>{pinjaman.anggota_nama}</h3>
          <p style={styles.cardSubtitle}>ID: {pinjaman.id} | Anggota ID: {pinjaman.anggota_id}</p>
        </div>
        <div style={styles.statusBadge}>Diajukan</div>
      </div>

      <div style={styles.cardBody}>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Nominal:</span>
          <span style={styles.infoValue}>Rp{pinjaman.nominal.toLocaleString('id-ID')}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Margin:</span>
          <span style={styles.infoValue}>{pinjaman.margin_persen}% per tahun</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Tenor:</span>
          <span style={styles.infoValue}>{pinjaman.tenor_bulan} bulan</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Estimasi Angsuran:</span>
          <span style={styles.infoValueHighlight}>Rp{calculateEstimate()}/bulan</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Diajukan pada:</span>
          <span style={styles.infoValue}>{new Date(pinjaman.created_at).toLocaleDateString('id-ID')}</span>
        </div>
      </div>

      <div style={styles.cardActions}>
        <button onClick={() => onApprove(pinjaman.id)} style={styles.approveBtn}>
          ✅ Setujui
        </button>
        <button onClick={() => onReject(pinjaman.id)} style={styles.rejectBtn}>
          ❌ Tolak
        </button>
      </div>
    </div>
  </>
);
}

const styles = {
card: {
background: 'rgba(255,255,255,0.85)',
backdropFilter: 'blur(20px)',
borderRadius: 16,
padding: 20,
border: '1px solid rgba(255,255,255,0.3)',
boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
},
cardHeader: {
display: 'flex',
justifyContent: 'space-between' as const,
alignItems: 'flex-start' as const,
marginBottom: 16,
},
cardTitle: {
fontSize: 18,
fontWeight: 600,
color: '#1d1d1f',
margin: '0 0 4px 0',
},
cardSubtitle: {
fontSize: 12,
color: '#86868b',
margin: 0,
},
statusBadge: {
backgroundColor: 'rgba(255,149,0,0.1)',
color: '#ff9500',
padding: '4px 12px',
borderRadius: 12,
fontSize: 12,
fontWeight: 600,
},
cardBody: {
display: 'flex',
flexDirection: 'column' as const,
gap: 10,
marginBottom: 16,
paddingBottom: 16,
borderBottom: '1px solid rgba(0,0,0,0.05)',
},
infoRow: {
display: 'flex',
justifyContent: 'space-between' as const,
alignItems: 'center' as const,
},
infoLabel: {
fontSize: 14,
color: '#86868b',
},
infoValue: {
fontSize: 14,
fontWeight: 600,
color: '#1d1d1f',
},
infoValueHighlight: {
fontSize: 14,
fontWeight: 600,
color: '#007aff',
},
cardActions: {
display: 'flex',
gap: 12,
},
approveBtn: {
flex:1,
padding: '12px 16px',
backgroundColor: 'rgba(52,199,89,0.1)',
color: '#34c759',
border: '2px solid #34c759',
borderRadius: 12,
fontSize: 14,
fontWeight: 600,
cursor: 'pointer',
},
rejectBtn: {
flex:1,
padding: '12px 16px',
backgroundColor: 'rgba(255,59,48,0.1)',
color: '#ff3b30',
border: '2px solid #ff3b30',
borderRadius: 12,
fontSize: 14,
fontWeight: 600,
cursor: 'pointer',
},
};
