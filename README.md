# Stitch OmniHR Enterprise Mobile PWA (HRIS-PWA)

Aplikasi **Human Resource Information System (HRIS)** berbasis web bergerak (*Mobile-First Single Page Application / PWA*) untuk **Employee Self-Service (ESS)** dan **Pusat Persetujuan Manajer (Approval Center)**.

---

## 📖 Dokumentasi Lengkap
Dokumentasi lengkap mengenai arsitektur, modul fitur, API interceptor, multi-company auth flow, dan skrip pengembangan tersedia di:
👉 **[PROJECT_DOCUMENTATION.md](file:///d:/Project/HRIS-PWA/PROJECT_DOCUMENTATION.md)**

---

## 🚀 Fitur Utama
1. **Presensi Geolocation (GPS):** Check-in / Check-out berbasis koordinat dan jadwal kerja shift aktif.
2. **Manajemen Cuti & Izin:** Cek saldo cuti, ajukan cuti baru, dan lacak status persetujuan.
3. **Reimbursement:** Pengajuan klaim biaya operasional lengkap dengan lampiran nota.
4. **Slip Gaji Digital (Payslip):** Rincian gaji bulanan dan unduh slip resmi.
5. **Overtime (Lembur):** Pencatatan dan pengajuan jam kerja lembur.
6. **KPI & Pusat Pelatihan:** Pemantauan indikator kinerja utama dan pelatihan karyawan.
7. **Pusat Persetujuan (Manager/HR):** Persetujuan terpadu untuk pengajuan cuti, reimburse, dan lembur bawahan.
8. **Multi-Company & RBAC:** Dukungan multi-entitas perusahaan dengan perpindahan konteks instan (`X-Company-Id`).

---

## 🛠️ Tech Stack
- **Frontend:** React 19, TypeScript, Vite 8, React Router v7
- **State Management:** Zustand v5 (Persist)
- **Styling:** Tailwind CSS (Material 3 Theme Tokens), Inter Font, Material Symbols
- **HTTP Client:** Axios (Automatic Bearer Token & Company Header Interceptors)

---

## ⚡ Menjalankan Proyek
```bash
# Install dependencies
npm install

# Jalankan server lokal
npm run dev

# Build untuk produksi
npm run build
```

