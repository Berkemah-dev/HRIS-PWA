import React, { useState, useEffect } from 'react';

export default function StatusSistem() {
  const [status, setStatus] = useState('Checking...');
  const [services, setServices] = useState([
    { name: 'API Server', status: 'Operational', color: 'bg-primary' },
    { name: 'Database', status: 'Operational', color: 'bg-primary' },
    { name: 'Payroll Engine', status: 'Degraded', color: 'bg-error' },
  ]);

  useEffect(() => {
    setTimeout(() => {
      setStatus('All Systems Operational (Partially)');
    }, 1000);
  }, []);

  return (
    <div className="w-full flex flex-col h-full overflow-y-auto bg-surface">
      <div className="flex flex-col w-full gap-stack-md px-margin-mobile py-stack-md">
        <h2 className="text-headline-md text-on-surface mb-2">Status Sistem</h2>

        <div className="bg-surface-container rounded-xl p-6 flex flex-col items-center justify-center shadow-sm">
          <span className="material-symbols-outlined text-[48px] text-primary mb-2">cloud_done</span>
          <span className="text-body-lg font-bold text-on-surface">{status}</span>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <h3 className="text-label-md font-bold text-on-surface-variant">Layanan Utama</h3>
          {services.map((svc, idx) => (
            <div key={idx} className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex items-center justify-between border border-outline-variant/30">
              <span className="text-body-md font-semibold text-on-surface">{svc.name}</span>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${svc.color}`}></div>
                <span className="text-label-sm text-on-surface-variant">{svc.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
