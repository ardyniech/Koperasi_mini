interface EstimateProps {
nominal: string;
margin_persen: string;
tenor_bulan: string;
}

export default function PinjamanEstimate({ nominal, margin_persen, tenor_bulan }: EstimateProps) {
const numNominal = Number(nominal) || 0;
const numMargin = Number(margin_persen) || 0;
const numTenor = Number(tenor_bulan) || 1;

const total_margin = (numNominal * numMargin * numTenor) / (12 * 100);
const total_bayar = numNominal + total_margin;
const angsuran_per_bulan = total_bayar / numTenor;

return (
  <div style={styles.estimateBox}>
    <h3 style={styles.estimateTitle}>📊 Estimasi Perhitungan</h3>
    <div style={styles.estimateRow}>
      <span>Nominal Pinjaman:</span>
      <span style={styles.estimateValue}>Rp{numNominal.toLocaleString('id-ID')}</span>
    </div>
    <div style={styles.estimateRow}>
      <span>Total Margin ({margin_persen}% × {tenor_bulan} bulan):</span>
      <span style={styles.estimateValue}>Rp{total_margin.toLocaleString('id-ID', { maximumFractionDigits: 0 })}</span>
    </div>
    <div style={styles.estimateRow}>
      <span>Total Bayar:</span>
      <span style={styles.estimateValue}>Rp{total_bayar.toLocaleString('id-ID', { maximumFractionDigits: 0 })}</span>
    </div>
    <div style={styles.estimateRowHighlight}>
      <span>Angsuran per Bulan:</span>
      <span style={styles.estimateValueHighlight}>Rp{angsuran_per_bulan.toLocaleString('id-ID', { maximumFractionDigits: 0 })}</span>
    </div>
  </div>
);
}

const styles = {
estimateBox: {
backgroundColor: '#f5f5f7',
padding: 16,
borderRadius: 12,
marginBottom: 20,
},
estimateTitle: {
fontSize: 16,
fontWeight: 600,
marginBottom: 12,
color: '#1d1d1f',
},
estimateRow: {
display: 'flex',
justifyContent: 'space-between',
fontSize: 14,
color: '#86868b',
marginBottom: 8,
},
estimateValue: {
fontWeight: 600,
color: '#1d1d1f',
},
estimateRowHighlight: {
display: 'flex',
justifyContent: 'space-between',
fontSize: 16,
fontWeight: 600,
color: '#1d1d1f',
marginTop: 12,
paddingTop: 12,
borderTop: '1px solid #e0e0e0',
},
estimateValueHighlight: {
fontWeight: 700,
color: '#007aff',
},
};
