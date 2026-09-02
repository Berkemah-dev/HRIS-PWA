import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { asArray, formatRupiah, formatTime, unwrapData } from '../lib/format';
import { useAuthStore } from '../store/authStore';

type TodayAttendance = {
  check_in?: string | null;
  check_out?: string | null;
  status?: string;
};

type Payroll = {
  net_salary?: number;
  net_pay?: number;
  total_net?: number;
};

type LeaveBalance = {
  remaining?: number;
  balance?: number;
  total?: number;
  used?: number;
};

export default function BerandaEss() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const [attendance, setAttendance] = useState<TodayAttendance | null>(null);
  const [payroll, setPayroll] = useState<Payroll | null>(null);
  const [leaveDays, setLeaveDays] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      setLoading(true);
      const [todayResult, payrollResult, leaveResult] = await Promise.allSettled([
        api.get('/attendance/today'),
        api.get('/my/payroll'),
        api.get('/leaves/balance'),
      ]);

      if (!mounted) return;

      if (todayResult.status === 'fulfilled') {
        setAttendance(unwrapData<TodayAttendance>(todayResult.value.data, {}));
      }

      if (payrollResult.status === 'fulfilled') {
        setPayroll(asArray<Payroll>(payrollResult.value.data)[0] ?? unwrapData<Payroll>(payrollResult.value.data, {}));
      }

      if (leaveResult.status === 'fulfilled') {
        const balances = asArray<LeaveBalance>(leaveResult.value.data);
        const totalRemaining = balances.reduce((sum, item) => {
          const remaining = item.remaining ?? item.balance ?? ((item.total ?? 0) - (item.used ?? 0));
          return sum + Number(remaining || 0);
        }, 0);
        setLeaveDays(totalRemaining || null);
      }

      setLoading(false);
    }

    loadDashboard();
    return () => {
      mounted = false;
    };
  }, [hasPermission]);

  const menus = [
    { label: 'Presensi', icon: 'fingerprint', path: '/presensi-harian' },
    { label: 'Riwayat', icon: 'history', path: '/riwayat-presensi' },
    { label: 'Cuti', icon: 'event_busy', path: '/cuti' },
    { label: 'Reimburse', icon: 'receipt_long', path: '/reimbursement-saya' },
    { label: 'Slip Gaji', icon: 'payments', path: '/slip-gaji' },
    { label: 'KPI Saya', icon: 'query_stats', path: '/kpi-saya' },
    { label: 'Training', icon: 'school', path: '/pelatihan' },
    { label: 'Aset Saya', icon: 'devices', path: '/aset-saya' },
    { label: 'Overtime', icon: 'more_time', path: '/overtime-saya' },
    { label: 'Dokumen', icon: 'folder_open', path: '/dokumen-saya' },
  ];

  return (
    <div className="w-full h-full overflow-y-auto bg-surface">
      <div className="flex flex-col gap-stack-lg px-margin-mobile py-stack-md">
        <section className="rounded-xl bg-primary text-on-primary p-5 shadow-sm">
          <p className="text-label-md opacity-90">Selamat datang</p>
          <h1 className="text-headline-xl font-bold mt-1">{user?.name ?? 'Karyawan'}</h1>
          <p className="text-body-md opacity-90 mt-2">Portal ESS untuk presensi, cuti, reimburse, payroll, KPI, training, dan aset.</p>
        </section>

        <section className="grid grid-cols-2 gap-stack-sm">
          <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/30 p-4">
            <p className="text-label-sm text-on-surface-variant">Masuk Hari Ini</p>
            <p className="text-headline-md text-on-surface mt-1">{loading ? '...' : formatTime(attendance?.check_in)}</p>
          </div>
          <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/30 p-4">
            <p className="text-label-sm text-on-surface-variant">Sisa Cuti</p>
            <p className="text-headline-md text-on-surface mt-1">{loading ? '...' : `${leaveDays ?? 0} hari`}</p>
          </div>
          <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/30 p-4">
            <p className="text-label-sm text-on-surface-variant">Payroll Terakhir</p>
            <p className="text-headline-md text-on-surface mt-1">{loading ? '...' : formatRupiah(payroll?.net_salary ?? payroll?.net_pay ?? payroll?.total_net)}</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/persetujuan')}
            className="rounded-xl bg-surface-container-lowest border border-outline-variant/30 p-4 text-left disabled:opacity-60"
            disabled={!hasPermission(['leave.approve', 'reimbursement.approve', 'overtime.approve'])}
          >
            <p className="text-label-sm text-on-surface-variant">Approval</p>
            <p className="text-headline-md text-on-surface mt-1">
              {hasPermission(['leave.approve', 'reimbursement.approve', 'overtime.approve']) ? 'Buka' : 'Tidak ada'}
            </p>
          </button>
        </section>

        <section className="grid grid-cols-4 gap-stack-sm">
          {menus.map((menu) => (
            <button
              key={menu.path}
              type="button"
              onClick={() => navigate(menu.path)}
              className="min-h-[82px] rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col items-center justify-center gap-2 text-center px-2 active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-primary text-[24px]">{menu.icon}</span>
              <span className="text-[11px] leading-tight font-semibold text-on-surface">{menu.label}</span>
            </button>
          ))}
        </section>
      </div>
    </div>
  );
}
