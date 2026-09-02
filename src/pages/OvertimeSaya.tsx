import { type ChangeEvent, useEffect, useState } from 'react';
import api from '../lib/api';
import { asArray, formatDate } from '../lib/format';

type OvertimeItem = {
  id: number;
  date: string;
  reason: string;
  status: string;
  hours: string;
};

export default function OvertimeSaya() {
  const [items, setItems] = useState<OvertimeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [reasonById, setReasonById] = useState<Record<number, string>>({});
  const [message, setMessage] = useState('');

  const load = () => {
    setLoading(true);
    api.get('/my/overtime')
      .then((response) => setItems(asArray<Record<string, unknown>>(response.data).map((item) => ({
        id: Number(item.id),
        date: formatDate(item.date ?? item.overtime_date ?? item.created_at),
        reason: String(item.reason ?? ''),
        status: String(item.status ?? 'pending'),
        hours: String(item.total_hours ?? item.hours ?? item.duration ?? '-'),
      }))))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const saveReason = async (id: number) => {
    await api.put(`/my/overtime/${id}/reason`, { reason: reasonById[id] });
    setMessage('Alasan lembur tersimpan.');
    load();
  };

  const uploadEvidence = async (id: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    await api.post(`/my/overtime/${id}/evidence`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
    setMessage('Bukti lembur berhasil diupload.');
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-surface px-margin-mobile py-stack-md">
      <h1 className="text-headline-lg font-bold text-on-surface">Overtime Saya</h1>
      <p className="text-body-md text-on-surface-variant mt-1">Request lembur mengikuti data yang dibuat oleh flow attendance/backend.</p>
      {message && <div className="mt-4 p-3 rounded-lg bg-primary-container text-on-primary-container text-label-sm">{message}</div>}
      {loading && <div className="flex justify-center p-8"><span className="material-symbols-outlined animate-spin text-primary">sync</span></div>}
      {!loading && items.length === 0 && <div className="mt-4 p-6 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-center text-on-surface-variant">Belum ada request overtime.</div>}
      <div className="flex flex-col gap-3 mt-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl bg-surface-container-lowest border border-outline-variant/30 p-4 flex flex-col gap-3">
            <div className="flex justify-between gap-3">
              <div>
                <h2 className="text-label-md font-bold text-on-surface">{item.date}</h2>
                <p className="text-body-md text-on-surface-variant">{item.hours} jam</p>
              </div>
              <span className="px-2 py-1 rounded-full bg-surface-variant text-on-surface-variant text-[10px] font-bold uppercase h-fit">{item.status}</span>
            </div>
            <textarea value={reasonById[item.id] ?? item.reason} onChange={(event) => setReasonById({ ...reasonById, [item.id]: event.target.value })} className="w-full min-h-20 p-3 rounded-xl border border-outline-variant bg-surface outline-none focus:border-primary" placeholder="Alasan lembur" />
            <div className="flex gap-2">
              <button onClick={() => saveReason(item.id)} className="flex-1 h-11 rounded-xl bg-primary text-on-primary font-semibold">Simpan</button>
              <label className="flex-1 h-11 rounded-xl bg-surface-container-high text-on-surface font-semibold flex items-center justify-center">
                Upload Bukti
                <input type="file" className="hidden" onChange={(event) => uploadEvidence(item.id, event)} />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
