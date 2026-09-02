import { useState, useEffect } from 'react';
import api from '../lib/api';
import { asArray, cn, formatDate, formatTime } from '../lib/format';

interface AttendanceRecord {
  id: number;
  date: string;
  location: string;
  status: 'hadir' | 'terlambat' | 'izin' | 'alpa';
  checkIn: string | null;
  checkOut: string | null;
  duration: string | null;
}

interface Summary {
  hadir: number;
  terlambat: number;
  izin: number;
  alpa: number;
}

export default function RiwayatPresensi() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<Summary>({ hadir: 0, terlambat: 0, izin: 0, alpa: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/attendance/history');
        const normalized = asArray<Record<string, unknown>>(response.data).map((record, index) => {
          const status = String(record.status ?? '').toLowerCase();
          return {
            id: Number(record.id ?? index),
            date: formatDate(record.date ?? record.attendance_date),
            location: String(record.location ?? record.location_name ?? 'Lokasi kerja'),
            status: status === 'late' || status === 'terlambat' ? 'terlambat' : status === 'absent' ? 'alpa' : status === 'leave' ? 'izin' : 'hadir',
            checkIn: formatTime(record.check_in),
            checkOut: formatTime(record.check_out),
            duration: String(record.duration ?? record.working_hours ?? '-'),
          } satisfies AttendanceRecord;
        });
        setRecords(normalized);
        setSummary(normalized.reduce<Summary>((acc, record) => {
          acc[record.status] += 1;
          return acc;
        }, { hadir: 0, terlambat: 0, izin: 0, alpa: 0 }));
      } catch {
        setRecords([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const renderStatusBadge = (status: string) => {
    switch(status) {
      case 'hadir':
        return (
          <div className="px-2 py-1 rounded-full bg-primary/10 text-primary text-label-sm font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">check</span> Hadir
          </div>
        );
      case 'terlambat':
        return (
          <div className="px-2 py-1 rounded-full bg-error/10 text-error text-label-sm font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">schedule</span> Terlambat
          </div>
        );
      case 'izin':
        return (
          <div className="px-2 py-1 rounded-full bg-tertiary/10 text-tertiary text-label-sm font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">medical_services</span> Izin
          </div>
        );
      default:
        return (
          <div className="px-2 py-1 rounded-full bg-error/10 text-error text-label-sm font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">cancel</span> Alpa
          </div>
        );
    }
  };

  return (
    <div className="w-full flex flex-col h-full overflow-y-auto">
      <div className="flex flex-col w-full gap-stack-lg p-margin-mobile">
        {/* Header Summary Section */}
        <section className="flex flex-col gap-stack-md">
          <h2 className="text-headline-md text-on-surface">Ringkasan Kehadiran</h2>
          <div className="grid grid-cols-2 gap-stack-sm">
            {/* Hadir */}
            <div className="bg-surface-container rounded-xl p-4 flex flex-col gap-1 items-start relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-primary/10 rounded-full transition-transform group-hover:scale-150"></div>
              <span className="material-symbols-outlined text-primary text-[28px] mb-1">check_circle</span>
              <span className="text-headline-lg text-on-surface-variant font-bold">{summary.hadir}</span>
              <span className="text-label-sm text-on-surface-variant">Hadir</span>
            </div>
            {/* Terlambat */}
            <div className="bg-surface-container rounded-xl p-4 flex flex-col gap-1 items-start relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-error/10 rounded-full transition-transform group-hover:scale-150"></div>
              <span className="material-symbols-outlined text-error text-[28px] mb-1">schedule</span>
              <span className="text-headline-lg text-on-surface-variant font-bold">{summary.terlambat}</span>
              <span className="text-label-sm text-on-surface-variant">Terlambat</span>
            </div>
            {/* Izin */}
            <div className="bg-surface-container rounded-xl p-4 flex flex-col gap-1 items-start relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-tertiary/10 rounded-full transition-transform group-hover:scale-150"></div>
              <span className="material-symbols-outlined text-tertiary text-[28px] mb-1">event_note</span>
              <span className="text-headline-lg text-on-surface-variant font-bold">{summary.izin}</span>
              <span className="text-label-sm text-on-surface-variant">Izin/Cuti</span>
            </div>
            {/* Alpa */}
            <div className="bg-surface-container rounded-xl p-4 flex flex-col gap-1 items-start relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-error/10 rounded-full transition-transform group-hover:scale-150"></div>
              <span className="material-symbols-outlined text-error text-[28px] mb-1">cancel</span>
              <span className="text-headline-lg text-on-surface-variant font-bold">{summary.alpa}</span>
              <span className="text-label-sm text-on-surface-variant">Alpa</span>
            </div>
          </div>
        </section>
        
        {/* Filter & Sort */}
        <section className="flex justify-between items-center bg-surface-container-low rounded-full px-4 py-2 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">calendar_month</span>
            <span className="text-label-md text-on-surface-variant font-semibold">Bulan Ini</span>
          </div>
          <button className="flex items-center gap-1 bg-surface-container h-8 px-3 rounded-full active:scale-95 transition-transform">
            <span className="text-label-sm text-on-surface-variant">Filter</span>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">tune</span>
          </button>
        </section>

        {/* History List */}
        <section className="flex flex-col gap-stack-lg">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <span className="material-symbols-outlined animate-spin text-primary">sync</span>
            </div>
          ) : records.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-on-surface-variant opacity-70">
              <span className="material-symbols-outlined text-[48px] mb-2">history</span>
              <p>Belum ada data presensi</p>
            </div>
          ) : (
            <div className="flex flex-col gap-stack-sm">
              {records.map(record => (
                <div key={record.id} className={cn(
                  "bg-surface-container-lowest rounded-xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden",
                  record.status === 'terlambat' ? 'border-l-4 border-error' : '',
                  record.status === 'izin' ? 'opacity-80' : ''
                )}>
                  <div className="flex justify-between items-start w-full pl-2">
                    <div className="flex flex-col">
                      <span className="text-body-md text-on-surface font-semibold">{record.date}</span>
                      <span className="text-label-sm text-on-surface-variant opacity-70">{record.location}</span>
                    </div>
                    {renderStatusBadge(record.status)}
                  </div>
                  
                  {record.status === 'izin' || record.status === 'alpa' ? (
                     <div className="flex gap-4 items-center bg-surface-container-low rounded-lg p-3 justify-center">
                       <span className="text-body-md text-on-surface-variant italic">Tidak ada catatan waktu</span>
                     </div>
                  ) : (
                    <div className="flex gap-4 items-center bg-surface-container-low rounded-lg p-3 ml-2">
                      <div className="flex flex-col flex-1 gap-1">
                        <span className={cn("text-label-sm flex items-center gap-1", record.status === 'terlambat' ? 'text-error' : 'text-on-surface-variant')}>
                          <span className="material-symbols-outlined text-[14px]">login</span> Masuk
                        </span>
                        <span className="text-headline-md text-on-surface">{record.checkIn || '--:--'}</span>
                      </div>
                      <div className="w-px h-8 bg-outline-variant opacity-30"></div>
                      <div className="flex flex-col flex-1 gap-1">
                        <span className="text-label-sm text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">logout</span> Pulang
                        </span>
                        <span className="text-headline-md text-on-surface">{record.checkOut || '--:--'}</span>
                      </div>
                      <div className="w-px h-8 bg-outline-variant opacity-30"></div>
                      <div className="flex flex-col flex-1 gap-1 items-end">
                        <span className="text-label-sm text-on-surface-variant">Durasi</span>
                        <span className="text-body-md text-on-surface font-semibold">{record.duration || '-'}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
