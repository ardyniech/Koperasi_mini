import Input from '../atoms/Input';

interface FundingFormProps {
  formData: {
    anggota_id: string;
    nominal: string;
    tujuan_usaha: string;
  };
  errors: { anggota_id?: string; nominal?: string; tujuan_usaha?: string };
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: string, value: string) => void;
}

export default function FundingForm({ formData, errors, loading, onSubmit, onChange }: FundingFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    console.log(`[FundingForm] Submit: anggota_id=${formData.anggota_id}, nominal=${formData.nominal}, tujuan=${formData.tujuan_usaha}`);
    onSubmit(e);
  };

  const handleChange = (field: string, value: string) => {
    console.log(`[FundingForm] Change: field=${field}, value=${value}`);
    onChange(field, value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="anggota_id" className="block text-sm font-semibold text-slate-700 mb-1">
          ID Anggota <span className="text-red-500">*</span>
        </label>
        <Input
          id="anggota_id"
          type="number"
          value={formData.anggota_id}
          onChange={(e) => handleChange('anggota_id', e.target.value)}
          placeholder="Masukkan ID anggota"
          error={errors.anggota_id}
        />
        {errors.anggota_id && <p className="text-xs text-red-500 mt-1">{errors.anggota_id}</p>}
      </div>

      <div>
        <label htmlFor="nominal" className="block text-sm font-semibold text-slate-700 mb-1">
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
        {errors.nominal && <p className="text-xs text-red-500 mt-1">{errors.nominal}</p>}
      </div>

      <div>
        <label htmlFor="tujuan_usaha" className="block text-sm font-semibold text-slate-700 mb-1">
          Tujuan Usaha <span className="text-red-500">*</span>
        </label>
        <Input
          id="tujuan_usaha"
          type="text"
          value={formData.tujuan_usaha}
          onChange={(e) => handleChange('tujuan_usaha', e.target.value)}
          placeholder="Contoh: Warung Kelontong"
          error={errors.tujuan_usaha}
        />
        {errors.tujuan_usaha && <p className="text-xs text-red-500 mt-1">{errors.tujuan_usaha}</p>}
      </div>

      <div className="space-y-2 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-2xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            '💰 Simpan Dana Gotong Royong'
          )}
        </button>
      </div>
    </form>
  );
}
