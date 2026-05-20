export interface TransaksiTerbaru {
  nama: string;
  jenis: string;
  tanggal: string;
  jumlah: number;
}

interface DashboardTransactionsProps {
  transactions: TransaksiTerbaru[];
}

export default function DashboardTransactions({ transactions }: DashboardTransactionsProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 text-xs font-bold uppercase tracking-wider text-gray-500">
            <th className="px-4 py-2 border-b border-gray-100">Nama Anggota</th>
            <th className="px-4 py-2 border-b border-gray-100">Jenis Transaksi</th>
            <th className="px-4 py-2 border-b border-gray-100">Tanggal</th>
            <th className="px-4 py-2 border-b border-gray-100">Jumlah</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-sm">
          {transactions.length > 0 ? (
            transactions.map((tx, idx) => (
              <tr key={idx} className="hover:bg-gray-50/60 transition">
                <td className="px-4 py-3 font-medium text-gray-800">{tx.nama}</td>
                <td className="px-4 py-3 text-gray-600">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    tx.jenis.includes('Simpan') ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {tx.jenis}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{tx.tanggal}</td>
                <td className="px-4 py-3 font-semibold text-gray-800">Rp {tx.jumlah.toLocaleString('id-ID')}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-gray-400">Belum ada transaksi terbaru</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
