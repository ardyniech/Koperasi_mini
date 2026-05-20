# PRD Koperasi Mini v1.1 (Updated)

**Tujuan**: Sistem transparansi koperasi syariah untuk <50 orang. Dapat digunakan oleh berbagai komunitas kecil dengan identitas masing-masing.

**Prinsip**: 
- Admin input manual, anggota cuma lihat (read-only)
- Syariah: Tanpa bunga (riba), menggunakan margin/bagi hasil
- Gotong royong: Dana dari anggota untuk membangun usaha bersama
- Hindari masalah hukum (tanpa NIK, tanpa data pribadi sensitif)
- **Multi-komunitas**: Setiap komunitas punya identitas sendiri (nama, logo, warna, banner)

---

## 1. AUTHENTICATION (Simpel: Email Only)

- **Register**: Email + Password saja (tidak perlu NIK, no OTP)
  - **CATATAN**: Akun admin DIDAPATKAN dari pengembang (kita), bukan self-register. Admin diberikan username unik + password.
- **Login**: Email + Password → JWT token
- **Profile**: Nama lengkap, Email, No WhatsApp (opsional, buat notifikasi manual)
- **Role**: `admin` (dibuat sistem) atau `anggota` (bisa self-register)

---

## 2. LANDING PAGE (Halaman Depan / Iklan)

**Tujuan**: Menarik orang baru / komunitas lain untuk daftar dan menggunakan aplikasi ini.

### 2.1 Struktur Landing Page
- **Banner Atas**: Nama koperasi / komunitas + logo (bisa di-custom per komunitas)
- **Konten Utama** (Editable oleh Admin):
  - Judul / Headline
  - Deskripsi singkat koperasi
  - Fitur unggulan (list)
  - Testimoni / Statistik (opsional)
- **Tombol Aksi**:
  - "Daftar" → Halaman register
  - "Login" → Halaman login
- **Footer**:
  - "Powered by Ardyniech" (link ke social media: Instagram, LinkedIn, dsb)
  - Informasi kontak / sosmed komunitas

### 2.2 Manajemen Landing Page (Admin Only)
- **Tab Baru di Admin Dashboard**: "Landing Page"
- **Fitur Edit**:
  - Edit teks headline, deskripsi
  - Upload logo / banner
  - Ganti warna tema (primary color) - harus menyertakan opsi Apple-style (#007aff) sebagai default
  - Toggle tampilan elemen (show/hide stats, testimoni, dsb)
- **Preview**: Bisa lihat perubahan sebelum publish

---

## 3. ADMIN FEATURES (Manual Entry)

Admin yang sibuk input data manual. Fitur:

### 3.1 Manajemen Anggota
- Tambah anggota baru (input manual: nama, email, no WA)
- Non-aktifkan anggota

### 3.2 Simpanan (Manual Recording)
- **Setor Simpanan**: Input nama anggota → nominal → jenis (Pokok/Wajib/Sukarela) → simpan
- **Tarik Simpanan**: Input nama anggota → nominal → catat

### 3.3 Pinjaman Syariah (Manual Recording)
- **Input Pinjaman**: Pilih anggota → nominal → margin (bukan bunga) → tenor → simpan
- **Jadwal Angsuran**: Auto-generate (flat margin) setelah pinjaman dicatat
- **Catat Pembayaran Angsuran**: Pilih anggota → bulan ke berapa → nominal → simpan

### 3.4 Funding Gotong Royong (Manual Recording)
- **Input Dana Usaha**: Pilih anggota → nominal dana → tujuan usaha → simpan
- **List Dana Terkumpul**: Lihat total dana dari semua anggota untuk usaha tertentu
- **Pencairan Dana**: Admin catat pencairan dana untuk usaha (request dari anggota)

### 3.5 Laporan (Transparansi)
- **Saldo per Anggota**: Lihat saldo simpanan tiap anggota
- **Piutang per Anggota**: Lihat sisa pinjaman & angsuran belum bayar
- **Kewajiban Mendatang**: Lihat angsuran yang akan jatuh tempo (7 hari ke depan)
- **Riwayat Transaksi**: Log semua setor/tarik/pinjam/bayar

### 3.6 Kustomisasi & Branding (NEW)
- **Tab "Settings / Branding"**:
  - Nama koperasi / komunitas
  - Upload logo (small + large)
  - Pilih warna tema (primary color) - default: #007aff (Apple-style)
  - Edit teks footer (default: "Powered by Ardyniech")
  - Custom CSS (opsional, untuk komunitas yang mau styling lebih lanjut)
  - **MULTI-COMMUNITY**: Setiap komunitas punya setting terpisah, identitas mereka ditonjolkan

---

## 4. ANGGOTA FEATURES (View-Only / Read Only)

Anggota HANYA bisa lihat, tidak bisa input transaksi:

### 4.1 Dashboard Anggota
- **Banner Atas Kiri**: Salam + Nama Anggota (di bawah banner koperasi)
  - Contoh: "Assalamu'alaikum, Ahmad 👋" atau "Halo, Ahmad 👋"
- **Saldo Saya**: Total simpanan (Pokok + Wajib + Sukarela)
- **Sisa Pinjaman Saya**: Jika ada pinjaman aktif
- **Kewajiban yang Akan Datang**: Angsuran belum bayar + jatuh tempo
- **Kewajiban yang Belum Dilaksanakan**: Angsuran yang sudah lewat (telat)

### 4.2 Riwayat Saya
- Lihat riwayat setor, tarik, pinjam, bayar angsuran

### 4.3 Profil Saya
- Lihat & edit nama, no WA (email tidak bisa diubah)

---

## 5. TECHNICAL REQUIREMENTS

- **Backend**: FastAPI + SQLAlchemy (SQLite untuk kemudahan)
- **Frontend**: React + Vite (mobile-friendly, Apple-style UI)
- **Auth**: JWT token (email+password, no OTP)
- **Database**: SQLite (cukup untuk <50 orang per komunitas)
- **No Payment Gateway**: Semua transaksi manual (admin catat)
- **No NIK**: Tidak simpan data KTP/identitas sensitif)
- **No OTP**: Login langsung pakai email+password)
- **Port**: Backend 8006 (or 8007 if 8006 in use), Frontend 5173
- **Multi-Community Support**:
  - Settings table untuk branding per komunitas
  - Landing page content bisa di-custom per komunitas
  - Isolation: Setiap komunitas punya data terpisah (tenant isolation)

