import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function DetailPersetujuanCuti() {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col h-full overflow-y-auto">
      <div className="flex flex-col w-full gap-stack-md px-margin-mobile py-4">
        
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-headline-lg font-bold text-on-surface">Leave Details</h2>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-[12px] p-4 flex flex-col gap-4 shadow-sm mt-2">
          <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4">
            <div className="w-12 h-12 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container font-headline-lg">
              JS
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-label-lg text-on-surface">John Smith</span>
              <span className="text-body-md text-on-surface-variant">Senior Developer</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <div>
              <span className="text-label-sm text-on-surface-variant block mb-1">Leave Type</span>
              <span className="text-body-lg text-on-surface font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-tertiary">flight_takeoff</span> Annual Leave
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-label-sm text-on-surface-variant block mb-1">From</span>
                <span className="text-body-md text-on-surface font-medium">Oct 24, 2023</span>
              </div>
              <div>
                <span className="text-label-sm text-on-surface-variant block mb-1">To</span>
                <span className="text-body-md text-on-surface font-medium">Oct 26, 2023</span>
              </div>
            </div>
            <div>
              <span className="text-label-sm text-on-surface-variant block mb-1">Reason</span>
              <p className="text-body-md text-on-surface bg-surface-container p-3 rounded-lg">Family vacation to Bali. Handover document is already sent to the team.</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button onClick={() => navigate(-1)} className="flex-1 h-12 rounded-xl border border-error text-error font-headline-md flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[20px]">close</span> Reject
          </button>
          <button onClick={() => navigate(-1)} className="flex-1 h-12 rounded-xl bg-primary text-on-primary font-headline-md flex items-center justify-center gap-2 shadow-md">
            <span className="material-symbols-outlined text-[20px]">check</span> Approve
          </button>
        </div>

      </div>
    </div>
  );
}
