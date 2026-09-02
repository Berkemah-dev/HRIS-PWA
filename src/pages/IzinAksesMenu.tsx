import React, { useState } from 'react';
import api from '../lib/api';

export default function IzinAksesMenu() {
  const [selectedRole, setSelectedRole] = useState('HR Manager');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const [permissions, setPermissions] = useState({
    karyawan: { read: true, write: true, delete: false },
    payroll: { read: true, write: false, delete: false }
  });

  const roles = ['System Admin', 'HR Manager', 'Payroll Staff', 'Employee'];

  const togglePermission = (module: 'karyawan' | 'payroll', action: 'read' | 'write' | 'delete') => {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: !prev[module][action]
      }
    }));
  };

  const handleSave = async () => {
    try {
      // Mock API save: api.put('/admin/roles/permissions', { role: selectedRole, permissions })
      alert('Permissions saved for ' + selectedRole);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full flex flex-col h-full overflow-y-auto">
      <div className="flex flex-col w-full px-margin-mobile py-stack-md gap-stack-lg">
        
        <div className="flex flex-col gap-stack-sm">
          <h2 className="text-headline-md text-on-surface">Permission Management</h2>
          <p className="text-body-md text-on-surface-variant">Configure access control and menu visibility for roles.</p>
        </div>

        <div className="flex flex-col gap-stack-md">
          <h3 className="text-label-md text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
            Role Configuration
          </h3>
          <div className="bg-surface-container rounded-xl p-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2 relative">
              <label className="text-label-sm text-on-surface-variant">Selected Role</label>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full h-[44px] bg-surface rounded-lg flex items-center justify-between px-3 text-body-md text-on-surface border-none shadow-sm relative z-10"
              >
                <span>{selectedRole}</span>
                <span className="material-symbols-outlined text-on-surface-variant">{dropdownOpen ? 'expand_less' : 'expand_more'}</span>
              </button>
              
              {dropdownOpen && (
                <div className="absolute top-[70px] left-0 w-full bg-surface-container-highest rounded-lg shadow-md flex-col overflow-hidden z-20">
                  {roles.map(role => (
                    <button 
                      key={role}
                      onClick={() => { setSelectedRole(role); setDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-3 text-body-md ${selectedRole === role ? 'bg-surface-container-high font-medium text-primary' : 'text-on-surface hover:bg-surface-container-high'}`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-stack-md">
          <h3 className="text-label-md text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">key</span>
            Module Permissions
          </h3>
          <div className="flex flex-col gap-stack-sm">
            
            {/* Karyawan Module */}
            <div className="bg-surface-container rounded-xl overflow-hidden shadow-sm p-4 flex flex-col gap-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px] text-on-primary-container">groups</span>
                </div>
                <span className="text-label-md text-on-surface">Karyawan</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-label-sm text-on-surface">View Data</span>
                </div>
                <div 
                  onClick={() => togglePermission('karyawan', 'read')}
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${permissions.karyawan.read ? 'bg-primary' : 'bg-surface-variant'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${permissions.karyawan.read ? 'translate-x-6' : ''}`}></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-label-sm text-on-surface">Edit/Create Data</span>
                </div>
                <div 
                  onClick={() => togglePermission('karyawan', 'write')}
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${permissions.karyawan.write ? 'bg-primary' : 'bg-surface-variant'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${permissions.karyawan.write ? 'translate-x-6' : ''}`}></div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button 
              onClick={handleSave}
              className="w-full mt-4 bg-primary text-on-primary py-3 rounded-lg font-label-md shadow-sm active:scale-95 transition-transform"
            >
              Save Configuration
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
