interface SaldoCardProps {
totalSaldo: number;
}

function SaldoCard({ totalSaldo }: SaldoCardProps) {
return (
<div style={styles.saldoBox}>
<p style={styles.saldoLabel}>Total Saldo</p>
<p style={styles.saldoValue}>Rp{totalSaldo.toLocaleString()}</p>
</div>
);
}

const styles = {
saldoBox: {
background: '#f5f5f7',
borderRadius: 12,
padding: 20,
textAlign: 'center' as const,
marginBottom: 30
},
saldoLabel: {
fontSize: 14,
color: '#86868b',
marginBottom: 5
},
saldoValue: {
fontSize: 32,
fontWeight: 700,
color: '#34c759'
}
} as const;

export default SaldoCard;
