import React, { useState } from 'react';

export default function ManajemenPayroll() {
  const [stats] = useState({
    totalDisbursed: 'Rp 450.5M',
    employees: 124,
    status: 'Ready to Process'
  });

  return (
    <div className="w-full flex flex-col h-full overflow-y-auto bg-surface">
      <div className="flex flex-col w-full gap-stack-md px-margin-mobile py-stack-md">
        
        <h2 className="text-headline-md text-on-surface">Payroll Admin</h2>
        <p className="text-body-md text-on-surface-variant mb-2">Manage monthly disbursements.</p>

        <div className="bg-primary-container text-on-primary-container rounded-2xl p-6 shadow-md relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
          <span className="text-label-md opacity-90 block mb-1">Total Disbursed (Last Month)</span>
          <span className="text-headline-xl font-bold">{stats.totalDisbursed}</span>
          
          <div className="flex justify-between items-end mt-6">
            <div className="flex flex-col">
              <span className="text-label-sm opacity-80">Employees</span>
              <span className="text-label-lg font-bold">{stats.employees}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-label-sm opacity-80">Status</span>
              <span className="text-label-lg font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">check_circle</span> {stats.status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <button className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-col gap-2 items-start hover:bg-surface-container transition-colors shadow-sm">
            <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined">receipt_long</span>
            </div>
            <span className="text-label-md font-bold text-on-surface text-left">Generate Payslips</span>
          </button>
          <button className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-col gap-2 items-start hover:bg-surface-container transition-colors shadow-sm">
            <div className="w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
              <span className="material-symbols-outlined">account_balance</span>
            </div>
            <span className="text-label-md font-bold text-on-surface text-left">Bank Transfer File</span>
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <h3 className="text-label-lg font-bold text-on-surface">Recent Activity</h3>
          <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/30 flex flex-col gap-3">
             <div className="flex justify-between items-center">
               <div className="flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                 <span className="text-body-md text-on-surface font-semibold">September 2023 Processed</span>
               </div>
               <span className="text-label-sm text-on-surface-variant">2 days ago</span>
             </div>
             <div className="flex justify-between items-center border-t border-outline-variant/20 pt-2">
               <div className="flex items-center gap-2">
                 <span className="material-symbols-outlined text-tertiary text-[20px]">description</span>
                 <span className="text-body-md text-on-surface font-semibold">Tax Report Q3 Generated</span>
               </div>
               <span className="text-label-sm text-on-surface-variant">5 days ago</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
