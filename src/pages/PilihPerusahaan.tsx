import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { asArray, unwrapData } from '../lib/format';
import { type CompanyScope, useAuthStore } from '../store/authStore';

export default function PilihPerusahaan() {
  const navigate = useNavigate();
  const { companies, selectedCompanyId, setCompanyContext } = useAuthStore();
  const [items, setItems] = useState<CompanyScope[]>(companies);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/company/context')
      .then((response) => {
        const context = unwrapData<Record<string, unknown>>(response.data, {});
        const apiCompanies = asArray<CompanyScope>(context.companies ?? context.available_companies ?? []);
        const canAll = Boolean(context.can_view_all ?? context.has_all_access);
        const next = canAll ? [{ id: 'all', name: 'HO / Semua', code: 'ALL' } as CompanyScope, ...apiCompanies] : apiCompanies;
        const active = context.active_company_id ?? context.selected_company_id ?? context.company_id ?? null;
        setItems(next);
        setCompanyContext(next, canAll ? 'all' : (Number(active) || (apiCompanies[0]?.id ?? null)));
      })
      .catch(() => setItems(companies));
  }, [companies, setCompanyContext]);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;
    const query = search.toLowerCase();
    return items.filter((c) => 
      c.name.toLowerCase().includes(query) || 
      (c.code && String(c.code).toLowerCase().includes(query))
    );
  }, [items, search]);

  const chooseCompany = (company: CompanyScope) => {
    setCompanyContext(items, company.id);
    navigate(-1);
  };

  return (
    <div className="relative">
      {/* Backdrop overlay */}
      <div 
        aria-hidden="true" 
        className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200" 
        onClick={() => navigate(-1)} 
      />

      {/* Centered PWA Bottom Sheet Modal */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] sm:max-w-[460px] z-50 bg-white rounded-t-3xl shadow-[0_-12px_40px_rgba(0,0,0,0.18)] border-t border-slate-100 flex flex-col max-h-[85dvh] animate-in slide-in-from-bottom duration-250">
        
        {/* Handle Bar */}
        <div className="w-full flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-slate-300 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="px-5 pt-2 pb-3 flex items-start justify-between border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Pilih Perusahaan</h2>
            <p className="text-[12px] text-slate-500 mt-0.5">Ganti konteks data & entitas perusahaan aktif</p>
          </div>
          <button 
            aria-label="Tutup" 
            onClick={() => navigate(-1)} 
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all flex items-center justify-center text-slate-500 -mr-1"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Search Bar if multiple items */}
        {items.length > 3 && (
          <div className="px-5 pt-3 pb-1">
            <div className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 focus-within:border-primary focus-within:bg-white transition-all">
              <span className="material-symbols-outlined text-[18px] text-slate-400">search</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama atau kode..."
                className="flex-1 bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600">
                  <span className="material-symbols-outlined text-[16px]">cancel</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Companies List */}
        <div className="px-5 py-3 pb-safe mb-4 flex flex-col gap-2.5 overflow-y-auto max-h-[60dvh]">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center flex flex-col items-center justify-center text-slate-400">
              <span className="material-symbols-outlined text-3xl mb-1 text-slate-300">search_off</span>
              <p className="text-xs">Perusahaan tidak ditemukan.</p>
            </div>
          ) : (
            filteredItems.map((company) => {
              const active = company.id === selectedCompanyId;
              const isAll = company.id === 'all';
              const initials = isAll ? 'ALL' : company.name.slice(0, 2).toUpperCase();

              return (
                <button
                  key={company.id}
                  onClick={() => chooseCompany(company)}
                  className={`w-full flex items-center gap-3.5 p-3 rounded-2xl text-left transition-all active:scale-[0.98] border ${
                    active 
                      ? 'bg-emerald-50/80 border-emerald-400/80 shadow-xs ring-1 ring-emerald-500/20' 
                      : 'bg-white hover:bg-slate-50 border-slate-200/80'
                  }`}
                >
                  {/* Company Avatar / Badge */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs shadow-2xs border ${
                    active 
                      ? 'bg-primary text-white border-primary' 
                      : isAll 
                        ? 'bg-gradient-to-tr from-slate-700 to-slate-900 text-white border-slate-700' 
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {isAll ? (
                      <span className="material-symbols-outlined text-[20px]">hub</span>
                    ) : (
                      initials
                    )}
                  </div>

                  {/* Company Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className={`text-xs font-bold truncate ${active ? 'text-slate-900' : 'text-slate-800'}`}>
                        {company.name}
                      </p>
                      {active && (
                        <span className="px-1.5 py-0.2 rounded-sm bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-wider">
                          Aktif
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] text-slate-400">corporate_fare</span>
                      <span>{company.code ? `Kode: ${company.code}` : (isAll ? 'Akses Konsolidasi' : `ID: ${company.id}`)}</span>
                    </p>
                  </div>

                  {/* Checkmark Status */}
                  <div className="shrink-0">
                    {active ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-slate-300 group-hover:border-slate-400" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}

