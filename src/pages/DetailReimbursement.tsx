import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api';
import { asArray, formatDate, formatRupiah } from '../lib/format';

type Reimbursement = {
  id: number;
  title: string;
  description: string;
  amount: string;
  status: string;
  date: string;
};

export default function DetailReimbursement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<Reimbursement | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/my/reimbursements')
      .then((response) => {
        const found = asArray<Record<string, unknown>>(response.data).find((row) => Number(row.id) === Number(id));
        if (!found) return;
        setItem({
          id: Number(found.id),
          title: String(found.title ?? found.category ?? 'Reimbursement'),
          description: String(found.description ?? '-'),
          amount: formatRupiah(found.amount),
          status: String(found.status ?? 'draft'),
          date: formatDate(found.expense_date ?? found.created_at),
        });
      });
  }, [id]);

  const submit = async () => {
    await api.post(`/my/reimbursements/${id}/submit`);
    setMessage('Klaim berhasil disubmit.');
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-surface px-margin-mobile py-stack-md">
      <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant"><span className="material-symbols-outlined">arrow_back</span></button>
      {message && <div className="mt-4 p-3 rounded-lg bg-primary-container text-on-primary-container text-label-sm">{message}</div>}
      {!item ? <div className="p-8 text-center text-on-surface-variant">Memuat detail...</div> : (
        <div className="mt-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 p-5 flex flex-col gap-3">
          <h1 className="text-headline-lg font-bold text-on-surface">{item.title}</h1>
          <p className="text-body-md text-on-surface-variant">{item.description}</p>
          <p className="text-[28px] font-bold text-primary">{item.amount}</p>
          <div className="flex justify-between text-label-sm text-on-surface-variant"><span>{item.date}</span><span>{item.status}</span></div>
          {item.status === 'draft' && <button onClick={submit} className="h-12 rounded-xl bg-primary text-on-primary font-semibold mt-3">Submit Klaim</button>}
        </div>
      )}
    </div>
  );
}
