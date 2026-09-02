import React, { useState, useEffect } from 'react';
import api from '../lib/api';

export default function ManajemenAset() {
  const [assets, setAssets] = useState([
    { id: 1, name: 'MacBook Pro M2', code: 'AST-LAP-001', assignedTo: 'John Doe', status: 'In Use' },
    { id: 2, name: 'Dell UltraSharp Monitor', code: 'AST-MON-042', assignedTo: 'Jane Smith', status: 'In Use' },
    { id: 3, name: 'Office Chair Ergonomic', code: 'AST-FUR-112', assignedTo: 'Unassigned', status: 'Available' }
  ]);

  return (
    <div className="w-full flex flex-col h-full overflow-y-auto">
      <div className="flex flex-col w-full gap-stack-md px-margin-mobile py-stack-md">
        
        <div className="flex justify-between items-center">
          <h2 className="text-headline-md text-on-surface">Manajemen Aset</h2>
          <button className="bg-primary text-on-primary w-8 h-8 rounded-full flex justify-center items-center">
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
        </div>

        <div className="bg-surface-container rounded-xl p-4 mt-2 shadow-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-on-surface-variant">search</span>
          <input type="text" placeholder="Cari nama aset atau kode..." className="bg-transparent outline-none flex-1 text-body-md text-on-surface" />
        </div>

        <div className="flex flex-col gap-3 mt-4">
          {assets.map(asset => (
            <div key={asset.id} className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-label-md font-bold text-on-surface">{asset.name}</span>
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${asset.status === 'Available' ? 'bg-tertiary/10 text-tertiary' : 'bg-primary-container text-on-primary-container'}`}>
                  {asset.status}
                </span>
              </div>
              <span className="text-label-sm text-on-surface-variant">{asset.code}</span>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-outline-variant/20">
                <span className="text-label-sm text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">person</span> {asset.assignedTo}
                </span>
                <button className="text-primary text-label-sm font-semibold">Details</button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
