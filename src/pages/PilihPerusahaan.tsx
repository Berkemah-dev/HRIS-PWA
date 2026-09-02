import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { asArray, unwrapData } from '../lib/format';
import { type CompanyScope, useAuthStore } from '../store/authStore';

export default function PilihPerusahaan() {
  const navigate = useNavigate();
  const { companies, selectedCompanyId, setCompanyContext } = useAuthStore();
  const [items, setItems] = useState<CompanyScope[]>(companies);

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

  const chooseCompany = (company: CompanyScope) => {
    setCompanyContext(items, company.id);
    navigate(-1);
  };

  return (
    <div className="w-full flex flex-col h-full overflow-y-auto">
      <div aria-hidden="true" className="fixed inset-0 z-40 bg-surface-variant/40 backdrop-blur-sm" onClick={() => navigate(-1)} />
      <div className="fixed bottom-0 inset-x-0 z-50 bg-surface rounded-t-xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
        <div className="w-full flex justify-center pt-stack-sm pb-2">
          <div className="w-12 h-1.5 bg-outline-variant rounded-full" />
        </div>
        <div className="px-gutter pb-stack-md flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md text-on-surface">Pilih Perusahaan</h2>
          <button aria-label="Close" onClick={() => navigate(-1)} className="w-touch-target-min h-touch-target-min flex items-center justify-center text-on-surface-variant rounded-full">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <div className="px-gutter pb-safe mb-stack-lg flex flex-col gap-2 overflow-y-auto max-h-[70dvh]">
          {items.length === 0 && (
            <div className="p-4 text-center text-on-surface-variant">Belum ada akses company.</div>
          )}
          {items.map((company) => {
            const active = company.id === selectedCompanyId;
            const initials = company.id === 'all' ? 'HO' : company.name.slice(0, 2).toUpperCase();
            return (
              <button
                key={company.id}
                onClick={() => chooseCompany(company)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${active ? 'bg-primary-container text-on-primary-container' : 'hover:bg-surface-container-low'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-label-md ${active ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface'}`}>{initials}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-label-md text-label-md truncate font-semibold">{company.name}</p>
                  <p className="font-body-md text-[13px] opacity-80 truncate">{company.code ?? company.id}</p>
                </div>
                {active && <span className="material-symbols-outlined text-[24px] text-primary">check_circle</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
