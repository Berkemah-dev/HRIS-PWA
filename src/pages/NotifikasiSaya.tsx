import { useEffect, useState } from 'react';
import api from '../lib/api';
import { asArray, formatDate } from '../lib/format';

type NotificationItem = {
  id: number;
  title: string;
  message: string;
  date: string;
  read: boolean;
};

export default function NotifikasiSaya() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notifications')
      .then((response) => setItems(asArray<Record<string, unknown>>(response.data).map((item) => ({
        id: Number(item.id),
        title: String(item.title ?? item.type ?? 'Notifikasi'),
        message: String(item.message ?? item.body ?? '-'),
        date: formatDate(item.created_at),
        read: Boolean(item.read_at),
      }))))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const markAllRead = async () => {
    await api.put('/notifications/read-all');
    setItems((current) => current.map((item) => ({ ...item, read: true })));
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-surface px-margin-mobile py-stack-md">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-headline-lg font-bold text-on-surface">Notifikasi</h1>
        <button onClick={markAllRead} className="text-primary text-label-md font-semibold">Tandai dibaca</button>
      </div>
      {loading && <div className="flex justify-center p-8"><span className="material-symbols-outlined animate-spin text-primary">sync</span></div>}
      {!loading && items.length === 0 && <div className="p-6 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-center text-on-surface-variant">Belum ada notifikasi.</div>}
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl bg-surface-container-lowest border border-outline-variant/30 p-4">
            <div className="flex items-center gap-2">
              {!item.read && <span className="w-2 h-2 rounded-full bg-primary" />}
              <h2 className="text-label-md font-bold text-on-surface">{item.title}</h2>
            </div>
            <p className="text-body-md text-on-surface-variant mt-1">{item.message}</p>
            <p className="text-label-sm text-on-surface-variant mt-2">{item.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
