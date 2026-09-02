import { useState, useEffect } from 'react';
import api from '../lib/api';
import { formatTime, unwrapData } from '../lib/format';

type TodayAttendance = {
  check_in?: string | null;
  check_out?: string | null;
  status?: string;
  location?: string;
  work_schedule?: { name?: string; check_in_time?: string; check_out_time?: string };
};

export default function PresensiHarian() {
  const [time, setTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const [todayAttendance, setTodayAttendance] = useState<TodayAttendance>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchStatus = async () => {
      try {
        const response = await api.get('/attendance/today');
        if (!mounted) return;
        const attendance = unwrapData<TodayAttendance>(response.data, {});
        setTodayAttendance(attendance);
        setIsCheckedIn(Boolean(attendance.check_in && !attendance.check_out));
        setCheckInTime(attendance.check_in ?? null);
        setCheckOutTime(attendance.check_out ?? null);
      } catch {
        if (mounted) setTodayAttendance({});
      }
    };
    fetchStatus();
    return () => {
      mounted = false;
    };
  }, []);

  const readPosition = () => new Promise<GeolocationPosition | null>((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, () => resolve(null), {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 60000,
    });
  });

  const handleAttendanceAction = async (action: 'check-in' | 'check-out') => {
    setIsLoading(true);
    setError('');
    try {
      const position = await readPosition();
      const response = await api.post(`/attendance/${action}`, {
        latitude: position?.coords.latitude,
        longitude: position?.coords.longitude,
        location_type: 'office'
      });
      const attendance = unwrapData<TodayAttendance>(response.data, {});
      setTodayAttendance(attendance);
      setIsCheckedIn(action === 'check-in');
      setCheckInTime(attendance.check_in ?? checkInTime ?? time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
      setCheckOutTime(action === 'check-out' ? (attendance.check_out ?? time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })) : attendance.check_out ?? null);
    } catch (err) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      setError(message || 'Presensi gagal. Pastikan lokasi dan jadwal kerja sudah sesuai.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full gap-stack-md px-margin-mobile py-stack-md max-w-lg mx-auto overflow-y-auto">
      {/* Header: Date, Clock, Shift */}
      <div className="flex flex-col gap-stack-sm bg-surface-container rounded-xl p-stack-md shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-label-md text-on-surface-variant uppercase tracking-wider">
              {time.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
            <h1 className="text-headline-xl text-on-surface font-bold mt-1">
              {time.toLocaleTimeString('en-US', { hour12: false })}
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-primary-container/20 px-3 py-1.5 rounded-full">
            <span className="material-symbols-outlined text-primary text-[20px]">schedule</span>
            <span className="text-label-sm text-primary font-semibold">
              {todayAttendance.work_schedule?.name ?? 'Shift'} ({formatTime(todayAttendance.work_schedule?.check_in_time ?? '08:00')} - {formatTime(todayAttendance.work_schedule?.check_out_time ?? '17:00')})
            </span>
          </div>
        </div>
      </div>

      {/* Location Indicator & Map */}
      <div className="flex flex-col rounded-xl overflow-hidden shadow-sm border border-outline-variant/30 bg-surface">
        <div className="relative w-full h-32 bg-surface-container-high overflow-hidden group">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105" 
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAOs1WBhnlxxEcKGJ2GuT7T6BP-XaySIM4eh9O-W_YVlD_vZmBAg4eawkSBUB2iIgF1RW0XLIFozkeaM4Dzj-NOL8rgcglmMtJ5oCwRAsPuIlCuZPruvp6HzY7Bux1fXGsk39I9nM4Um1CRMwZyUxWSPV_DyGM_-5Rj8W07tRxvn15tu2GOVm6WtrswvFAm1kJGkwg51dQTXyuDEuBeRg_DHGjOXmIYlTbsfKWMVV1zazuXPTMvjR-Q')" }}
          ></div>
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface to-transparent"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="absolute w-8 h-8 bg-primary/20 rounded-full animate-ping"></div>
            <div className="relative w-4 h-4 bg-primary rounded-full border-2 border-surface shadow-sm"></div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-stack-sm px-stack-md bg-surface border-t border-outline-variant/20">
          <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">location_on</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-label-md text-on-surface truncate">{todayAttendance.location ?? 'Lokasi kerja'}</span>
            <span className="text-label-sm text-on-surface-variant truncate">Validasi mengikuti lokasi aktif di backend</span>
          </div>
          <div className="ml-auto">
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase">In Range</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-error-container text-on-error-container rounded-lg text-label-sm">
          {error}
        </div>
      )}

      {/* Primary Action: Check In */}
      <div className="mt-2 flex flex-col gap-4">
        {isCheckedIn ? (
          <div className="flex flex-col items-center justify-center p-stack-lg bg-primary-container rounded-2xl border border-primary/20 shadow-sm transition-all duration-500 transform">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-3 shadow-md">
              <span className="material-symbols-outlined text-on-primary text-[32px]">check_circle</span>
            </div>
            <h2 className="text-headline-md text-on-primary-container font-bold">Sudah Check In</h2>
            <p className="text-body-md text-on-primary-container/80 text-center mt-1">
              Masuk pukul <span className="font-semibold text-on-primary-container">{formatTime(checkInTime)}</span>
            </p>
            <button
              type="button"
              onClick={() => handleAttendanceAction('check-out')}
              disabled={isLoading}
              className="mt-4 h-12 px-5 rounded-xl bg-primary text-on-primary font-semibold disabled:opacity-60"
            >
              {isLoading ? 'Memproses...' : 'Check Out'}
            </button>
          </div>
        ) : checkOutTime ? (
          <div className="flex flex-col items-center justify-center p-stack-lg bg-surface-container rounded-2xl border border-outline-variant/30 shadow-sm">
            <span className="material-symbols-outlined text-primary text-[42px]">verified</span>
            <h2 className="text-headline-md text-on-surface font-bold mt-2">Presensi Selesai</h2>
            <p className="text-body-md text-on-surface-variant">Pulang pukul {formatTime(checkOutTime)}</p>
          </div>
        ) : (
          <button 
            onClick={() => handleAttendanceAction('check-in')}
            disabled={isLoading}
            className="relative overflow-hidden w-full h-[72px] bg-primary text-on-primary rounded-2xl shadow-[0_8px_16px_rgba(0,106,97,0.2)] flex items-center justify-center gap-3 transition-all duration-300 active:scale-[0.98] active:shadow-sm group disabled:opacity-70"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-active:translate-x-[100%] transition-transform duration-700"></div>
            <span className="material-symbols-outlined text-[28px]">fingerprint</span>
            <span className="text-headline-md font-bold tracking-wide">
              {isLoading ? 'Memproses...' : 'Check In Sekarang'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
