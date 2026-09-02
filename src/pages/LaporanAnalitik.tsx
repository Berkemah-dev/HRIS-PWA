import React, { useState, useEffect } from 'react';
import api from '../lib/api';

export default function LaporanAnalitik() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        // Mock API: api.get('/reports/dashboard-summary')
        setData({
          attendanceScore: '94.8%',
          attendanceTrend: '+1.2%',
          reports: [
            { id: 1, title: 'Laporan Presensi', desc: 'Kehadiran & Keterlambatan', icon: 'fingerprint', color: 'text-on-primary-container', bg: 'bg-primary-container' },
            { id: 2, title: 'Laporan Cuti', desc: 'Sisa Kuota & Riwayat', icon: 'calendar_today', color: 'text-on-tertiary-container', bg: 'bg-tertiary-container' },
            { id: 3, title: 'Laporan Gaji', desc: 'Distribusi Payroll', icon: 'payments', color: 'text-on-secondary-container', bg: 'bg-secondary-container' },
            { id: 4, title: 'Kinerja KPI', desc: 'Pencapaian Target', icon: 'trending_up', color: 'text-primary', bg: 'bg-primary/10' }
          ]
        });
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="w-full flex flex-col h-full overflow-y-auto">
      <div className="flex flex-col w-full relative">
        <div className="px-margin-mobile pb-stack-lg pt-stack-md flex flex-col gap-stack-sm">
          <h1 className="text-headline-xl text-on-surface">Laporan & Analitik</h1>
          <p className="text-body-md text-on-surface-variant">Ringkasan dan detail data perusahaan.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8"><span className="material-symbols-outlined animate-spin text-primary">sync</span></div>
        ) : data ? (
          <>
            <div className="px-margin-mobile pb-stack-lg">
              <div className="bg-primary text-on-primary rounded-xl p-stack-md flex flex-col gap-stack-sm relative overflow-hidden shadow-md">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-container/30 rounded-full blur-xl"></div>
                <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-primary-fixed-dim/20 rounded-full blur-lg"></div>
                
                <div className="relative z-10 flex justify-between items-center">
                  <span className="text-label-md opacity-90">Kehadiran Bulan Ini</span>
                  <span className="material-symbols-outlined text-[20px]">trending_up</span>
                </div>
                <div className="relative z-10 flex items-baseline gap-2">
                  <span className="text-headline-xl font-bold">{data.attendanceScore}</span>
                  <span className="text-label-sm opacity-80">{data.attendanceTrend} dari bulan lalu</span>
                </div>
              </div>
            </div>

            <div className="px-margin-mobile pb-stack-lg">
              <div className="grid grid-cols-2 gap-stack-md">
                {data.reports.map((report: any) => (
                  <button key={report.id} className="bg-surface-container rounded-xl p-stack-md flex flex-col gap-stack-md text-left transition-transform active:scale-95 hover:bg-surface-container-highest shadow-sm">
                    <div className={`w-10 h-10 rounded-full ${report.bg} flex items-center justify-center ${report.color}`}>
                      <span className="material-symbols-outlined">{report.icon}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-label-md text-on-surface font-semibold">{report.title}</span>
                      <span className="text-label-sm text-on-surface-variant">{report.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
