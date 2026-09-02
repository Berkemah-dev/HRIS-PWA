import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function FormulirReimbursement() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: 'medical',
    amount: '',
    expense_date: new Date().toISOString().slice(0, 10),
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await api.post('/my/reimbursements', formData);
      navigate('/reimbursement-saya');
    } catch (err) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      setError(message || 'Gagal mengirim klaim reimbursement.');
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
          <h2 className="text-headline-lg font-bold text-on-surface">Formulir Reimbursement</h2>
        </div>

        {error && <div className="p-3 bg-error-container text-on-error-container rounded-lg text-label-sm">{error}</div>}

        <form className="flex flex-col gap-4 mt-2" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label className="text-label-sm font-semibold text-on-surface">Judul Klaim</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary outline-none"
              placeholder="Contoh: Transport meeting client"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-label-sm font-semibold text-on-surface">Tipe Klaim</label>
            <select 
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
              className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary outline-none"
            >
              <option value="medical">Medical / Pengobatan</option>
              <option value="transportation">Transportasi / Perjalanan Dinas</option>
              <option value="meal">Makan / Entertainment</option>
              <option value="training">Training</option>
              <option value="other">Lainnya</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-label-sm font-semibold text-on-surface">Tanggal Pengeluaran</label>
            <input
              type="date"
              required
              value={formData.expense_date}
              onChange={e => setFormData({...formData, expense_date: e.target.value})}
              className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-label-sm font-semibold text-on-surface">Nominal (Rp)</label>
            <input 
              type="number" 
              required
              value={formData.amount}
              onChange={e => setFormData({...formData, amount: e.target.value})}
              className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary outline-none"
              placeholder="e.g. 500000"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-label-sm font-semibold text-on-surface">Keterangan Tambahan</label>
            <textarea 
              rows={3}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full p-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary outline-none resize-none"
            ></textarea>
          </div>

          <button type="submit" disabled={isLoading} className="w-full h-14 mt-4 bg-primary text-on-primary rounded-xl font-headline-md flex items-center justify-center shadow-md disabled:opacity-60">
            {isLoading ? 'Mengirim...' : 'Kirim Klaim'}
          </button>
        </form>
      </div>
    </div>
  );
}
