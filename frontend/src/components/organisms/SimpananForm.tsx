import React, { useState, useEffect } from 'react';
import { getAnggotaList, Anggota } from '../../api';
import { styles } from './simpananFormStyles';

interface SimpananFormProps {
  onSubmit: (data: { anggota_id: string; jenis: string; nominal: string; keterangan: string }) => void;
  message: string;
}

export default function SimpananForm({ onSubmit, message }: SimpananFormProps) {
  const [form, setForm] = useState({
    anggota_id: '',
    jenis: 'Pokok',
    nominal: '',
    keterangan: '',
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
        <label style={styles.label}>Jenis Simpanan</label>
        <select name="jenis" value={form.jenis} onChange={handleChange} style={styles.select}>
          <option value="Pokok">Pokok</option>
          <option value="Wajib">Wajib</option>
          <option value="Sukarela">Sukarela</option>
        </select>
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Nominal</label>
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
        <label style={styles.label}>Keterangan</label>
        <input
          type="text"
          name="keterangan"
          value={form.keterangan}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <button type="submit" style={styles.button}>Simpan Simpanan</button>
      {message && <p style={message.includes('berhasil') ? styles.success : styles.error}>{message}</p>}
    </form>
  );
}
