import { type FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function ResetPassword() {
  const navigate = useNavigate();
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const [email, setEmail] = useState(params.get('email') ?? '');
  const [token, setToken] = useState(params.get('token') ?? '');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await api.post('/reset-password', {
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      });
      setMessage(response.data?.message ?? 'Password berhasil direset.');
      setTimeout(() => navigate('/login'), 800);
    } catch (err) {
      const response = err as { response?: { data?: { message?: string } } };
      setError(response.response?.data?.message ?? 'Gagal reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface px-margin-mobile flex items-center justify-center">
      <form onSubmit={submit} className="w-full max-w-sm bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 flex flex-col gap-4">
        <h1 className="text-headline-lg font-bold text-on-surface">Reset Password</h1>
        {message && <div className="p-3 rounded-lg bg-primary-container text-on-primary-container text-label-sm">{message}</div>}
        {error && <div className="p-3 rounded-lg bg-error-container text-on-error-container text-label-sm">{error}</div>}
        <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" className="h-12 px-4 rounded-xl border border-outline-variant bg-surface outline-none focus:border-primary" />
        <input required value={token} onChange={(event) => setToken(event.target.value)} placeholder="Token reset" className="h-12 px-4 rounded-xl border border-outline-variant bg-surface outline-none focus:border-primary" />
        <input type="password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password baru" className="h-12 px-4 rounded-xl border border-outline-variant bg-surface outline-none focus:border-primary" />
        <input type="password" required minLength={8} value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} placeholder="Konfirmasi password" className="h-12 px-4 rounded-xl border border-outline-variant bg-surface outline-none focus:border-primary" />
        <button disabled={loading} className="h-12 rounded-xl bg-primary text-on-primary font-semibold disabled:opacity-60">{loading ? 'Menyimpan...' : 'Reset Password'}</button>
      </form>
    </div>
  );
}
