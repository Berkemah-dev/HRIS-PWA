import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { asArray, formatDate, formatRupiah } from '../lib/format';

interface Payslip {
  id: number;
  period: string;
  netPay: string;
  status: string;
  basicSalary: string;
  allowances: string;
  deductions: string;
}

export default function SlipGajiSaya() {
  const navigate = useNavigate();
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayslips = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/my/payroll');
        setPayslips(asArray<Record<string, unknown>>(response.data).map((slip) => ({
          id: Number(slip.id),
          period: String(slip.period ?? slip.month ?? formatDate(slip.payroll_date ?? slip.created_at)),
          netPay: formatRupiah(slip.net_salary ?? slip.net_pay ?? slip.total_net),
          status: String(slip.status ?? 'processed'),
          basicSalary: formatRupiah(slip.basic_salary ?? slip.base_salary),
          allowances: formatRupiah(slip.allowances ?? slip.total_allowance),
          deductions: formatRupiah(slip.deductions ?? slip.total_deduction),
        })));
      } catch {
        setPayslips([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayslips();
  }, []);

  return (
    <div className="w-full flex flex-col h-full overflow-y-auto">
      <div className="flex flex-col w-full px-margin-mobile gap-stack-lg py-6 relative overflow-hidden">
        {/* Ambient Background Decoration */}
        <div className="absolute -top-[20%] -right-[10%] w-[150%] aspect-square bg-gradient-radial from-primary/5 to-transparent rounded-full pointer-events-none blur-3xl mix-blend-multiply opacity-70"></div>
        <div className="absolute top-[10%] -left-[20%] w-[120%] aspect-square bg-gradient-radial from-tertiary/5 to-transparent rounded-full pointer-events-none blur-3xl mix-blend-multiply opacity-60"></div>
        
        {/* Header Section */}
        <div className="flex flex-col gap-1 z-10 relative">
          <h1 className="text-headline-xl font-headline-xl text-on-surface tracking-tight">Payroll</h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-[280px]">Your compensation and payslip history securely accessible.</p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center p-8"><span className="material-symbols-outlined animate-spin text-primary">sync</span></div>
        ) : payslips.length > 0 ? (
          payslips.map((slip) => (
            <div key={slip.id} className="flex flex-col gap-0 z-10 w-full relative group mb-4">
              {/* Secure Top Bar */}
              <div className="bg-surface-variant text-on-surface-variant py-2 px-4 rounded-t-xl flex items-center justify-between text-label-sm font-label-sm border border-b-0 border-outline-variant/30 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent w-[200%] animate-[slideRight_3s_linear_infinite] opacity-50"></div>
                <div className="flex items-center gap-2 relative z-10">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">lock</span>
                  <span>Slip gaji pribadi</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider opacity-70 relative z-10">Private</span>
              </div>
              
              {/* Main Card Body */}
              <div className="bg-surface-container-lowest rounded-b-xl shadow-md border border-outline-variant/30 p-5 flex flex-col gap-stack-md relative overflow-hidden">
                <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-[120px] text-surface-container-highest opacity-20 pointer-events-none rotate-[-15deg] select-none">payments</span>
                
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Periode</span>
                    <span className="text-headline-md font-headline-md text-on-surface">{slip.period}</span>
                  </div>
                  <div className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    <span className="text-label-sm font-label-sm">{slip.status}</span>
                  </div>
                </div>
                
                {/* Net Salary Reveal Area */}
                <div className="flex flex-col gap-1 mt-2">
                  <span className="text-label-md font-label-md text-on-surface-variant flex items-center gap-1">Take Home Pay</span>
                  <div className="flex items-baseline gap-2 group cursor-pointer">
                    <span className="text-[36px] font-bold text-on-surface tracking-tight group-active:blur-sm transition-all duration-300 select-none">{slip.netPay}</span>
                    <span className="material-symbols-outlined text-[20px] text-primary opacity-0 group-active:opacity-100 transition-opacity">visibility_off</span>
                  </div>
                </div>
                
                <div className="w-full h-px bg-outline-variant/20 my-1"></div>
                
                {/* Details Breakdown */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-body-md">
                    <span className="text-on-surface-variant">Gaji Pokok</span>
                    <span className="text-on-surface font-semibold">{slip.basicSalary}</span>
                  </div>
                  <div className="flex justify-between items-center text-body-md">
                    <span className="text-on-surface-variant">Tunjangan</span>
                    <span className="text-primary font-semibold">+{slip.allowances}</span>
                  </div>
                  <div className="flex justify-between items-center text-body-md">
                    <span className="text-on-surface-variant">Potongan</span>
                    <span className="text-error font-semibold">-{slip.deductions}</span>
                  </div>
                </div>
                
                {/* Action */}
                <button onClick={() => navigate(`/slip-gaji/${slip.id}`)} className="w-full mt-2 bg-surface-container-high hover:bg-surface-variant transition-colors text-on-surface py-3 rounded-lg font-label-md font-semibold flex justify-center items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">visibility</span> Detail & Unduh
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-on-surface-variant">Belum ada data slip gaji.</div>
        )}
      </div>
    </div>
  );
}
