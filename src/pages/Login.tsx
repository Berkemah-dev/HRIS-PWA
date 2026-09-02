import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import { asArray, unwrapData } from '../lib/format';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth, setUser, setAllowedMenuKeys, setCompanyContext } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!email.trim()) {
        throw new Error('Email wajib diisi.');
      }
      if (password.length < 6) {
        throw new Error('Password minimal 6 karakter.');
      }

      const response = await api.post('/login', { email, password });
      const loginPayload = unwrapData<Record<string, unknown>>(response.data, {});
      const token = String(loginPayload.token ?? loginPayload.access_token ?? '');
      const rawUser = loginPayload.user as Parameters<typeof setAuth>[1] | undefined;
      const user = rawUser ? {
        ...rawUser,
        effective_permissions: Array.isArray(loginPayload.effective_permissions) ? loginPayload.effective_permissions as string[] : rawUser.effective_permissions,
      } : undefined;

      if (!token || !user) {
        throw new Error('Response login tidak lengkap.');
      }

      setAuth(token, user);
      if (user.must_change_password) {
        navigate('/change-password', { replace: true });
        return;
      }

      const [meResult, menuResult, companyResult] = await Promise.allSettled([
        api.get('/me'),
        api.get('/user/menus'),
        api.get('/company/context'),
      ]);

      if (meResult.status === 'fulfilled') {
        setUser(unwrapData<Parameters<typeof setUser>[0]>(meResult.value.data, user));
      }

      if (menuResult.status === 'fulfilled') {
        setAllowedMenuKeys(asArray<string>(menuResult.value.data).map((item) => String(item)));
      }

      if (companyResult.status === 'fulfilled') {
        const context = unwrapData<Record<string, unknown>>(companyResult.value.data, {});
        const companies = asArray<Parameters<typeof setCompanyContext>[0][number]>(context.companies ?? context.available_companies ?? []);
        const active = context.active_company_id ?? context.selected_company_id ?? context.company_id ?? null;
        const canAll = Boolean(context.can_view_all ?? context.has_all_access);
        setCompanyContext(
          canAll ? [{ id: 'all', name: 'HO / Semua', code: 'ALL' }, ...companies] : companies,
          canAll ? 'all' : (Number(active) || (companies[0]?.id ?? null)),
        );
      }

      navigate('/beranda', { replace: true });
    } catch (err) {
      const response = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string; data?: unknown; errors?: unknown } } }).response
        : undefined;
      const errors = response?.data?.data ?? response?.data?.errors;
      const firstValidationMessage = errors && typeof errors === 'object'
        ? Object.values(errors as Record<string, unknown[]>).flat()[0]
        : undefined;
      const message = response?.data?.message;
      setError(message || (err instanceof Error ? err.message : 'Login gagal'));
      if (firstValidationMessage && typeof firstValidationMessage === 'string') {
        setError(firstValidationMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#f5faf9] font-body-md text-on-surface flex items-center justify-center px-4 py-4 sm:py-6">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-1/2 top-[-180px] h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[-120px] bottom-[-160px] h-[360px] w-[360px] rounded-full bg-tertiary-fixed-dim/20 blur-3xl" />
      </div>

      <main className="login-card relative z-10 w-full max-w-[430px] max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-[28px] border border-white/70 bg-white shadow-[0_24px_80px_rgba(0,80,73,0.16)]">
        <section className="login-hero relative bg-primary px-5 pb-7 pt-6 text-on-primary sm:px-6 sm:pb-8 sm:pt-7">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed-dim/20 via-transparent to-black/10" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <div className="login-logo mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
                <img src="/app-logo.png" alt="Logo" className="h-8 w-8 object-contain" />
              </div>
              <p className="text-label-sm uppercase tracking-wider opacity-80">Employee Self-Service</p>
              <h1 className="login-title mt-2 text-[28px] font-bold leading-8 tracking-normal">Masuk ke HRIS</h1>
              <p className="login-copy mt-3 max-w-[310px] text-body-md text-white/85">Akses presensi, cuti, payroll, dan layanan karyawan dalam satu portal mobile.</p>
            </div>
            <div className="mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full bg-white/15 text-white">
              <span className="material-symbols-outlined text-[21px]">shield_person</span>
            </div>
          </div>
        </section>

        <section className="login-form bg-white px-5 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
          <div className="login-welcome mb-5">
            <h2 className="text-headline-md font-bold text-on-surface">Selamat datang</h2>
            <p className="mt-1 text-body-md text-on-surface-variant">Gunakan akun perusahaan kamu.</p>
          </div>

          <div className="w-full">
            {error && (
              <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-xl text-label-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-label-sm text-on-surface-variant">Email</label>
                <div className="h-12 px-4 rounded-xl border border-outline-variant bg-[#fbfdfd] flex items-center gap-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                  <span className="material-symbols-outlined text-[20px] text-on-surface-variant">mail</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="flex-1 bg-transparent outline-none text-on-surface placeholder:text-on-surface-variant/60"
                    placeholder="user@company.com"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-label-sm text-on-surface-variant">Password</label>
                <div className="h-12 px-4 rounded-xl border border-outline-variant bg-[#fbfdfd] flex items-center gap-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                  <span className="material-symbols-outlined text-[20px] text-on-surface-variant">lock</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="flex-1 bg-transparent outline-none text-on-surface placeholder:text-on-surface-variant/60"
                    placeholder="Masukkan password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 mt-2 bg-primary text-on-primary rounded-xl font-label-md flex items-center justify-center gap-2 shadow-[0_10px_24px_rgba(0,106,97,0.22)] disabled:opacity-50"
              >
                {isLoading && <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>}
                {isLoading ? 'Memproses...' : 'Masuk'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-primary text-label-md font-semibold min-h-8"
              >
                Lupa password?
              </button>
            </form>
          </div>

          <div className="login-note mt-4 flex items-center justify-center gap-2 rounded-xl bg-primary/5 px-3 py-2.5 text-center text-label-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[17px] text-primary">verified_user</span>
            <span>Akun dan company scope mengikuti RBAC backend.</span>
          </div>
        </section>
      </main>
    </div>
  );
}
