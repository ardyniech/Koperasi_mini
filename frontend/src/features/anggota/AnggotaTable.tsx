// React not needed for this component
import { styles } from './anggotaTableStyles';

interface Anggota {
  id: number;
  nama: string;
  email: string;
  role: string;
  no_wa?: string;
  status: string;
}

interface AnggotaTableProps {
  members: Anggota[];
  onDelete: (id: number, nama: string) => void;
  onEdit: (anggota: Anggota) => void;
}

function AnggotaTable({ members, onDelete, onEdit }: AnggotaTableProps) {
  if (members.length === 0) {
    return <div style={styles.empty}>Belum ada anggota terdaftar.</div>;
  }

  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Nama</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>No. WA</th>
            <th style={styles.th}>Role</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id} style={styles.tr}>
              <td style={styles.td}>{m.id}</td>
              <td style={styles.td}>{m.nama}</td>
              <td style={styles.td}>{m.email}</td>
              <td style={styles.td}>{m.no_wa || '-'}</td>
              <td style={styles.td}>
                <span style={m.role === 'admin' ? styles.badgeAdmin : styles.badgeMember}>
                  {m.role}
                </span>
              </td>
              <td style={styles.td}>
                <span style={m.status === 'aktif' ? styles.badgeActive : styles.badgeInactive}>
                  {m.status}
                </span>
              </td>
              <td style={styles.td}>
                <button onClick={() => onEdit(m)} style={styles.editBtn}>
                  ✏️ Edit
                </button>
                <button onClick={() => onDelete(m.id, m.nama)} style={styles.deleteBtn}>
                  🗑️ Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AnggotaTable;
