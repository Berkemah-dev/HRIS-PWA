import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import api from '../lib/api';
import { asArray, formatDate } from '../lib/format';

type DocumentItem = {
  id: number;
  title: string;
  type: string;
  status: string;
  date: string;
};

export default function DokumenSaya() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [title, setTitle] = useState('');
  const [documentType, setDocumentType] = useState('personal');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const load = () => {
    setLoading(true);
    api.get('/my/documents')
      .then((response) => setDocuments(asArray<Record<string, unknown>>(response.data).map((item) => ({
        id: Number(item.id),
        title: String(item.title ?? item.file_name ?? 'Dokumen'),
        type: String(item.document_type ?? item.category ?? '-'),
        status: String(item.status ?? 'pending'),
        date: formatDate(item.created_at ?? item.expires_at),
      }))))
      .catch(() => setDocuments([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const upload = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) return;
    const form = new FormData();
    form.append('title', title);
    form.append('document_type', documentType);
    form.append('file', file);
    await api.post('/my/documents', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    setTitle('');
    setFile(null);
    setMessage('Dokumen berhasil diupload.');
    load();
  };

  const onFile = (event: ChangeEvent<HTMLInputElement>) => setFile(event.target.files?.[0] ?? null);

  return (
    <div className="w-full h-full overflow-y-auto bg-surface px-margin-mobile py-stack-md">
      <h1 className="text-headline-lg font-bold text-on-surface">Dokumen Saya</h1>
      {message && <div className="mt-4 p-3 rounded-lg bg-primary-container text-on-primary-container text-label-sm">{message}</div>}
      <form onSubmit={upload} className="mt-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 p-4 flex flex-col gap-3">
        <input value={title} onChange={(event) => setTitle(event.target.value)} required placeholder="Judul dokumen" className="h-11 px-3 rounded-xl border border-outline-variant bg-surface outline-none focus:border-primary" />
        <input value={documentType} onChange={(event) => setDocumentType(event.target.value)} required placeholder="Tipe dokumen" className="h-11 px-3 rounded-xl border border-outline-variant bg-surface outline-none focus:border-primary" />
        <input type="file" required onChange={onFile} className="text-label-sm text-on-surface-variant" />
        <button className="h-11 rounded-xl bg-primary text-on-primary font-semibold">Upload Dokumen</button>
      </form>
      {loading && <div className="flex justify-center p-8"><span className="material-symbols-outlined animate-spin text-primary">sync</span></div>}
      <div className="flex flex-col gap-3 mt-4">
        {documents.map((doc) => (
          <div key={doc.id} className="rounded-xl bg-surface-container-lowest border border-outline-variant/30 p-4">
            <h2 className="text-label-md font-bold text-on-surface">{doc.title}</h2>
            <p className="text-body-md text-on-surface-variant">{doc.type}</p>
            <div className="flex justify-between mt-2 text-label-sm text-on-surface-variant"><span>{doc.status}</span><span>{doc.date}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}
