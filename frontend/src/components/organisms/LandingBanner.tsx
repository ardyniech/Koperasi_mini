interface BannerProps {
logo_url?: string;
community_name: string;
primary_color: string;
}

export default function LandingBanner({ logo_url, community_name, primary_color }: BannerProps) {
return (
<div style={{ ...styles.banner, backgroundColor: primary_color }}>
<div style={styles.bannerContent}>
{logo_url && <img src={logo_url} alt="Logo" style={styles.logo} />}
<h1 style={styles.communityName}>{community_name}</h1>
</div>
</div>
);
}

const styles = {
banner: {
padding: '40px 20px',
color: 'white',
textAlign: 'center' as const,
},
bannerContent: {
maxWidth: 800,
margin: '0 auto',
},
logo: {
width: 80,
height: 80,
borderRadius: '50%',
marginBottom: 20,
objectFit: 'cover' as const,
},
communityName: {
fontSize: 32,
fontWeight: 700,
margin: 0,
},
} as const;
