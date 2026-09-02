export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function unwrapData<T>(payload: unknown, fallback: T): T {
  if (!payload || typeof payload !== 'object') return fallback;

  const record = payload as Record<string, unknown>;
  const data = record.data;

  if (data && typeof data === 'object' && 'data' in data) {
    return ((data as Record<string, unknown>).data ?? fallback) as T;
  }

  return (data ?? payload ?? fallback) as T;
}

export function asArray<T>(payload: unknown): T[] {
  const unwrapped = unwrapData<unknown>(payload, []);
  if (Array.isArray(unwrapped)) return unwrapped as T[];

  if (unwrapped && typeof unwrapped === 'object') {
    const record = unwrapped as Record<string, unknown>;
    if (Array.isArray(record.data)) return record.data as T[];
    if (Array.isArray(record.items)) return record.items as T[];
    if (Array.isArray(record.records)) return record.records as T[];
  }

  return [];
}

export function formatRupiah(value: unknown) {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function formatDate(value: unknown) {
  if (!value) return '-';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(value: unknown) {
  if (!value) return '--:--';
  const raw = String(value);
  if (/^\d{2}:\d{2}/.test(raw)) return raw.slice(0, 5);
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}
