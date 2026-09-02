import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function DetailPresensi() {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col h-full overflow-y-auto bg-surface">
      <div className="flex flex-col w-full gap-stack-lg p-margin-mobile">
        
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-headline-lg font-bold text-on-surface">Log Detail Presensi</h2>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-col gap-4 shadow-sm">
          <div className="flex flex-col">
             <span className="text-label-md text-on-surface-variant uppercase tracking-wider">Senin, 23 Okt 2023</span>
             <span className="text-headline-lg font-bold text-on-surface">Hadir - Tepat Waktu</span>
          </div>

          <div className="flex flex-col gap-4 border-t border-outline-variant/30 pt-4 relative">
             <div className="absolute left-3 top-6 bottom-6 w-px bg-primary"></div>
             
             <div className="flex gap-4 relative z-10">
               <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center border-2 border-surface mt-1">
                 <span className="material-symbols-outlined text-on-primary text-[14px]">login</span>
               </div>
               <div className="flex flex-col">
                 <span className="text-body-lg text-on-surface font-bold">08:45</span>
                 <span className="text-label-sm text-on-surface-variant">Check In (Site Office - Jakarta)</span>
                 <span className="text-[10px] text-on-surface-variant font-mono mt-1">Lat: -6.2000, Lng: 106.8166</span>
               </div>
             </div>
             
             <div className="flex gap-4 relative z-10">
               <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center border-2 border-surface mt-1">
                 <span className="material-symbols-outlined text-on-primary text-[14px]">logout</span>
               </div>
               <div className="flex flex-col">
                 <span className="text-body-lg text-on-surface font-bold">17:15</span>
                 <span className="text-label-sm text-on-surface-variant">Check Out (Site Office - Jakarta)</span>
                 <span className="text-[10px] text-on-surface-variant font-mono mt-1">Lat: -6.2001, Lng: 106.8168</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
