import { X, Camera } from 'lucide-react';
import { useState } from 'react';

interface UserSettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
}

export default function UserSettingsPopup({ 
  isOpen, 
  onClose, 
  userName, 
  userEmail 
}: UserSettingsPopupProps) {
  const [email, setEmail] = useState(userEmail);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setLoading(true);
    console.log('[UserSettings] Saving:', { email, newPassword });
    // TODO: Call API to update user profile
    // PUT /api/v1/users/me
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-6">
      <div 
        className="glass-card w-72 rounded-3xl p-6 float-animation morph-from-source"
        style={{ '--morph-origin': 'top right' } as React.CSSProperties}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">User Settings</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-xl transition">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* User Photo */}
        <div className="text-center mb-4">
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-full bg-emerald-200 border-4 border-white shadow-sm flex items-center justify-center text-emerald-800 font-bold text-2xl">
              {userName.charAt(0).toUpperCase()}
            </div>
            <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-lg border border-slate-200 hover:shadow-xl transition">
              <Camera className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 bg-white/50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        {/* New Password */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Leave blank to keep current"
            className="w-full px-4 py-2.5 bg-white/50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="w-full px-4 py-2.5 bg-white/50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-2xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  );
}
