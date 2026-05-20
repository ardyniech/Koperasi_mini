import React, { useState, useEffect } from 'react';
import { getAnggotaList, Anggota } from '../../api';
import { styles } from './fundingFormStyles';

interface FundingFormProps {
  onSubmit: (data: { anggota_id: string; nominal: string; tujuan_usaha: string }) => void;
  message: string;
}

export default function FundingForm({ onSubmit, message }: FundingFormProps) {
  const [form, setForm] = useState({
    anggota_id: '',
    nominal: '',
    tujuan_usaha: '',
  });
  const [members, setMembers] = useState<Anggota[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await getAnggotaList();
        setMembers(res.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal memuat daftar anggota');
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.inputGroup}>
        <label style={styles.label}>ID Anggota</label>
        {loading ? (
          <div style={{...styles.input, color: '#86868b'}}>Memuat anggota...</div>
        ) : error ? (
          <div style={{...styles.input, color: '#ff3b30'}}>{error}</div>
        ) : (
          <select
            name="anggota_id"
            value={form.anggota_id}
            onChange={handleChange}
            style={styles.select}
            required
          >
            <option value="">Pilih Anggota</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.nama} ({member.email})
              </option>
            ))}
          </select>
        )}
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Nominal Dana</label>
        <input
          type="number"
          name="nominal"
          value={form.nominal}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Tujuan Usaha</label>
        <input
          type="text"
          name="tujuan_usaha"
          value={form.tujuan_usaha}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>

      <button type="submit" style={styles.button}>Catat Dana Gotong Royong</button>
      {message && <p style={message.includes('berhasil') ? styles.success : styles.error}>{message}</p>}
    </form>
  );
}
