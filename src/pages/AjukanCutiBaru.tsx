import { type FormEvent, useEffect, useState } from 'react';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { asArray } from '../lib/format';

type LeaveType = {
  id?: number;
  code?: string;
  name?: string;
};

export default function AjukanCutiBaru() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'annual',
    start_date: '',
    end_date: '',
    reason: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);

  useEffect(() => {
    api.get('/leave-types')
      .then((response) => setLeaveTypes(asArray<LeaveType>(response.data)))
      .catch(() => setLeaveTypes([]));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await api.post('/leaves', formData);
      navigate('/cuti');
    } catch (err) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      setError(message || 'Gagal mengajukan cuti.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col h-full overflow-y-auto">
      <div className="flex flex-col w-full gap-stack-md px-margin-mobile py-4">
        
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-headline-lg font-bold text-on-surface">Ajukan Cuti Baru</h2>
        </div>

        {error && (
          <div className="p-3 bg-error-container text-on-error-container rounded-lg text-label-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <label className="text-label-sm font-semibold text-on-surface">Tipe Cuti</label>
            <select 
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value})}
              className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary outline-none"
            >
              {leaveTypes.length === 0 ? (
                <>
                  <option value="annual">Cuti Tahunan</option>
                  <option value="sick">Cuti Sakit</option>
                  <option value="unpaid">Cuti Tanpa Tanggungan</option>
                </>
              ) : leaveTypes.map((type) => (
                <option key={type.id ?? type.code ?? type.name} value={String(type.code ?? type.id ?? type.name)}>
                  {type.name ?? type.code ?? 'Cuti'}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-label-sm font-semibold text-on-surface">Tanggal Mulai</label>
              <input 
                type="date" 
                required
                value={formData.start_date}
                onChange={e => setFormData({...formData, start_date: e.target.value})}
                className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-label-sm font-semibold text-on-surface">Tanggal Selesai</label>
              <input 
                type="date" 
                required
                value={formData.end_date}
                onChange={e => setFormData({...formData, end_date: e.target.value})}
                className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 mt-2">
            <label className="text-label-sm font-semibold text-on-surface">Alasan Cuti / Keterangan</label>
            <textarea 
              rows={4}
              required
              value={formData.reason}
              onChange={e => setFormData({...formData, reason: e.target.value})}
              placeholder="Jelaskan alasan cuti Anda..."
              className="w-full p-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary outline-none resize-none"
            ></textarea>
          </div>

          <div className="flex flex-col gap-1 mt-2">
            <label className="text-label-sm font-semibold text-on-surface">Dokumen Pendukung (Opsional)</label>
            <div className="w-full h-24 rounded-xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
              <span className="text-label-sm mt-1">Upload Surat Dokter / Dokumen</span>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full h-14 mt-4 bg-primary text-on-primary rounded-xl font-headline-md flex items-center justify-center shadow-md disabled:opacity-50"
          >
            {isLoading ? 'Memproses...' : 'Kirim Pengajuan'}
          </button>
        </form>
      </div>
    </div>
  );
}
