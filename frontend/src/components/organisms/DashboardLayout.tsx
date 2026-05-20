import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Banner from '../atoms/Banner';
import DashboardNavPopup from './DashboardNavPopup';
import UserSettingsPopup from './UserSettingsPopup';
import { useUIStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export default function DashboardLayout({
  children,
  title = "Dashboard",
  showBackButton = false,
  onBack,
}: DashboardLayoutProps) {
  const navigate = useNavigate();
  const { isNavOpen, setNavOpen } = useUIStore();
  const [isUserSettingsOpen, setUserSettingsOpen] = useState(false);
  const user = useAuthStore(state => state.user);
  const userName = user?.nama || 'User';
  const userEmail = user?.email || '';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Fixed Header with Glassmorphism */}
      <Banner 
        title={title}
        showBackButton={showBackButton}
        onBack={onBack}
        onMenuClick={() => setNavOpen(true)}
        userName={userName}
        onUserClick={() => navigate('/about')}
      />

      {/* NavPopup */}
      <DashboardNavPopup
        isOpen={isNavOpen}
        onClose={() => setNavOpen(false)}
        userName={userName}
      />

      {/* User Settings Popup */}
      <UserSettingsPopup 
        isOpen={isUserSettingsOpen}
        onClose={() => setUserSettingsOpen(false)}
        userName={userName}
        userEmail={userEmail}
      />

      {/* Scrollable Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-2 space-y-2">
          {children}
        </div>
      </div>
    </div>
  );
}
