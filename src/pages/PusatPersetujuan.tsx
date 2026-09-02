import { useEffect, useState } from 'react';
import api from '../lib/api';
import { asArray, formatDate, formatRupiah } from '../lib/format';
import { useAuthStore } from '../store/authStore';

type NestedRecord = Record<string, unknown>;

type ApprovalRequest = {
  id: number;
  source: 'leaves' | 'reimbursements' | 'overtime/requests';
  employeeName: string;
  role: string;
  type: 'Cuti' | 'Lembur' | 'Reimbursement';
  details: string;
  date: string;
  canAct: boolean;
};

const nestedName = (item: NestedRecord, keys: string[]) => {
  for (const key of keys) {
    const value = item[key];
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object' && 'name' in value) return String((value as NestedRecord).name);
  }
  return 'Karyawan';
};

export default function PusatPersetujuan() {
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const canApprove = hasPermission(['leave.approve', 'reimbursement.approve', 'overtime.approve']);
  const [activeTab, setActiveTab] = useState('Semua');
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!canApprove) {
      setIsLoading(false);
      setRequests([]);
      return;
    }

    Promise.allSettled([
      hasPermission('leave.approve') ? api.get('/leaves/pending') : Promise.resolve({ data: [] }),
      hasPermission('reimbursement.approve') ? api.get('/reimbursements/pending') : Promise.resolve({ data: [] }),
      hasPermission('overtime.approve') ? api.get('/overtime/requests/pending') : Promise.resolve({ data: [] }),
    ]).then(([leaveResult, reimbursementResult, overtimeResult]) => {
      const next: ApprovalRequest[] = [];

      if (leaveResult.status === 'fulfilled') {
        next.push(...asArray<NestedRecord>(leaveResult.value.data).map((item) => ({
          id: Number(item.id),
          source: 'leaves' as const,
          employeeName: nestedName(item, ['employee_name', 'user', 'employee']),
          role: String(item.department ?? '-'),
          type: 'Cuti' as const,
          details: String(item.leave_type ?? item.type ?? 'Pengajuan cuti'),
          date: `${formatDate(item.start_date)} - ${formatDate(item.end_date)}`,
          canAct: item.can_act !== false,
        })));
      }

      if (reimbursementResult.status === 'fulfilled') {
        next.push(...asArray<NestedRecord>(reimbursementResult.value.data).map((item) => ({
          id: Number(item.id),
          source: 'reimbursements' as const,
          employeeName: nestedName(item, ['employee_name', 'employee', 'user']),
          role: String(item.category ?? '-'),
          type: 'Reimbursement' as const,
          details: `${String(item.title ?? item.description ?? 'Klaim')} (${formatRupiah(item.amount)})`,
          date: formatDate(item.expense_date ?? item.created_at),
          canAct: item.can_act !== false,
        })));
      }

      if (overtimeResult.status === 'fulfilled') {
        next.push(...asArray<NestedRecord>(overtimeResult.value.data).map((item) => ({
          id: Number(item.id),
          source: 'overtime/requests' as const,
          employeeName: nestedName(item, ['employee_name', 'employee', 'user']),
          role: String(item.reason ?? '-'),
          type: 'Lembur' as const,
          details: String(item.reason ?? item.description ?? 'Pengajuan lembur'),
          date: formatDate(item.overtime_date ?? item.date ?? item.created_at),
          canAct: item.can_act !== false,
        })));
      }

      setRequests(next);
    }).catch(() => setRequests([])).finally(() => setIsLoading(false));
  }, [canApprove, hasPermission]);

  const tabs = ['Semua', 'Cuti', 'Lembur', 'Reimbursement'];
  const filteredRequests = activeTab === 'Semua' ? requests : requests.filter(r => r.type === activeTab);

  const handleAction = async (request: ApprovalRequest, action: 'approve' | 'reject') => {
    await api.put(`/${request.source}/${request.id}/${action}`);
    setRequests((current) => current.filter((item) => !(item.id === request.id && item.source === request.source)));
  };

  const getBadgeColor = (type: string) => {
    switch(type) {
      case 'Cuti': return 'bg-tertiary-fixed-dim text-on-surface';
      case 'Lembur': return 'bg-primary-container text-on-primary-container';
      case 'Reimbursement': return 'bg-secondary-container text-on-secondary-container';
      default: return 'bg-surface-variant text-on-surface-variant';
    }
  };

  if (!canApprove) {
    return <div className="p-margin-mobile text-center text-on-surface-variant">Akses approval tidak tersedia untuk akun ini.</div>;
  }

  return (
    <div className="w-full flex flex-col h-full overflow-y-auto">
      <div className="flex flex-col w-full relative">
        <div className="px-margin-mobile pt-stack-md pb-stack-sm flex items-center justify-between">
          <div>
            <h1 className="font-headline-lg text-on-surface">Pusat Persetujuan</h1>
            <p className="font-body-md text-on-surface-variant mt-1">{requests.length} permintaan menunggu</p>
          </div>
        </div>
        <div className="w-full overflow-x-auto hide-scrollbar px-margin-mobile pb-stack-sm">
          <div className="flex gap-2 w-max">
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-full font-label-md flex items-center gap-1.5 transition-all shadow-sm ${activeTab === tab ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}>{tab}</button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-stack-md px-margin-mobile pb-stack-lg">
          {isLoading && <div className="flex justify-center p-8"><span className="material-symbols-outlined animate-spin text-primary">sync</span></div>}
          {!isLoading && filteredRequests.length === 0 && (
            <div className="p-8 flex flex-col items-center justify-center text-on-surface-variant opacity-70"><span className="material-symbols-outlined text-[48px] mb-2">check_circle</span><p>Tidak ada permintaan menunggu</p></div>
          )}
          {filteredRequests.map(req => (
            <div key={`${req.source}-${req.id}`} className="bg-surface-container-lowest rounded-xl shadow-sm flex flex-col overflow-hidden border border-outline-variant/20">
              <div className={`h-1 ${getBadgeColor(req.type)}`} />
              <div className="p-4 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant"><span className="material-symbols-outlined">person</span></div>
                  <div className="flex-1 min-w-0"><h3 className="font-headline-md text-on-surface truncate">{req.employeeName}</h3><p className="font-body-md text-on-surface-variant truncate">{req.role}</p></div>
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getBadgeColor(req.type)}`}>{req.type}</span>
                </div>
                <div className="bg-surface-container-low rounded-lg p-3 flex flex-col gap-2"><span className="font-body-md text-on-surface">{req.details}</span><span className="font-body-md text-on-surface font-medium">{req.date}</span></div>
              </div>
              <div className="flex border-t border-outline-variant/20">
                <button onClick={() => handleAction(req, 'reject')} disabled={!req.canAct} className="flex-1 py-3 flex items-center justify-center gap-1.5 font-label-md text-error disabled:opacity-40"><span className="material-symbols-outlined text-[18px]">close</span> Tolak</button>
                <div className="w-px bg-outline-variant/20" />
                <button onClick={() => handleAction(req, 'approve')} disabled={!req.canAct} className="flex-1 py-3 flex items-center justify-center gap-1.5 font-label-md text-primary disabled:opacity-40"><span className="material-symbols-outlined text-[18px]">check</span> Setujui</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
