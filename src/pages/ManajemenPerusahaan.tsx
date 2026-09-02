import React, { useState } from 'react';

export default function ManajemenPerusahaan() {
  const [config, setConfig] = useState({
    companyName: 'Stitch OmniHR Enterprise',
    workDays: 5,
    timezone: 'Asia/Jakarta',
  });

  return (
    <div className="w-full flex flex-col h-full overflow-y-auto bg-surface">
      <div className="flex flex-col w-full gap-stack-md px-margin-mobile py-stack-md">
        
        <h2 className="text-headline-md text-on-surface">Manajemen Perusahaan</h2>
        <p className="text-body-md text-on-surface-variant mb-4">Pengaturan Global Sistem HR.</p>

        <div className="flex flex-col gap-4 bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30">
          <div className="flex flex-col gap-1">
            <label className="text-label-sm font-semibold text-on-surface">Nama Perusahaan</label>
            <input 
              type="text" 
              value={config.companyName}
              onChange={e => setConfig({...config, companyName: e.target.value})}
              className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-label-sm font-semibold text-on-surface">Zona Waktu Default</label>
            <select 
              value={config.timezone}
              onChange={e => setConfig({...config, timezone: e.target.value})}
              className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary outline-none"
            >
              <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
              <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
            </select>
          </div>
          
          <button className="w-full mt-2 bg-primary text-on-primary py-3 rounded-lg font-label-md shadow-sm">
            Simpan Pengaturan
          </button>
        </div>
      </div>
    </div>
  );
}
