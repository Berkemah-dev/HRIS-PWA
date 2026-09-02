import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { asArray, cn, formatRupiah, formatTime, unwrapData } from '../lib/format';
import { useAuthStore } from '../store/authStore';

type TodayAttendance = {
  check_in?: string | null;
  check_out?: string | null;
  status?: string;
  work_schedule?: { name?: string; check_in_time?: string; check_out_time?: string };
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
  const [todayStr] = useState(() => new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' }));


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
    { label: 'Presensi', icon: 'fingerprint', path: '/presensi-harian', color: 'bg-emerald-50 text-emerald-700 border-emerald-200/60' },
    { label: 'Riwayat', icon: 'history', path: '/riwayat-presensi', color: 'bg-teal-50 text-teal-700 border-teal-200/60' },
    { label: 'Cuti', icon: 'event_busy', path: '/cuti', color: 'bg-sky-50 text-sky-700 border-sky-200/60' },
    { label: 'Reimburse', icon: 'receipt_long', path: '/reimbursement-saya', color: 'bg-purple-50 text-purple-700 border-purple-200/60' },
    { label: 'Slip Gaji', icon: 'payments', path: '/slip-gaji', color: 'bg-emerald-50 text-emerald-700 border-emerald-200/60' },
    { label: 'KPI Saya', icon: 'query_stats', path: '/kpi-saya', color: 'bg-amber-50 text-amber-700 border-amber-200/60' },
    { label: 'Training', icon: 'school', path: '/pelatihan', color: 'bg-indigo-50 text-indigo-700 border-indigo-200/60' },
    { label: 'Aset Saya', icon: 'devices', path: '/aset-saya', color: 'bg-rose-50 text-rose-700 border-rose-200/60' },
    { label: 'Overtime', icon: 'more_time', path: '/overtime-saya', color: 'bg-orange-50 text-orange-700 border-orange-200/60' },
    { label: 'Dokumen', icon: 'folder_open', path: '/dokumen-saya', color: 'bg-slate-50 text-slate-700 border-slate-200/60' },
  ];

  const canApprove = hasPermission(['leave.approve', 'reimbursement.approve', 'overtime.approve']);

  return (
    <div className="w-full flex flex-col gap-4 p-4">
      
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#004e47] via-[#006a61] to-[#008378] text-white p-5 shadow-lg shadow-primary/15">
        {/* Background glow effects */}
        <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -left-6 -top-6 w-28 h-28 bg-emerald-400/15 rounded-full blur-xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-medium text-white/95 border border-white/15">
              <span className="material-symbols-outlined text-[14px]">calendar_today</span>
              {todayStr || 'Hari ini'}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-[10px] font-semibold tracking-wide uppercase border border-emerald-300/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
              ESS Portal
            </span>
          </div>

          <div>
            <p className="text-white/80 text-xs font-medium">Selamat datang,</p>
            <h1 className="text-xl font-bold tracking-tight text-white mt-0.5 flex items-center gap-1.5">
              {user?.name ?? 'Karyawan'}
            </h1>
            <p className="text-white/75 text-[12px] mt-1 leading-relaxed">
              Pantau kehadiran, cuti, lembur, dan kelola dokumen kerja Anda dengan mudah.
            </p>
          </div>

          {/* Quick Attendance Widget inside Hero */}
          <div className="mt-1 pt-3 border-t border-white/15 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[18px]">
                  {attendance?.check_in ? 'check_circle' : 'schedule'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-white/80">Status Kehadiran</span>
                <span className="text-xs font-bold text-white">
                  {loading ? 'Memuat...' : (attendance?.check_in ? `Masuk: ${formatTime(attendance.check_in)}` : 'Belum Check-In')}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/presensi-harian')}
              className="px-3 py-1.5 rounded-xl bg-white text-primary text-xs font-bold shadow-xs hover:bg-white/95 active:scale-95 transition-all flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">fingerprint</span>
              <span>{attendance?.check_in ? 'Detail' : 'Presensi'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Metrics 2x2 Grid */}
      <section className="grid grid-cols-2 gap-3">
        {/* Card 1: Attendance */}
        <div 
          onClick={() => navigate('/riwayat-presensi')}
          className="rounded-2xl bg-white p-3.5 border border-slate-200/80 shadow-xs hover:shadow-sm active:scale-[0.98] transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500">Masuk Hari Ini</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">fingerprint</span>
            </div>
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900 leading-tight">
              {loading ? '...' : formatTime(attendance?.check_in)}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
              {attendance?.check_out ? `Pulang: ${formatTime(attendance.check_out)}` : (attendance?.check_in ? 'Sedang bekerja' : 'Belum presensi')}
            </p>
          </div>
        </div>

        {/* Card 2: Leave Balance */}
        <div 
          onClick={() => navigate('/cuti')}
          className="rounded-2xl bg-white p-3.5 border border-slate-200/80 shadow-xs hover:shadow-sm active:scale-[0.98] transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500">Sisa Cuti</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">event_available</span>
            </div>
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900 leading-tight">
              {loading ? '...' : `${leaveDays ?? 0} hari`}
            </p>
            <p className="text-[11px] text-primary font-medium mt-0.5 flex items-center gap-0.5">
              <span>Ajukan cuti</span>
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            </p>
          </div>
        </div>

        {/* Card 3: Payroll */}
        <div 
          onClick={() => navigate('/slip-gaji')}
          className="rounded-2xl bg-white p-3.5 border border-slate-200/80 shadow-xs hover:shadow-sm active:scale-[0.98] transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500">Slip Gaji</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
            </div>
          </div>
          <div>
            <p className="text-base font-bold text-slate-900 leading-tight truncate">
              {loading ? '...' : formatRupiah(payroll?.net_salary ?? payroll?.net_pay ?? payroll?.total_net)}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Periode terakhir</p>
          </div>
        </div>

        {/* Card 4: Approvals / Overview */}
        <div 
          onClick={() => canApprove && navigate('/persetujuan')}
          className={cn(
            "rounded-2xl bg-white p-3.5 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between",
            canApprove ? "active:scale-[0.98] cursor-pointer" : "opacity-80"
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500">Approval Tim</span>
            <div className="w-7 h-7 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">task_alt</span>
            </div>
          </div>
          <div>
            <p className="text-base font-bold text-slate-900 leading-tight">
              {canApprove ? 'Buka Panel' : 'Non-Atasan'}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
              {canApprove ? 'Persetujuan staf' : 'Akses terbatas'}
            </p>
          </div>
        </div>
      </section>

      {/* Services & Menus Grid */}
      <section className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Layanan Mandiri (ESS)</h2>
          <span className="text-[11px] text-slate-400">10 Menu</span>
        </div>

        <div className="grid grid-cols-5 gap-y-3 gap-x-1">
          {menus.map((menu) => (
            <button
              key={menu.path}
              type="button"
              onClick={() => navigate(menu.path)}
              className="flex flex-col items-center justify-center gap-1.5 p-1 rounded-xl hover:bg-slate-50 active:scale-90 transition-all group"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-200 group-hover:shadow-xs ${menu.color}`}>
                <span className="material-symbols-outlined text-[24px]">{menu.icon}</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-700 text-center leading-tight">
                {menu.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Quick Reminder / Info Card */}
      <section className="rounded-2xl bg-gradient-to-r from-primary/10 via-primary-container/10 to-transparent p-3.5 border border-primary/20 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-xs">
          <span className="material-symbols-outlined text-[18px]">info</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-800">Tips Presensi Akurat</span>
          <span className="text-[11px] text-slate-600 leading-snug">
            Pastikan izin lokasi (GPS) pada peramban/ponsel aktif saat melakukan Check-in dan Check-out.
          </span>
        </div>
      </section>

    </div>
  );
}
