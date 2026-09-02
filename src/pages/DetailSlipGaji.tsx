import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api';
import { formatRupiah, unwrapData } from '../lib/format';

type SlipPayload = {
  period?: string;
  status?: string;
  employee?: { name?: string; employee_code?: string };
  summary?: Record<string, number>;
  details?: Array<{ component_name?: string; name?: string; amount?: number; type?: string }>;
};

export default function DetailSlipGaji() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [slip, setSlip] = useState<SlipPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/my/payroll/${id}/slip`)
      .then((response) => setSlip(unwrapData<SlipPayload>(response.data, {})))
      .catch(() => setSlip(null))
      .finally(() => setLoading(false));
  }, [id]);

  const downloadPdf = async () => {
    const response = await api.get(`/my/payroll/${id}/export-pdf`, { responseType: 'blob' });
    const href = URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = href;
    link.download = `slip-gaji-${slip?.period ?? id}.pdf`;
    link.click();
    URL.revokeObjectURL(href);
  };

  const summary = slip?.summary ?? {};
  const earnings = [
    ['Gaji Pokok', summary.basic_salary],
    ['Tunjangan', summary.allowance],
    ['Bonus', summary.bonus],
    ['Overtime', summary.overtime_pay],
    ['Reimbursement', summary.reimbursement_amount],
  ];
  const deductions = [
    ['BPJS Kesehatan', summary.bpjs_kesehatan],
    ['BPJS Ketenagakerjaan', summary.bpjs_ketenagakerjaan],
    ['PPh 21', summary.pph21],
    ['Potongan Terlambat', summary.late_deduction],
  ];

  return (
    <div className="w-full flex flex-col h-full overflow-y-auto">
      <div className="flex flex-col w-full gap-stack-md px-margin-mobile py-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant"><span className="material-symbols-outlined">arrow_back</span></button>
            <h2 className="text-headline-lg font-bold text-on-surface">Detail Slip Gaji</h2>
          </div>
          {slip && <button onClick={downloadPdf} className="text-primary font-semibold text-label-md">Download</button>}
        </div>

        {loading && <div className="flex justify-center p-8"><span className="material-symbols-outlined animate-spin text-primary">sync</span></div>}
        {!loading && !slip && <div className="p-8 text-center text-on-surface-variant">Slip gaji tidak ditemukan.</div>}
        {slip && (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-[12px] p-6 shadow-sm mt-2 flex flex-col gap-6">
            <div className="flex flex-col items-center border-b border-outline-variant/30 pb-6">
              <span className="text-label-md text-on-surface-variant uppercase tracking-wider">Periode</span>
              <span className="text-headline-xl font-bold text-on-surface mt-1">{slip.period ?? '-'}</span>
              <span className="text-[32px] font-bold text-primary mt-4">{formatRupiah(summary.take_home_pay)}</span>
              <span className="text-label-sm text-on-surface-variant mt-1">Take Home Pay</span>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-label-lg font-bold text-on-surface">Penerimaan</h3>
              {earnings.map(([label, amount]) => <div key={label} className="flex justify-between"><span className="text-body-md text-on-surface-variant">{label}</span><span className="text-body-md text-on-surface font-semibold">{formatRupiah(amount)}</span></div>)}
            </div>
            <div className="flex flex-col gap-3 border-t border-outline-variant/30 pt-4">
              <h3 className="text-label-lg font-bold text-error">Potongan</h3>
              {deductions.map(([label, amount]) => <div key={label} className="flex justify-between"><span className="text-body-md text-on-surface-variant">{label}</span><span className="text-body-md text-error font-semibold">- {formatRupiah(amount)}</span></div>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
