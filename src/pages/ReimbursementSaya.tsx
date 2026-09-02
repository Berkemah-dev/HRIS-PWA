import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { asArray, formatDate, formatRupiah } from '../lib/format';

type ReimbursementItem = {
  id: number;
  title: string;
  date: string;
  amount: string;
  status: string;
};

export default function ReimbursementSaya() {
  const navigate = useNavigate();
  const [items, setItems] = useState<ReimbursementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/my/reimbursements')
      .then((response) => {
        setItems(asArray<Record<string, unknown>>(response.data).map((item) => ({
          id: Number(item.id),
          title: String(item.title ?? item.description ?? item.category ?? 'Reimbursement'),
          date: formatDate(item.expense_date ?? item.date ?? item.created_at),
          amount: formatRupiah(item.amount),
          status: String(item.status ?? 'draft'),
        })));
      })
      .catch(() => setItems([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="w-full flex flex-col h-full overflow-y-auto">
      <div className="flex flex-col w-full gap-stack-md px-margin-mobile py-stack-md">
        
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-headline-md text-on-surface">Reimbursement Saya</h2>
        </div>

        <button 
          onClick={() => navigate('/formulir-reimbursement')}
          className="w-full bg-primary text-on-primary min-h-[48px] rounded-full flex items-center justify-center gap-2 shadow-md hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span className="text-label-md font-semibold">Buat Klaim Baru</span>
        </button>

        <div className="flex flex-col gap-3 mt-4">
          {isLoading && (
            <div className="flex justify-center p-8">
              <span className="material-symbols-outlined animate-spin text-primary">sync</span>
            </div>
          )}
          {!isLoading && items.length === 0 && (
            <div className="p-6 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-center text-on-surface-variant">
              Belum ada klaim reimbursement.
            </div>
          )}
          {items.map(item => (
            <button key={item.id} onClick={() => navigate(`/reimbursement-saya/${item.id}`)} className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex flex-col gap-2 text-left">
              <div className="flex justify-between items-start">
                <span className="text-label-md font-bold text-on-surface">{item.title}</span>
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${item.status === 'Approved' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-variant text-on-surface-variant'}`}>
                  {item.status}
                </span>
              </div>
              <span className="text-body-md text-on-surface-variant">{item.date}</span>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-outline-variant/20">
                <span className="text-headline-md font-bold text-on-surface">{item.amount}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
