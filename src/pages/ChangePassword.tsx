import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';

export default function ChangePassword() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/change-password', {
        current_password: currentPassword,
        password,
        password_confirmation: passwordConfirmation,
      });
      if (user) setUser({ ...user, must_change_password: false });
      navigate('/beranda', { replace: true });
    } catch (err) {
      const response = err as { response?: { data?: { message?: string } } };
      setError(response.response?.data?.message ?? 'Gagal mengganti password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-surface">
      <form onSubmit={submit} className="px-margin-mobile py-stack-md flex flex-col gap-4">
        <h1 className="text-headline-lg font-bold text-on-surface">Ganti Password</h1>
        <p className="text-body-md text-on-surface-variant">Gunakan password sementara atau password lama sebagai password saat ini.</p>
        {error && <div className="p-3 rounded-lg bg-error-container text-on-error-container text-label-sm">{error}</div>}
        <input type="password" required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} placeholder="Password saat ini" className="h-12 px-4 rounded-xl border border-outline-variant bg-surface outline-none focus:border-primary" />
        <input type="password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password baru" className="h-12 px-4 rounded-xl border border-outline-variant bg-surface outline-none focus:border-primary" />
        <input type="password" required minLength={8} value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} placeholder="Konfirmasi password baru" className="h-12 px-4 rounded-xl border border-outline-variant bg-surface outline-none focus:border-primary" />
        <button disabled={loading} className="h-12 rounded-xl bg-primary text-on-primary font-semibold disabled:opacity-60">{loading ? 'Menyimpan...' : 'Simpan Password'}</button>
      </form>
    </div>
  );
}
