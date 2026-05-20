import Input from '../atoms/Input';
import Button from '../atoms/Button';
import ConfirmDialog from './ConfirmDialog';

interface SimpananFormData {
  anggota_id: string;
  jenis: string;
  nominal: string;
  keterangan: string;
}

interface SimpananFormProps {
  formData: SimpananFormData;
  errors: { anggota_id?: string; nominal?: string };
  loading: boolean;
  showConfirm: boolean;
  anggotaList: Array<{ id: number; nama: string; email: string }>;
  onSubmit: (e: React.FormEvent) => void;
  onConfirm: () => void;
  onCancel: () => void;
  onChange: (field: string, value: string) => void;
}

export default function SimpananForm({
  formData,
  errors,
  loading,
  showConfirm,
  anggotaList,
  onSubmit,
  onConfirm,
  onCancel,
  onChange
}: SimpananFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    console.log(`[SimpananForm] Submit: anggota_id=${formData.anggota_id}, jenis=${formData.jenis}, nominal=${formData.nominal}`);
    onSubmit(e);
  };

  const handleChange = (field: string, value: string) => {
    console.log(`[SimpananForm] Change: field=${field}, value=${value}`);
    onChange(field, value);
  };

  return (
    <form id="simpanan-form" onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="anggota_id" className="block text-xs font-medium text-slate-500 mb-1.5">
          Anggota <span className="text-red-500">*</span>
        </label>
        <select 
          id="anggota_id" 
          value={formData.anggota_id}
          onChange={(e) => handleChange('anggota_id', e.target.value)}
          className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
        >
          <option value="">Pilih Anggota...</option>
          {anggotaList.map((agt) => (
            <option key={agt.id} value={agt.id.toString()}>
              {agt.nama} ({agt.email})
            </option>
          ))}
        </select>
        {errors.anggota_id && <p className="text-xs text-red-500 mt-1">{errors.anggota_id}</p>}
      </div>

      <div>
        <label htmlFor="jenis" className="block text-xs font-medium text-slate-500 mb-1.5">
          Jenis Simpanan
        </label>
        <select 
          id="jenis" 
          value={formData.jenis}
          onChange={(e) => handleChange('jenis', e.target.value)}
          className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
        >
          <option value="Pokok">Simpanan Pokok</option>
          <option value="Wajib">Simpanan Wajib</option>
          <option value="Sukarela">Simpanan Sukarela</option>
        </select>
      </div>

      <div>
        <label htmlFor="nominal" className="block text-xs font-medium text-slate-500 mb-1.5">
          Nominal (Rp) <span className="text-red-500">*</span>
        </label>
        <Input 
          id="nominal" 
          type="number" 
          value={formData.nominal}
          onChange={(e) => handleChange('nominal', e.target.value)}
          placeholder="0"
          error={errors.nominal}
        />
      </div>

      <div>
        <label htmlFor="keterangan" className="block text-xs font-medium text-slate-500 mb-1.5">
          Keterangan
        </label>
        <textarea 
          id="keterangan" 
          value={formData.keterangan}
          onChange={(e) => handleChange('keterangan', e.target.value)}
          placeholder="Keterangan tambahan (opsional)"
          rows={3}
          className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2">
        <Button 
          variant="silhouette" 
          size="lg" 
          fullWidth 
          onClick={() => window.history.back()}
        >
          ← Kembali
        </Button>
        <Button 
          variant="silhouette" 
          size="lg" 
          fullWidth 
          loading={loading} 
          form="simpanan-form" 
          type="submit"
        >
          💰 Simpan
        </Button>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Konfirmasi Simpanan"
        message={`Anda yakin ingin menyimpan dana sebesar Rp ${Number(formData.nominal).toLocaleString('id-ID')}`}
        confirmText="Ya, Simpan"
        cancelText="Batal"
        onConfirm={onConfirm}
        onCancel={onCancel}
        loading={loading}
      />
    </form>
  );
}
