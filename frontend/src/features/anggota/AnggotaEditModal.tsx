import React, { useState } from 'react';
import api, { Anggota } from '../../api';
import { AxiosError } from 'axios';
import { styles } from './anggotaEditModalStyles';

interface AnggotaEditData {
  nama: string;
  email: string;
  no_wa: string | null;
  role: string;
  status: string;
  password?: string;
}

interface AnggotaEditModalProps {
  anggota: Anggota;
  onClose: () => void;
  onSave: () => void;
}

export default function AnggotaEditModal({ anggota, onClose, onSave }: AnggotaEditModalProps) {
  const [form, setForm] = useState({
    nama: anggota.nama,
    email: anggota.email,
    no_wa: anggota.no_wa || '',
    role: anggota.role,
    status: anggota.status,
    password: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setMessage('');
    try {
      const data: AnggotaEditData = {
        nama: form.nama,
        email: form.email,
        no_wa: form.no_wa || null,
        role: form.role,
        status: form.status
      };
      if (form.password) data.password = form.password;
      await api.put(`/anggota/${anggota.id}`, data);
      setMessage('Anggota berhasil diupdate!');
      setTimeout(() => { onSave(); onClose(); }, 1000);
  } catch (err: unknown) {
    setMessage(err instanceof AxiosError ? 'Error: ' + (err.response?.data?.detail || 'Gagal update') : 'Gagal update');
  } finally { setLoading(false); }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Edit Anggota</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          {['nama', 'email', 'no_wa'].map((field) => (
            <div key={field} style={styles.inputGroup}>
              <label style={styles.label}>{field === 'no_wa' ? 'No WA' : field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input type={field === 'email' ? 'email' : 'text'} name={field} value={form[field as keyof typeof form] as string} onChange={handleChange} style={styles.input} required />
            </div>
          ))}
          {['role', 'status'].map((field) => (
            <div key={field} style={styles.inputGroup}>
              <label style={styles.label}>{field === 'role' ? 'Role' : 'Status'}</label>
              <select name={field} value={form[field as keyof typeof form] as string} onChange={handleChange} style={styles.input}>
                {(field === 'role' 
                  ? [['anggota', 'Anggota'], ['admin', 'Admin']] 
                  : [['aktif', 'Aktif'], ['nonaktif', 'Non-Aktif']]
                ).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
          ))}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password Baru (kosongkan jika tidak diubah)</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} style={styles.input} placeholder="Min 6 karakter" />
          </div>
          {message && <p style={message.includes('berhasil') ? styles.success : styles.error}>{message}</p>}
          <div style={styles.buttonGroup}>
            <button type="button" onClick={onClose} style={styles.cancelButton}>Batal</button>
            <button type="submit" disabled={loading} style={styles.saveButton}>{loading ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
