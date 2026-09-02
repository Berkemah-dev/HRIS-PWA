import { useState, useEffect } from 'react';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { asArray, formatDate } from '../lib/format';

interface LeaveBalance {
  type: string;
  total: number;
  used: number;
  icon: string;
}

interface LeaveRequest {
  id: number;
  type: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  duration: number;
  canResubmit: boolean;
}

export default function ManajemenCuti() {
  const navigate = useNavigate();
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        setIsLoading(true);
        const [balanceResult, requestResult] = await Promise.allSettled([
          api.get('/leaves/balance'),
          api.get('/leaves/my'),
        ]);

        if (balanceResult.status === 'fulfilled') {
          setBalances(asArray<Record<string, unknown>>(balanceResult.value.data).map((balance) => ({
            type: String(balance.type ?? balance.leave_type ?? balance.name ?? 'Cuti'),
            total: Number(balance.total ?? balance.entitlement ?? 0),
            used: Number(balance.used ?? balance.taken ?? 0),
            icon: String(balance.icon ?? 'calendar_today'),
          })));
        }

        if (requestResult.status === 'fulfilled') {
          setRequests(asArray<Record<string, unknown>>(requestResult.value.data).map((request) => ({
            id: Number(request.id),
            type: String(request.leave_type ?? request.type ?? request.leave_type_name ?? 'Cuti'),
            startDate: formatDate(request.start_date),
            endDate: formatDate(request.end_date),
            status: String(request.status ?? 'pending') as LeaveRequest['status'],
            appliedAt: formatDate(request.created_at ?? request.applied_at),
            duration: Number(request.total_days ?? request.duration ?? request.days ?? 0),
            canResubmit: ['returned', 'revision', 'rejected'].includes(String(request.status ?? '').toLowerCase()),
          })));
        }
      } catch {
        setBalances([]);
        setRequests([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaves();
  }, []);

  const renderStatus = (status: string) => {
    switch(status) {
      case 'pending': return <span className="px-2 py-1 rounded-full bg-surface-variant text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">Menunggu</span>;
      case 'approved': return <span className="px-2 py-1 rounded-full bg-primary-container text-on-primary-container text-[10px] font-bold uppercase tracking-wider">Disetujui</span>;
      case 'rejected': return <span className="px-2 py-1 rounded-full bg-error-container text-on-error-container text-[10px] font-bold uppercase tracking-wider">Ditolak</span>;
    }
  };

  const resubmitLeave = async (id: number) => {
    await api.put(`/leaves/${id}/resubmit`);
    setRequests((current) => current.map((request) => request.id === id ? { ...request, status: 'pending', canResubmit: false } : request));
  };

  return (
    <div className="w-full flex flex-col h-full overflow-y-auto">
      <div className="flex flex-col w-full gap-stack-md px-margin-mobile">
        
        {/* Balance Overview */}
        <section className="flex flex-col gap-stack-sm mt-4">
          <h2 className="text-headline-md text-on-surface">Sisa Cuti & Izin</h2>
          {isLoading ? (
            <div className="flex justify-center p-4"><span className="material-symbols-outlined animate-spin text-primary">sync</span></div>
          ) : (
            <div className="grid grid-cols-2 gap-stack-md">
              {balances.map((balance, idx) => (
                <div key={idx} className={`${idx === 0 ? 'bg-primary-container text-on-primary-container relative overflow-hidden' : 'bg-surface-container-high text-on-surface'} rounded-xl p-4 flex flex-col justify-between min-h-[120px] shadow-sm`}>
                  {idx === 0 && <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-xl"></div>}
                  <div className="flex items-center gap-2 relative z-10">
                    <span className={`material-symbols-outlined ${idx === 0 ? 'text-primary' : 'text-tertiary'} text-[20px]`}>{balance.icon}</span>
                    <span className="text-label-md font-medium">{balance.type}</span>
                  </div>
                  <div className="flex items-end justify-between relative z-10">
                    <div className="flex items-baseline gap-1">
                      <span className="text-[32px] font-bold leading-none">{Math.max(balance.total - balance.used, 0)}</span>
                      <span className="text-label-sm opacity-80">/ {balance.total} hari</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Primary Action */}
        <div className="py-2 mt-2">
          <button 
            onClick={() => navigate('/ajukan-cuti-baru')}
            className="w-full bg-primary text-on-primary min-h-[48px] rounded-full flex items-center justify-center gap-2 shadow-md hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span className="text-label-md font-semibold">Ajukan Cuti Baru</span>
          </button>
        </div>

        {/* My Leave Requests */}
        <section className="flex flex-col gap-stack-sm pb-8 mt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-headline-md text-on-surface">Riwayat Pengajuan</h2>
            <button className="text-primary text-label-sm font-semibold">See All</button>
          </div>
          
          <div className="flex flex-col gap-3">
            {isLoading ? (
               <div className="flex justify-center"><span className="material-symbols-outlined animate-spin text-primary">sync</span></div>
            ) : requests.length === 0 ? (
               <div className="p-4 text-center text-on-surface-variant">Belum ada pengajuan cuti.</div>
            ) : requests.map(req => (
              <div key={req.id} className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-label-md font-bold text-on-surface">{req.type}</span>
                    <span className="text-body-md text-on-surface-variant mt-1">{req.startDate} - {req.endDate}</span>
                  </div>
                  {renderStatus(req.status)}
                </div>
                <div className="flex items-center justify-between text-label-sm text-on-surface-variant pt-3 border-t border-outline-variant/20">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">schedule</span> {req.duration} Days</span>
                  <span>Applied: {req.appliedAt}</span>
                </div>
                {req.canResubmit && (
                  <button onClick={() => resubmitLeave(req.id)} className="h-10 rounded-xl bg-primary text-on-primary font-semibold">
                    Resubmit Revisi
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
