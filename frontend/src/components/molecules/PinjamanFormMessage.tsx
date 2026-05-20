interface PinjamanFormMessageProps {
message: string;
}

export default function PinjamanFormMessage({ message }: PinjamanFormMessageProps) {
if (!message) return null;

return (
<p style={message.includes('berhasil') ? styles.success : styles.error}>
{message}
</p>
);
}

const styles = {
success: {
background: 'rgba(52,199,89,0.1)',
color: '#34c759',
padding: '12px 16px',
borderRadius: 12,
fontSize: 14,
margin: '16px 0 0 0',
},
error: {
background: 'rgba(255,59,48,0.1)',
color: '#ff3b30',
padding: '12px 16px',
borderRadius: 12,
fontSize: 14,
margin: '16px 0 0 0',
},
};
