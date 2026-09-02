import { useState, useEffect } from 'react';
import api from '../lib/api';
import { asArray, unwrapData } from '../lib/format';

interface KpiData {
  score: number;
  label: string;
  trend: string;
  details: {
    title: string;
    score: number;
    real: string;
    target: string;
    icon: string;
    color: string;
  }[];
}

export default function KpiSaya() {
  const [kpi, setKpi] = useState<KpiData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchKpi = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/my/kpi');
        const payload = unwrapData<Record<string, unknown>>(response.data, {});
        const details = asArray<Record<string, unknown>>(payload.items ?? payload.details ?? response.data);
        setKpi({
          score: Number(payload.score ?? payload.final_score ?? payload.average_score ?? 0),
          label: String(payload.label ?? payload.status ?? 'Belum dinilai'),
          trend: String(payload.trend ?? 'Data mengikuti KPI aktif'),
          details: details.map((detail) => ({
            title: String(detail.title ?? detail.name ?? detail.indicator ?? 'KPI'),
            score: Number(detail.score ?? detail.progress ?? detail.achievement ?? 0),
            real: String(detail.realization ?? detail.real ?? detail.current_value ?? '-'),
            target: String(detail.target ?? detail.target_value ?? '-'),
            icon: 'query_stats',
            color: 'bg-primary',
          })),
        });
      } catch {
        setKpi({ score: 0, label: 'Belum ada KPI', trend: 'Hubungi atasan jika KPI belum dibuat', details: [] });
      } finally {
        setIsLoading(false);
      }
    };
    fetchKpi();
  }, []);

  if (isLoading) return <div className="p-8 flex justify-center"><span className="material-symbols-outlined animate-spin text-primary">sync</span></div>;
  if (!kpi) return null;

  return (
    <div className="w-full flex flex-col h-full overflow-y-auto">
      <div className="flex flex-col w-full gap-stack-md px-margin-mobile py-stack-md bg-surface">
        
        <div className="bg-surface-container rounded-xl p-stack-md flex flex-col items-center justify-center shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50"></div>
          <span className="text-label-sm text-on-surface-variant font-label-sm mb-1 uppercase tracking-wider">Skor Performa</span>
          
          <div className="w-32 h-32 rounded-full border-4 border-primary/20 flex flex-col items-center justify-center relative mt-2">
            <span className="text-headline-xl text-primary font-headline-xl">{kpi.score}%</span>
            <span className="text-label-sm text-on-surface-variant font-label-sm mt-1">{kpi.label}</span>
          </div>
          
          <div className="mt-4 flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-[18px]">trending_up</span>
            <span className="text-label-sm font-label-sm">{kpi.trend}</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-stack-sm mt-2">
          <h3 className="text-headline-md text-on-surface font-headline-md px-1">Detail KPI</h3>
          
          {kpi.details.length === 0 && (
            <div className="p-6 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-center text-on-surface-variant">
              Belum ada detail KPI.
            </div>
          )}
          {kpi.details.map((detail, idx) => (
            <div key={idx} className="bg-surface-container-lowest rounded-xl p-stack-md border border-outline-variant shadow-sm flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]">{detail.icon}</span>
                  </div>
                  <span className="text-body-md text-on-surface font-body-md font-semibold">{detail.title}</span>
                </div>
                <span className="text-label-md text-primary font-label-md">{detail.score}%</span>
              </div>
              <div className="w-full bg-surface-variant rounded-full h-2 overflow-hidden">
                <div className={`${detail.color} h-full rounded-full`} style={{ width: `${detail.score}%` }}></div>
              </div>
              <div className="flex justify-between text-label-sm text-on-surface-variant font-label-sm">
                <span>Real: {detail.real}</span>
                <span>Target: {detail.target}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
