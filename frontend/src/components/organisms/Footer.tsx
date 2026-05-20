import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getSettings, SettingsUpdate } from '../../api';

export default function Footer() {
  const navigate = useNavigate();
  const [footerText, setFooterText] = useState('Powered by Ardyniech');

  useEffect(() => {
    getSettings()
      .then((res: { data: SettingsUpdate }) => {
        if (res.data.footer_text) {
          setFooterText(res.data.footer_text);
        }
      })
      .catch((err: unknown) => console.error('Failed to load footer text:', err));
  }, []);

  return (
    <div className="mt-8 pt-6 border-t border-slate-200 text-center">
      <p className="text-xs text-slate-400">
        © 2026 Koperasi Mini Syariah. Built with <Heart className="w-3 h-3 inline text-red-400" /> by {footerText}.
      </p>
      <p className="text-xs text-slate-400 mt-1">
        Versi 1.0.0 - No Riba, No Denda
      </p>
      <button 
        onClick={() => navigate('/about')}
        className="text-xs text-indigo-600 hover:text-indigo-700 mt-2 underline underline-offset-2"
      >
        Dukung kami dengan donasi →
      </button>
    </div>
  );
}
