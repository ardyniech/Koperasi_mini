interface PinjamanSubmitButtonProps {
text?: string;
}

export default function PinjamanSubmitButton({ text = 'Catat Pinjaman Syariah' }: PinjamanSubmitButtonProps) {
return (
<button type="submit" style={styles.button}>
{text}
</button>
);
}

const styles = {
button: {
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
width: '100%',
},
};
