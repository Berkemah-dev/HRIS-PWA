import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PersetujuanCuti() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Pending');
  const [requests, setRequests] = useState([
    { id: 1, name: 'John Smith', role: 'Senior Developer', type: 'Annual Leave', date: 'Oct 24 - Oct 26', duration: '3 Days', status: 'Pending', avatar: 'JS' },
    { id: 2, name: 'Sarah Lee', role: 'Marketing Manager', type: 'Sick Leave', date: 'Oct 20 - Oct 21', duration: '2 Days', status: 'Approved', avatar: 'SL' },
  ]);

  const filtered = requests.filter(r => r.status === activeTab);

  return (
    <div className="w-full flex flex-col h-full overflow-y-auto">
      <div className="flex flex-col w-full gap-stack-md px-margin-mobile pb-margin-mobile">
        
        <div className="flex flex-col gap-stack-sm pt-4">
          <h1 className="text-headline-lg text-on-surface">Leave Approvals</h1>
          <p className="text-body-md text-on-surface-variant">Review and manage pending leave requests from your team.</p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-margin-mobile px-margin-mobile snap-x scroll-smooth mt-2">
          {['Pending', 'Approved', 'Rejected'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`snap-start flex-none px-4 py-2 rounded-full text-label-md whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-primary-container text-on-primary-container font-semibold' : 'bg-surface-container text-on-surface-variant'}`}
            >
              {tab} {tab === 'Pending' && `(${requests.filter(r => r.status === 'Pending').length})`}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-stack-md mt-2">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant">No requests found.</div>
          ) : filtered.map(req => (
            <div key={req.id} className="bg-surface-container-lowest border border-outline-variant rounded-[12px] p-4 flex flex-col gap-stack-md shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container font-headline-md">
                    {req.avatar}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-label-md text-on-surface">{req.name}</span>
                    <span className="text-label-sm text-on-surface-variant">{req.role}</span>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${req.status === 'Pending' ? 'bg-secondary-container text-on-secondary-container' : req.status === 'Approved' ? 'bg-primary-container text-on-primary-container' : 'bg-error-container text-on-error-container'}`}>
                  {req.status}
                </span>
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-on-surface">
                  <span className="material-symbols-outlined text-[18px] text-tertiary">flight_takeoff</span>
                  <span className="text-body-md font-medium">{req.type}</span>
                </div>
                <div className="flex items-center justify-between text-body-sm text-on-surface-variant pl-[26px]">
                  <span>{req.date}</span>
                  <span className="font-semibold text-on-surface">{req.duration}</span>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2 border-t border-outline-variant/30">
                <button 
                  onClick={() => navigate('/detail-persetujuan-cuti')}
                  className="flex-1 py-2 rounded-lg bg-surface-container text-on-surface font-label-md hover:bg-surface-container-high transition-colors"
                >
                  View Details
                </button>
                {req.status === 'Pending' && (
                  <button 
                    onClick={() => { setRequests(requests.filter(r => r.id !== req.id)); alert('Approved'); }}
                    className="flex-1 py-2 rounded-lg bg-primary text-on-primary font-label-md hover:opacity-90 transition-opacity"
                  >
                    Approve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
