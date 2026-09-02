import React, { useState } from 'react';

export default function ReviewKpiKaryawan() {
  const [reviews, setReviews] = useState([
    { id: 1, name: 'Andi Saputra', role: 'Sales Executive', score: 85, status: 'Draft' },
    { id: 2, name: 'Siti Aminah', role: 'HR Staff', score: 92, status: 'Submitted' },
  ]);

  return (
    <div className="w-full flex flex-col h-full overflow-y-auto bg-surface">
      <div className="flex flex-col w-full gap-stack-md px-margin-mobile py-stack-md">
        
        <h2 className="text-headline-md text-on-surface">Review KPI Karyawan</h2>
        <p className="text-body-md text-on-surface-variant mb-2">Penilaian performa tim Anda.</p>

        <div className="flex flex-col gap-4">
          {reviews.map(review => (
            <div key={review.id} className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-label-md font-bold text-on-surface">{review.name}</span>
                  <span className="text-body-md text-on-surface-variant">{review.role}</span>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${review.status === 'Submitted' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-variant text-on-surface-variant'}`}>
                  {review.status}
                </span>
              </div>
              
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <span className="text-label-sm text-on-surface-variant">Skor Terakhir:</span>
                  <span className="text-headline-md font-bold text-primary">{review.score}</span>
                </div>
                <button className="text-primary text-label-sm font-semibold">Review</button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
