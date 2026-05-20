export type TabType = 'branding' | 'database' | 'community' | 'margin';

interface TabBarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const tabs = [
  { key: 'branding' as const, label: 'Branding' },
  { key: 'database' as const, label: 'Database' },
  { key: 'community' as const, label: 'Struktur Komunitas' },
  { key: 'margin' as const, label: 'Margin Syariah' },
];

export default function SettingsTabBar({ activeTab, setActiveTab }: TabBarProps) {
  return (
    <div style={styles.tabBar}>
      {tabs.map(tab => (
        <button
          key={tab.key}
          style={tabStyle(activeTab === tab.key)}
          onClick={() => setActiveTab(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

const tabStyle = (active: boolean) => ({
  padding: '12px 20px',
  background: active ? 'linear-gradient(135deg, #007aff 0%, #5856d6 100%)' : 'rgba(255,255,255,0.5)',
  color: active ? 'white' : '#1d1d1f',
  borderRadius: 12,
  cursor: 'pointer' as const,
  fontSize: 14,
  fontWeight: active ? 600 : 400,
  boxShadow: active ? '0 4px 12px rgba(0,122,255,0.3)' : 'none',
  backdropFilter: active ? 'none' : 'blur(10px)',
  border: active ? 'none' : '1px solid rgba(0,0,0,0.05)',
});

const styles = {
  tabBar: {
    display: 'flex' as const,
    gap: 10,
    marginBottom: 24,
    padding: '8px',
    background: 'rgba(255,255,255,0.5)',
    backdropFilter: 'blur(20px)',
    borderRadius: 16,
    border: '1px solid rgba(255,255,255,0.3)',
  },
};
