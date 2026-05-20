import { Transaction } from '../../pages/riwayatTypes';
import Badge from '../atoms/Badge';
import { ArrowDownToLine, ArrowUpFromLine, Wallet, FileText } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
  loading?: boolean;
  error?: string;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'simpanan': return <ArrowDownToLine className="w-5 h-5 text-emerald-600" />;
    case 'pinjaman': return <ArrowUpFromLine className="w-5 h-5 text-blue-600" />;
    case 'angsuran': return <Wallet className="w-5 h-5 text-amber-600" />;
    case 'funding': return <FileText className="w-5 h-5 text-purple-600" />;
    default: return null;
  }
};

export default function TransactionTable({ transactions, loading = false, error = '' }: TransactionTableProps) {
  if (loading) return <div className="text-center py-8 text-slate-500">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (transactions.length === 0) return <div className="text-center py-8 text-slate-500">Tidak ada transaksi</div>;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 text-left text-sm text-slate-500">
              <th className="px-6 py-4">Tipe</th>
              <th className="px-6 py-4">Jumlah</th>
              <th className="px-6 py-4">Tanggal</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Deskripsi</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-t border-slate-100 hover:bg-slate-50/50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {getIcon(tx.type)}
                    <span className="capitalize">{tx.type}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium">
                  Rp {tx.amount.toLocaleString('id-ID')}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {new Date(tx.date).toLocaleDateString('id-ID')}
                </td>
                <td className="px-6 py-4">
                  <Badge 
                    variant={
                      tx.status === 'approved' || tx.status === 'lunas' ? 'success' :
                      tx.status === 'pending' ? 'warning' : 'danger'
                    } 
                  >
                    {tx.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                  {tx.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
