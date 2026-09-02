import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { cn } from "../lib/format";
import { useAuthStore } from "../store/authStore";

export default function MobileLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const companies = useAuthStore((state) => state.companies);
  const selectedCompanyId = useAuthStore((state) => state.selectedCompanyId);
  const hasPermission = useAuthStore((state) => state.hasPermission);

  const selectedCompany = selectedCompanyId === 'all'
    ? { name: 'HO / Semua', code: 'ALL' }
    : companies.find((company) => company.id === selectedCompanyId);

  const navItems = [
    { label: "Beranda", icon: "home", path: "/beranda" },
    { label: "Presensi", icon: "fingerprint", path: "/presensi-harian" },
    { label: "Cuti", icon: "event_busy", path: "/cuti" },
    { label: "Profil", icon: "person", path: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 sm:bg-slate-200/70 flex justify-center selection:bg-primary/20">
      {/* PWA Phone Frame */}
      <div className="w-full max-w-[440px] sm:max-w-[460px] min-h-screen bg-surface flex flex-col relative sm:shadow-[0_0_50px_rgba(0,0,0,0.12)] sm:border-x sm:border-slate-200">
        
        {/* Top App Bar */}
        <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/20 pt-safe">
          <div className="h-14 px-4 flex items-center justify-between gap-2">
            <div 
              className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform" 
              onClick={() => navigate('/beranda')}
            >
              <img src="/app-logo.png" alt="Logo" className="w-8 h-8 rounded-lg object-contain shadow-xs" />
              <span className="font-bold text-[15px] tracking-tight text-on-surface">Timly</span>
            </div>

            <button
              type="button"
              onClick={() => navigate('/pilih-perusahaan')}
              className="px-2.5 py-1 bg-surface-container/70 hover:bg-surface-container active:scale-95 transition-all rounded-full flex items-center gap-1.5 min-h-[30px] max-w-[140px] border border-outline-variant/30"
              title="Ganti Perusahaan"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              <span className="text-[11px] font-semibold text-on-surface-variant truncate">
                {selectedCompany?.name ?? 'Perusahaan'}
              </span>
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant shrink-0">expand_more</span>
            </button>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => navigate('/notifikasi')}
                className="w-9 h-9 rounded-full hover:bg-surface-container active:scale-95 transition-all flex items-center justify-center text-on-surface-variant relative"
                aria-label="Notifikasi"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-surface"></span>
              </button>

              {hasPermission(['leave.approve', 'reimbursement.approve', 'overtime.approve']) && (
                <button
                  type="button"
                  onClick={() => navigate('/persetujuan')}
                  className="w-9 h-9 rounded-full hover:bg-surface-container active:scale-95 transition-all flex items-center justify-center text-on-surface-variant"
                  aria-label="Persetujuan"
                >
                  <span className="material-symbols-outlined text-[20px]">task_alt</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center text-on-primary text-xs font-bold shadow-xs hover:ring-2 hover:ring-primary/30 transition-all ml-0.5 active:scale-95"
              >
                {user?.name?.slice(0, 1).toUpperCase() ?? 'U'}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Viewport */}
        <main className="flex-1 flex flex-col relative w-full pb-20 bg-surface">
          <Outlet />
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] sm:max-w-[460px] z-40 bg-surface/95 backdrop-blur-xl border-t border-outline-variant/25 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-around h-16 px-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== "/" && item.path !== "/beranda" && location.pathname.startsWith(item.path));
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex flex-col items-center justify-center flex-1 h-full py-1 transition-all active:scale-95",
                    isActive ? "text-primary" : "text-on-surface-variant/70 hover:text-on-surface"
                  )}
                >
                  <div className={cn(
                    "w-12 h-7 rounded-full flex items-center justify-center transition-all duration-200",
                    isActive ? "bg-primary/15 text-primary" : "bg-transparent"
                  )}>
                    <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                      {item.icon}
                    </span>
                  </div>
                  <span className={cn(
                    "text-[11px] tracking-tight mt-0.5 transition-all",
                    isActive ? "font-bold text-primary" : "font-medium"
                  )}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
