import React, { useState } from 'react';

export default function ProsesPayrollPeriodik() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const startProcessing = () => {
    setIsProcessing(true);
    let curr = 0;
    const interval = setInterval(() => {
      curr += 5;
      setProgress(curr);
      if (curr >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          alert('Payroll Processing Completed!');
          setIsProcessing(false);
          setProgress(0);
        }, 500);
      }
    }, 100);
  };

  return (
    <div className="w-full flex flex-col h-full overflow-y-auto bg-surface items-center justify-center">
      <div className="flex flex-col w-full max-w-sm gap-stack-md px-margin-mobile py-stack-md text-center">
        
        <span className="material-symbols-outlined text-[64px] text-primary mb-2">calculate</span>
        <h2 className="text-headline-md text-on-surface">Proses Payroll Engine</h2>
        <p className="text-body-md text-on-surface-variant mb-6">Jalankan kalkulasi gaji otomatis untuk seluruh karyawan aktif periode ini.</p>

        {isProcessing ? (
          <div className="flex flex-col gap-2 w-full">
            <span className="text-label-md font-semibold text-primary">Memproses data absen dan pajak... {progress}%</span>
            <div className="w-full bg-surface-variant rounded-full h-3 overflow-hidden">
              <div className="bg-primary h-full rounded-full transition-all duration-200" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        ) : (
          <button 
            onClick={startProcessing}
            className="w-full h-14 bg-primary text-on-primary rounded-xl font-headline-md flex items-center justify-center shadow-md shadow-primary/30"
          >
            Mulai Kalkulasi Payroll
          </button>
        )}
      </div>
    </div>
  );
}
