import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function DetailKaryawan() {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col h-full overflow-y-auto bg-surface">
      <div className="flex flex-col w-full gap-stack-lg p-margin-mobile">
        
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-headline-lg font-bold text-on-surface">Detail Karyawan</h2>
        </div>

        <div className="bg-surface-container rounded-2xl p-6 flex flex-col items-center shadow-sm relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-24 bg-primary/20"></div>
          <div className="w-24 h-24 rounded-full bg-surface-container-high border-4 border-surface flex items-center justify-center text-primary shadow-sm relative z-10">
            <span className="material-symbols-outlined text-[48px]">person</span>
          </div>
          <h2 className="text-headline-lg font-bold text-on-surface mt-4">Siti Aminah</h2>
          <span className="text-label-md text-on-surface-variant">HR Staff</span>
          <div className="mt-4 px-3 py-1 bg-primary-container text-on-primary-container rounded-full text-label-sm font-semibold">Active</div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-label-sm text-on-surface-variant">Email Address</span>
              <span className="text-body-md text-on-surface font-semibold">siti.aminah@company.com</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-label-sm text-on-surface-variant">Department</span>
              <span className="text-body-md text-on-surface font-semibold">Human Resources</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-label-sm text-on-surface-variant">ID Karyawan</span>
              <span className="text-body-md text-on-surface font-semibold">EMP-2021-002</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
