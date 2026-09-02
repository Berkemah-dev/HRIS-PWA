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
    { label: "Cuti", icon: "event_busy", path: "/leaves" },
    { label: "Profil", icon: "person", path: "/profile" },
  ];

  return (
    <div className="bg-surface font-body-md text-on-surface flex flex-col min-h-screen">
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
        <div className="h-14 px-margin-mobile flex items-center justify-between gap-stack-md">
          <div className="flex items-center gap-2">
            <img src="/app-logo.png" alt="Logo" className="w-9 h-9 rounded-lg object-contain" />
          </div>
          <button
            type="button"
            onClick={() => navigate('/pilih-perusahaan')}
            className="px-3 py-1 bg-surface-container rounded-full flex items-center gap-1 min-h-[32px] max-w-[150px]"
          >
            <span className="text-label-sm text-on-surface-variant truncate">{selectedCompany?.name ?? 'Company'}</span>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span>
          </button>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => navigate('/notifikasi')}
              className="w-10 h-10 flex items-center justify-center text-on-surface-variant"
            >
              <span className="material-symbols-outlined">notifications</span>
            </button>
            {hasPermission(['leave.approve', 'reimbursement.approve', 'overtime.approve']) && (
              <button
                type="button"
                onClick={() => navigate('/persetujuan')}
                className="w-10 h-10 flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined">task_alt</span>
              </button>
            )}
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ml-1">
              <span className="text-on-primary text-label-sm font-bold">{user?.name?.slice(0, 1).toUpperCase() ?? 'U'}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative w-full pt-14 pb-24 bg-surface">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-50 bg-surface border-t border-outline-variant/20 pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors",
                  isActive ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                <div className={cn(
                  "w-14 h-8 rounded-full flex items-center justify-center transition-colors",
                  isActive ? "bg-primary-container" : "bg-transparent"
                )}>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                    {item.icon}
                  </span>
                </div>
                <span className={cn("text-[11px] font-medium tracking-wide", isActive ? "font-semibold" : "font-medium")}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
