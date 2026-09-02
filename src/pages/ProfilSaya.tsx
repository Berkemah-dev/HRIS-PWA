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

  if (isLoading) return <div className="p-8 flex justify-center"><span className="material-symbols-outlined animate-spin text-primary">sync</span></div>;
  if (!profile) return null;

  return (
    <div className="w-full flex flex-col h-full overflow-y-auto bg-surface">
      <div className="flex flex-col w-full gap-stack-lg p-margin-mobile">
        <div className="bg-surface-container rounded-2xl p-6 flex flex-col items-center shadow-sm relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-24 bg-primary/20" />
          <div className="w-24 h-24 rounded-full bg-surface-container-high border-4 border-surface flex items-center justify-center text-primary shadow-sm relative z-10">
            <span className="material-symbols-outlined text-[48px]">person</span>
          </div>
          <h2 className="text-headline-lg font-bold text-on-surface mt-4">{profile.name}</h2>
          <span className="text-label-md text-on-surface-variant">{profile.role}</span>
          <div className="mt-4 px-3 py-1 bg-primary-container text-on-primary-container rounded-full text-label-sm font-semibold">
            {profile.status}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {[
            ['email', 'Email', profile.email],
            ['corporate_fare', 'Department', profile.department],
            ['calendar_month', 'Tanggal Bergabung', profile.joinDate],
          ].map(([icon, label, value]) => (
            <div key={label} className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">{icon}</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-label-sm text-on-surface-variant">{label}</span>
                <span className="text-body-md text-on-surface font-semibold truncate">{value}</span>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => navigate('/change-password')} className="w-full bg-surface-container-high text-primary py-4 rounded-xl font-headline-md flex items-center justify-center gap-2 shadow-sm">
          <span className="material-symbols-outlined">lock_reset</span> Ganti Password
        </button>

        <button
          onClick={async () => {
            try { await api.post('/logout'); } catch {}
            logout();
            window.location.href = '/login';
          }}
          className="w-full mt-4 bg-error-container text-on-error-container py-4 rounded-xl font-headline-md flex items-center justify-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined">logout</span> Keluar
        </button>
      </div>
    </div>
  );
}
