import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await api.post('/forgot-password', { email });
      setMessage(response.data?.message ?? 'Link reset password sudah dikirim.');
    } catch (err) {
      const response = err as { response?: { data?: { message?: string } } };
      setError(response.response?.data?.message ?? 'Gagal mengirim link reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface px-margin-mobile flex items-center justify-center">
      <form onSubmit={submit} className="w-full max-w-sm bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 flex flex-col gap-4">
        <button type="button" onClick={() => navigate('/login')} className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="text-headline-lg font-bold text-on-surface">Lupa Password</h1>
          <p className="text-body-md text-on-surface-variant mt-1">Masukkan email akun untuk menerima link reset.</p>
        </div>
        {message && <div className="p-3 rounded-lg bg-primary-container text-on-primary-container text-label-sm">{message}</div>}
        {error && <div className="p-3 rounded-lg bg-error-container text-on-error-container text-label-sm">{error}</div>}
        <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="user@company.com" className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface outline-none focus:border-primary" />
        <button disabled={loading} className="h-12 rounded-xl bg-primary text-on-primary font-semibold disabled:opacity-60">{loading ? 'Mengirim...' : 'Kirim Link Reset'}</button>
      </form>
    </div>
  );
}
