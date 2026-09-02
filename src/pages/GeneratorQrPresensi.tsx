import React, { useState, useEffect } from 'react';

export default function GeneratorQrPresensi() {
  const [qrCode, setQrCode] = useState('Generating...');
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    // Simulate QR generation
    setQrCode('https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=OMNIHR-ATTENDANCE-DEMO-123');
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Regenerate
          setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=OMNIHR-ATTENDANCE-${Math.random()}`);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full flex flex-col h-full overflow-y-auto bg-surface items-center justify-center">
      <div className="flex flex-col w-full max-w-sm gap-stack-md px-margin-mobile py-stack-md items-center">
        
        <h2 className="text-headline-md text-on-surface">QR Presensi Cepat</h2>
        <p className="text-body-md text-on-surface-variant text-center mb-4">Tunjukkan kode QR ini ke mesin pemindai di pintu masuk kantor.</p>

        <div className="bg-white p-4 rounded-2xl shadow-lg border-4 border-primary/20 relative">
          <img src={qrCode} alt="QR Code" className="w-64 h-64 object-contain" />
          <div className="absolute top-2 right-2 bg-primary text-on-primary w-8 h-8 rounded-full flex items-center justify-center font-bold text-label-sm shadow-md">
            {timeLeft}
          </div>
        </div>
        
        <p className="text-label-sm text-error mt-4 font-semibold text-center">Kode QR ini bersifat rahasia dan akan berganti otomatis setiap 30 detik untuk keamanan.</p>

      </div>
    </div>
  );
}