### 5.1 Termux ARM64 Limitations & Workaround

**KNOWN ISSUE**: Vite development server dan `npm run build` **CRASH** di Termux ARM64 (Illegal instruction - exit code 132).

**Penyebab**: Native modules (esbuild) tidak kompatibel dengan ARM64 Termux.

**SOLUSI**: Gunakan **Express static server** untuk serve frontend:
```bash
cd ~/koperasi_mini/frontend
npm install express
node server.js  # Serve static files di port 5173
```

**Catatan**:
- Frontend code tetep ditulis pakai Vite + React (development di laptop/PC)
- Di Termux, gunakan Express untuk serve build results atau static files
- Alternatif: Build di platform lain, copy hasil build ke Termux

---

## 6. ENTITY RELATIONSHIP (Simpel)

```
Settings (id, community_name, logo_url, primary_color, footer_text, landing_content)
  ↓
Anggota (id, nama, email, password_hash, role, no_wa, status, community_id)
  ↓
Simpanan (id, anggota_id, jenis, nominal, saldo_setelah, keterangan, created_at)
  ↓
Pinjaman (id, anggota_id, nominal, margin_persen, tenor, angsuran_per_bulan, status, created_at)
  ↓
Angsuran (id, pinjaman_id, anggota_id, bulan_ke, nominal, jatuh_tempo, status, tanggal_bayar, denda)
  ↓
Funding (id, anggota_id, nominal, tujuan_usaha, status, created_at)
```

---

## 7. RULES & CONSTRAINTS

- **Satu anggota, satu akun email**
- **Admin adalah yang input semua transaksi** (anggota tidak bisa input)
- **Data sensitif (NIK/KTP) DILARANG disimpan**
- **Maksimal 50 anggota per komunitas** (sesuai kebutuhan koperasi kecil)
- **Flat rate margin** (hitung manual di backend, simpel)
- **Grace period 3 hari** (denda mulai hari ke-4, rate 0.1%/hari)
- **Admin account**: Dibuat oleh pengembang (bukan self-register), diberikan username + password unik
- **Customization**: Harus KUAT dan COMPLETE - identitas masing-masing komunitas ditonjolkan

---

## 8. SUCCESS METRICS

- ✅ Admin bisa input transaksi dalam <2 menit
- ✅ Anggota bisa lihat saldo & kewajiban dalam <10 detik
- ✅ Tidak ada data pribadi sensitif (NIK, KTP) yang tersimpan
- ✅ Sistem bisa handle 50 anggota dengan lancar
- ✅ Mobile-friendly (bisa dipake di HP anggota)
- ✅ Landing page menarik dan bisa di-custom per komunitas
- ✅ Multi-komunitas support dengan branding yang kuat

---

## 9. HACKATHON / SPRINT PLAN

### Sprint 1 (Hari 1-2): Foundation
- [x] Setup project (`koperasi_mini/`)
- [x] Auth system (email+password, JWT)
- [x] Database schema (Anggota, Simpanan, Pinjaman, Angsuran)
- [x] Admin bisa tambah anggota
- [ ] **Settings model untuk multi-komunitas**
- [ ] **Landing page (frontend + backend)**

### Sprint 2 (Hari 3-4): Core Features
- [x] Admin: Input setor & tarik simpanan
- [x] Admin: Input pinjaman + generate jadwal
- [x] Admin: Catat pembayaran angsuran
- [x] Anggota: Dashboard (lihat saldo, piutang, kewajiban)
- [ ] **Dashboard: Salam + Nama di bawah banner kiri**
- [ ] **Landing page: Tombol Daftar/Login + Footer Ardyniech**

### Sprint 3 (Hari 5-6): Transparansi & Polish
- [x] Anggota: Riwayat transaksi
- [x] Admin: Laporan saldo & piutang
- [x] UI/UX: Apple-style, clean, mobile-friendly
- [x] Testing (backend pytest, frontend static guarding)
- [ ] **Admin Tab: Manage Landing Page**
- [ ] **Admin Tab: Settings / Branding (Customization)**
- [ ] **Multi-community support (tenant isolation)**

---

**PRD ini update ke v1.1. Fokus: SIMPEL, TRANSPARENT, NO LEGAL HASSLE, MULTI-COMMUNITY READY.**
