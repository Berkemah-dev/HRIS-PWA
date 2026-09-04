import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import { asArray, unwrapData } from '../lib/format';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
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
    <div className="h-[100dvh] min-h-[100dvh] max-h-[100dvh] bg-slate-100 sm:bg-slate-200/70 flex justify-center selection:bg-primary/20 font-sans overflow-hidden">
      {/* PWA Phone Shell Container matching Home & Splash with Pure White Background */}
      <main className="w-full max-w-[440px] sm:max-w-[460px] h-full max-h-[100dvh] bg-white flex flex-col justify-between relative sm:shadow-[0_0_50px_rgba(0,0,0,0.12)] sm:border-x sm:border-slate-200 overflow-hidden">
        
        {/* Top Header & Greeting */}
        <div className="flex-none bg-white">
          {/* Top Header Bar with Logo */}
          <header className="pt-4 px-5 pb-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 text-[#006a61]">
                <svg viewBox="0 0 100 115" className="w-full h-full fill-[#006a61]" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M50 4 C76 16 93 24 93 28 C93 72 68 98 50 110 C32 98 7 72 7 28 C7 24 24 16 50 4 Z"
                    fill="none"
                    stroke="#006a61"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="50" cy="38" r="7" />
                  <path d="M41 52 C41 47 45 47 50 47 C55 47 59 47 59 52 L59 74 C59 76 57 78 55 78 L45 78 C43 78 41 76 41 74 Z" />
                  <circle cx="31" cy="44" r="5.5" />
                  <path d="M23 56 C23 52 27 52 31 52 C35 52 38 52 38 56 L38 72 L30 72 C28 72 23 70 23 66 Z" />
                  <circle cx="69" cy="44" r="5.5" />
                  <path d="M62 56 C62 52 65 52 69 52 C73 52 77 52 77 56 L77 66 C77 70 72 72 70 72 L62 72 Z" />
                </svg>
              </div>
              <span className="text-[20px] font-black tracking-wider text-[#005a52] uppercase font-sans">
                TIMLY
              </span>
            </div>
          </header>

          {/* Greeting & Headline Section */}
          <section className="px-5 pt-1.5 pb-0">
            <p className="text-[11px] font-bold text-[#006a61] flex items-center gap-1">
              <span>Selamat datang kembali!</span>
              <span className="text-xs">👋</span>
            </p>
            <h1 className="text-[21px] sm:text-[23px] font-black text-[#0c2338] tracking-tight leading-tight mt-0.5">
              Masuk ke TIMLY
            </h1>
            <p className="text-[11.5px] text-slate-500 leading-snug mt-0.5 max-w-[320px]">
              Akses presensi, cuti, payroll, dan layanan karyawan dalam satu portal.
            </p>
          </section>
        </div>

        {/* Hero Employee Illustration - large & prominent */}
        <div className="relative w-full flex justify-center items-center px-4 z-0 flex-1 min-h-[160px] max-h-[230px] my-auto bg-white overflow-visible">
          <img 
            src="/hero-login.png" 
            alt="Hero Illustration" 
            className="w-full max-w-[340px] h-auto max-h-[210px] object-contain pointer-events-none mix-blend-multiply drop-shadow-xs" 
          />
        </div>

        {/* Login Card Form Container */}
        <section className="relative z-10 mx-3.5 mb-3 bg-white rounded-[22px] sm:rounded-3xl p-4 sm:p-4.5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-slate-100 flex flex-col gap-2.5 flex-none">
          
          {error && (
            <div className="p-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-[11px] font-medium flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-red-500">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-2.5">
            
            {/* Email Field */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-800">Email Perusahaan</label>
              <div className="h-9 sm:h-10 px-3 rounded-xl border border-slate-200 bg-[#fbfdfd] flex items-center gap-2 focus-within:border-[#006a61] focus-within:ring-2 focus-within:ring-[#006a61]/15 transition-all">
                <span className="material-symbols-outlined text-[17px] text-slate-400">mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="flex-1 bg-transparent outline-none text-xs text-slate-800 placeholder:text-slate-400"
                  placeholder="nama@perusahaan.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-800">Password</label>
              <div className="h-9 sm:h-10 px-3 rounded-xl border border-slate-200 bg-[#fbfdfd] flex items-center gap-2 focus-within:border-[#006a61] focus-within:ring-2 focus-within:ring-[#006a61]/15 transition-all">
                <span className="material-symbols-outlined text-[17px] text-slate-400">lock</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="flex-1 bg-transparent outline-none text-xs text-slate-800 placeholder:text-slate-400 tracking-wider"
                  placeholder="••••••••••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  <span className="material-symbols-outlined text-[17px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-300 text-[#006a61] focus:ring-[#006a61] accent-[#006a61]"
                />
                <span className="text-[11px] text-slate-700 font-medium">Ingat saya</span>
              </label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-[11px] text-[#006a61] font-semibold hover:underline"
              >
                Lupa password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 mt-1 bg-[#005a52] hover:bg-[#004e47] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-[0_6px_16px_rgba(0,90,82,0.22)] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isLoading && <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>}
              {isLoading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

        </section>

      </main>
    </div>
  );
}


