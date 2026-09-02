import { useState, useEffect } from "react";

export default function DailyAttendance() {
  const [time, setTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    setCheckInTime(time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }));
    // Here we will call the API to submit check-in data
  };

  return (
    <div className="flex flex-col w-full gap-stack-md px-margin-mobile py-stack-md max-w-lg mx-auto">
      {/* Header: Date, Clock, Shift */}
      <div className="flex flex-col gap-stack-sm bg-surface-container rounded-xl p-stack-md shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-label-md text-on-surface-variant uppercase tracking-wider">
              {time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
            <h1 className="text-headline-xl text-on-surface font-bold mt-1">
              {time.toLocaleTimeString('en-US', { hour12: false })}
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-primary-container/20 px-3 py-1.5 rounded-full">
            <span className="material-symbols-outlined text-primary text-[20px]">schedule</span>
            <span className="text-label-sm text-primary font-semibold">Shift A (08:00 - 17:00)</span>
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
            <span className="text-label-md text-on-surface truncate">Site Office - Jakarta</span>
            <span className="text-label-sm text-on-surface-variant truncate">Jl. Jend. Sudirman No.Kav. 21</span>
          </div>
          <div className="ml-auto">
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase">In Range</span>
          </div>
        </div>
      </div>

      {/* Primary Action: Check In */}
      <div className="mt-2 flex flex-col gap-4">
        {isCheckedIn ? (
          <div className="flex flex-col items-center justify-center p-stack-lg bg-primary-container rounded-2xl border border-primary/20 shadow-sm transition-all duration-500 transform">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-3 shadow-md">
              <span className="material-symbols-outlined text-on-primary text-[32px]">check_circle</span>
            </div>
            <h2 className="text-headline-md text-on-primary-container font-bold">You're Checked In</h2>
            <p className="text-body-md text-on-primary-container/80 text-center mt-1">
              Checked in at <span className="font-semibold text-on-primary-container">{checkInTime}</span>
            </p>
          </div>
        ) : (
          <button 
            onClick={handleCheckIn}
            className="relative overflow-hidden w-full h-[72px] bg-primary text-on-primary rounded-2xl shadow-[0_8px_16px_rgba(0,106,97,0.2)] flex items-center justify-center gap-3 transition-all duration-300 active:scale-[0.98] active:shadow-sm group"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-active:translate-x-[100%] transition-transform duration-700"></div>
            <span className="material-symbols-outlined text-[28px]">fingerprint</span>
            <span className="text-headline-md font-bold tracking-wide">Slide to Check In</span>
            <div className="absolute left-2 w-14 h-[56px] bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-inner pointer-events-none group-active:translate-x-full transition-transform duration-300 ease-out">
              <span className="material-symbols-outlined text-white">chevron_right</span>
            </div>
          </button>
        )}
      </div>

      {/* Recent Activity / Stats */}
      <div className="mt-4 grid grid-cols-2 gap-stack-sm">
        <div className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant/30 flex flex-col gap-1 shadow-sm">
          <span className="text-label-sm text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">login</span> Check In
          </span>
          <span className="text-headline-md text-on-surface font-semibold">{checkInTime || "--:--"}</span>
        </div>
        <div className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant/30 flex flex-col gap-1 shadow-sm opacity-50">
          <span className="text-label-sm text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">logout</span> Check Out
          </span>
          <span className="text-headline-md text-on-surface font-semibold">--:--</span>
        </div>
      </div>
    </div>
  );
}
