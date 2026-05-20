interface FooterProps {
footer_text: string;
social_instagram?: string;
social_linkedin?: string;
social_website?: string;
}

export default function LandingFooter({ footer_text, social_instagram, social_linkedin, social_website }: FooterProps) {
return (
<footer style={styles.footer}>
<p style={styles.footerText}>{footer_text}</p>
{(social_instagram || social_linkedin || social_website) && (
<div style={styles.socialLinks}>
{social_instagram && (
<a href={social_instagram} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>Instagram</a>
)}
{social_linkedin && (
<a href={social_linkedin} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>LinkedIn</a>
)}
{social_website && (
<a href={social_website} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>Website</a>
)}
</div>
)}
</footer>
);
}

const styles = {
footer: {
padding: '6px 20px',
textAlign: 'center' as const,
borderTop: '1px solid #f5f5f7',
},
footerText: {
fontSize: 12,
color: '#86868b',
marginBottom: 2,
},
socialLinks: {
display: 'flex',
gap: 8,
justifyContent: 'center',
},
socialLink: {
fontSize: 12,
color: '#007aff',
textDecoration: 'none',
},
} as const;
