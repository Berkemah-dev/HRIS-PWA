import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MobileLayout from './layouts/MobileLayout';
import Login from './pages/Login';
import BerandaEss from './pages/BerandaEss';
import PresensiHarian from './pages/PresensiHarian';
import RiwayatPresensi from './pages/RiwayatPresensi';
import ManajemenCuti from './pages/ManajemenCuti';
import AjukanCutiBaru from './pages/AjukanCutiBaru';
import ReimbursementSaya from './pages/ReimbursementSaya';
import FormulirReimbursement from './pages/FormulirReimbursement';
import SlipGajiSaya from './pages/SlipGajiSaya';
import KpiSaya from './pages/KpiSaya';
import PusatPelatihan from './pages/PusatPelatihan';
import AsetSaya from './pages/AsetSaya';
import PusatPersetujuan from './pages/PusatPersetujuan';
import PilihPerusahaan from './pages/PilihPerusahaan';
import ProfilSaya from './pages/ProfilSaya';
import { useAuthStore } from './store/authStore';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';
import NotifikasiSaya from './pages/NotifikasiSaya';
import OvertimeSaya from './pages/OvertimeSaya';
import DokumenSaya from './pages/DokumenSaya';
import DetailSlipGaji from './pages/DetailSlipGaji';
import DetailReimbursement from './pages/DetailReimbursement';

function RequireAuth() {
  const token = useAuthStore((state) => state.token);
  return token ? <MobileLayout /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Navigate to="/beranda" replace />} />
          <Route path="/beranda" element={<BerandaEss />} />
          <Route path="/presensi-harian" element={<PresensiHarian />} />
          <Route path="/attendance" element={<PresensiHarian />} />
          <Route path="/riwayat-presensi" element={<RiwayatPresensi />} />
          <Route path="/cuti" element={<ManajemenCuti />} />
          <Route path="/leaves" element={<ManajemenCuti />} />
          <Route path="/ajukan-cuti-baru" element={<AjukanCutiBaru />} />
          <Route path="/reimbursement-saya" element={<ReimbursementSaya />} />
          <Route path="/formulir-reimbursement" element={<FormulirReimbursement />} />
          <Route path="/slip-gaji" element={<SlipGajiSaya />} />
          <Route path="/slip-gaji/:id" element={<DetailSlipGaji />} />
          <Route path="/kpi-saya" element={<KpiSaya />} />
          <Route path="/pelatihan" element={<PusatPelatihan />} />
          <Route path="/aset-saya" element={<AsetSaya />} />
          <Route path="/overtime-saya" element={<OvertimeSaya />} />
          <Route path="/dokumen-saya" element={<DokumenSaya />} />
          <Route path="/notifikasi" element={<NotifikasiSaya />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/persetujuan" element={<PusatPersetujuan />} />
          <Route path="/reimbursement-saya/:id" element={<DetailReimbursement />} />
          <Route path="/pilih-perusahaan" element={<PilihPerusahaan />} />
          <Route path="/profile" element={<ProfilSaya />} />
        </Route>
        <Route path="*" element={<Navigate to="/beranda" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
