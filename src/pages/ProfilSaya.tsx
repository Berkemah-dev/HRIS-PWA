import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { formatDate, unwrapData } from '../lib/format';
import { useAuthStore } from '../store/authStore';

type Profile = {
  name: string;
  email: string;
  role: string;
  department: string;
  joinDate: string;
  status: string;
};

export default function ProfilSaya() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/my/profile')
      .then((response) => {
        const payload = unwrapData<Record<string, unknown>>(response.data, {});
        const employee = payload.employee as Record<string, unknown> | undefined;
        const profileData = payload.profile as Record<string, unknown> | undefined;
        setProfile({
          name: String(payload.name ?? user?.name ?? 'Karyawan'),
          email: String(payload.email ?? user?.email ?? '-'),
          role: String(employee?.position ?? employee?.position_name ?? payload.role ?? '-'),
          department: String(employee?.department ?? employee?.department_name ?? '-'),
          joinDate: formatDate(employee?.hire_date ?? payload.created_at),
          status: String(employee?.status ?? profileData?.status ?? 'active'),
        });
      })
      .catch(() => setProfile({
        name: user?.name ?? 'Karyawan',
        email: user?.email ?? '-',
        role: '-',
        department: '-',
        joinDate: '-',
        status: 'active',
      }))
      .finally(() => setIsLoading(false));
  }, [user]);

  if (isLoading) {
    return (
      <div className="p-12 flex justify-center items-center flex-1">
        <span className="material-symbols-outlined animate-spin text-primary text-3xl">sync</span>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="w-full flex flex-col gap-4 p-4">
      {/* Profile Card Header */}
      <div className="bg-white rounded-3xl p-6 flex flex-col items-center border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-r from-primary to-primary-container opacity-90" />
        
        <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-primary relative z-10 mt-2">
          <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">
              {profile.name.slice(0, 1).toUpperCase()}
            </span>
          </div>
        </div>

        <h2 className="text-lg font-bold text-slate-900 mt-3">{profile.name}</h2>
        <span className="text-xs text-slate-500 font-medium">{profile.role}</span>
        
        <div className="mt-2.5 px-3 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full text-[11px] font-semibold uppercase tracking-wider">
          {profile.status}
        </div>
      </div>

      {/* Info Details List */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs flex flex-col gap-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider px-1">Informasi Karyawan</h3>
        {[
          ['mail', 'Email Perusahaan', profile.email],
          ['corporate_fare', 'Departemen', profile.department],
          ['calendar_month', 'Tanggal Bergabung', profile.joinDate],
        ].map(([icon, label, value]) => (
          <div key={label} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white text-primary flex items-center justify-center shadow-2xs border border-slate-200/60 shrink-0">
              <span className="material-symbols-outlined text-[18px]">{icon}</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</span>
              <span className="text-xs text-slate-800 font-semibold truncate">{value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2.5">
        <button 
          onClick={() => navigate('/change-password')} 
          className="w-full bg-white hover:bg-slate-50 active:scale-98 transition-all text-slate-700 py-3.5 px-4 rounded-2xl font-semibold text-xs flex items-center justify-between border border-slate-200/80 shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-[20px]">lock_reset</span>
            <span>Ubah Kata Sandi</span>
          </div>
          <span className="material-symbols-outlined text-slate-400 text-[18px]">chevron_right</span>
        </button>

        <button
          onClick={async () => {
            try { await api.post('/logout'); } catch {}
            logout();
            window.location.href = '/login';
          }}
          className="w-full bg-rose-50 hover:bg-rose-100/70 active:scale-98 transition-all text-rose-700 py-3.5 px-4 rounded-2xl font-semibold text-xs flex items-center justify-center gap-2 border border-rose-200/60"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span>Keluar dari Akun</span>
        </button>
      </div>
    </div>
  );
}

