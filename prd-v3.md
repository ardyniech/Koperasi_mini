# PRD v3 - Koperasi Mini Syariah (NullClaw Build Target)

**Project**: Koperasi Mini Syariah (Sharia Cooperative Management System)  
**Target Developer**: NullClaw AI Agent    
**Mentor**: Hermes (Senior Lead Architect)    
**Date**: 2026-05-07  
**Version**: 3.2 (Updated 2026-05-07 - Login.tsx removed, guideNote removed, StoryBehind + ProposalBisnis implemented)

---

## ⚙️ SYSTEM CONFIGURATION

### Ports (Standard)
- **Backend API**: `1982` (FastAPI/Uvicorn)
- **Frontend Dev**: `1985` (Vite Dev Server)
- **Frontend Prod**: `1985` (Preview/Nginx)

### API Base URL
- Development: `http://192.168.1.7:1982/api/v1`
- Frontend Env: `VITE_API_BASE_URL=http://192.168.1.7:1982/api/v1`

### CORS Configuration
- Allowed Origins: `http://192.168.1.7:1985`, `http://127.0.0.1:1985`, `http://localhost:1985`

---

## 🎯 OBJECTIVE

Build/refactor Koperasi Mini Syariah frontend (Vite+React+TypeScript) with **Apple Ultra Modern Design System** applied to ALL pages.

**Core Design Principles** (MUST FOLLOW):
1. **Glassmorphism 3D Effect** - Depth, blur, layered shadows
2. **Floating Elements** - Gentle animations (translate-y, float)
3. **Attractive Pop-up Design** - Modern modals with morph effects
4. **Interactive & Engaging** - Hover states, transitions, micro-interactions
5. **Mobile-First Responsive** - Native APK layout feel

---

## 📋 DESIGN SPECIFICATIONS (APPLE HIG)

### 0. Navigation Consistency (MANDATORY FOR ALL PAGES)

**ALL pages MUST use DashboardLayout wrapper** with the following specifications:

#### A. DashboardLayout Structure
```tsx
import DashboardLayout from '../components/organisms/DashboardLayout';

export default function SomePage() {
  return (
    <DashboardLayout 
      title="Page Title"                    // e.g., "Dashboard", "Kelola Anggota"
      guideNote="Optional guide note"         // e.g., "Simpan/Pinjam hanya diproses oleh admin"
      showBackButton={false}                // true if page needs back navigation
    >
      <div className="p-2 space-y-2">      {/* Standard spacing */}
        {/* Page content with Apple-style */}
      </div>
    </DashboardLayout>
  );
}
```

#### B. Fixed Header (Inside DashboardLayout)
- **Background**: `bg-white/75 backdrop-blur-md` (blur 20px)
- **Border**: `border-b border-slate-200`
- **Height**: `h-12` (48px)
- **Padding**: `px-4 flex items-center justify-between`
- **Position**: `sticky top-0 z-10`
- **Left**: Hamburger Menu icon (lucide-react `Menu`, size 20px) + Title (`text-lg font-semibold text-slate-800`)
- **Right**: User info (name + online status)

#### C. NavPopup (Hamburger Menu - NOT BottomNav)
- **Trigger**: Hamburger icon in header
- **Overlay**: `fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-6`
- **Popup Card**: `glass-card w-72 rounded-3xl p-6 float-animation morph-from-source`
- **Header**: Icon (LayoutDashboard) + "Navigasi" + Close button (X)
- **Navigation Items** (vertical list):
  - Dashboard (`/dashboard`)
  - Management Anggota (`/anggota`)
  - Management Pinjaman (`/pinjaman/approval`)
  - Simpanan (`/simpanan/input`)
  - Dana Patungan (`/project`)
  - Settings (`/settings`)
- **Footer**: User profile + "Profil Saya" (`/about`) + Settings link
- **Styling per item**: `flex items-center space-x-3 text-slate-600 hover:bg-white/70 px-4 py-3 rounded-2xl font-medium text-base transition hover:shadow-lg`

#### D. Scrollable Content Area
- **Container**: `flex-1 flex flex-col overflow-y-auto bg-slate-50`
- **Main Content**: `p-2 space-y-2` (standard spacing for all pages)
- **Cards**: `p-3 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg`
- **Grid**: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2`

#### E. Critical Rules
- **NO floating buttons** anywhere
- **NO BottomNav** anywhere in the project
- **DashboardLayout is MANDATORY** for all pages after login

---

### 1. Global Design Tokens

#### Color Palette
```typescript
// Primary Colors
Primary: '#007aff'       // Apple Blue
Secondary: '#5856d6'     // Purple
Success: '#34c759'       // Green
Warning: '#ff9500'       // Orange
Danger: '#ff3b30'        // Red

// Neutral Colors
Background: '#f5f5f7'    // Light Gray (page background)
Card BG: 'rgba(255, 255, 255, 0.95)'  // Glass white
Glass Border: 'rgba(255, 255, 255, 0.18)'
Text Primary: '#1d1d1f'   // Near black
Text Secondary: '#86868b' // Gray
Text Muted: '#6B7280'     // Slate 500

// Semantic Colors
Emerald-100: '#d1fae5'
Emerald-600: '#059669'
Indigo-100: '#e0e7ff'
Indigo-600: '#4f46e5'
Amber-100: '#fef3c7'
Amber-600: '#d97706'
```

#### Typography
```typescript
// Font Family
Font Family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'

// Type Scale (Use Tailwind classes)
xs: 12px   // text-xs (for captions, badges)
sm: 14px   // text-sm (for body text)
base: 16px // text-base (default)
lg: 18px   // text-lg (subheadings)
xl: 20px   // text-xl
2xl: 24px  // text-2xl (page titles)
3xl: 32px  // text-3xl

// Font Weight
font-medium: 500
font-semibold: 600
font-bold: 700

// Line Height
leading-relaxed: 1.625
leading-snug: 1.375
```

#### Spacing System (MANDATORY)
```typescript
// Base Unit: 4px (Tailwind default)

// Main Content (ALL pages)
Main Container: p-2 space-y-2  // 8px padding, 8px gap between sections

// Cards
Card Padding: p-3              // 12px
Card Radius: rounded-3xl        // 24px (Apple style)
Card Shadow: shadow-lg          // subtle depth

// Grid Gaps
Grid: gap-2                    // 8px between cards

// Header
Header Height: h-12            // 48px
Header Padding: px-4            // 16px left/right

// Buttons
Button Padding: px-4 py-3      // 16px horizontal, 12px vertical
Button Radius: rounded-2xl      // 16px
```

#### Border Radius
```typescript
Small: 12px   // rounded-xl
Medium: 16px  // rounded-2xl
Large: 24px   // rounded-3xl (cards, modals)
XLarge: 32px  // rounded-3xl (some special cases)
Full: 9999px  // rounded-full (avatars)
```

---

### 2. Glassmorphism 3D Effect (MANDATORY for all cards/modals)

```typescript
// Standard Glass Card (use class: glass-card)
.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.08),
    0 1px 3px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
}
```

Applied to:
- All stat cards on Dashboard
- All form containers
- All table containers
- All modal/popup content

---

### 3. Floating Effect (ADD TO ALL BUTTONS & CARDS)

```css
/* In index.css */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Hover Effect for Cards */
.hover\:scale-\[1\.02\]:hover {
  transform: scale(1.02);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
}
```

Applied to:
- Stat cards: `hover:scale-[1.02] transition-all duration-200`
- Buttons: `hover:scale-[1.02] hover:shadow-lg`
- Navigation items: `hover:shadow-lg`

---

### 4. Pop-up / Modal Design (ALL POPUPS MUST MATCH)

```typescript
// Modal Overlay
// className: "fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-6"
{
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
}

// Modal Content (Glass + 3D)
// className: "glass-card w-72 rounded-3xl p-6 float-animation morph-from-source"
{
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(40px)',
  WebkitBackdropFilter: 'blur(40px)',
  borderRadius: 24,
  padding: 24,
  width: '100%',
  maxWidth: 320,
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.6)',
  animation: 'float 3s ease-in-out infinite',
}
```

**Morph Animation**:
- Set `--morph-origin` CSS variable for direction
- Example: `style={{ '--morph-origin': 'top left' }}`

---

### 5. Button Styles (ALL BUTTONS)

```typescript
// Primary Button (Gradient + Shadow + Float)
// className: "px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
{
  background: 'linear-gradient(135deg, #007aff 0%, #5856d6 100%)',
  boxShadow: '0 4px 12px rgba(0, 122, 255, 0.3), 0 1px 3px rgba(0, 0, 0, 0.08)',
  borderRadius: 16,  // rounded-2xl
  fontWeight: 600,
  fontSize: 17,
  color: 'white',
  padding: '12px 32px',  // px-8 py-3
  transition: 'all 0.3s ease',
  cursor: 'pointer',
}
// Hover: translate-y -2px, scale(1.02)
// Active: scale(0.98)

// Secondary Button
// className: "px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors duration-150"
{
  padding: '6px 12px',
  borderRadius: 12,  // rounded-xl
  fontSize: 12,  // text-xs
  fontWeight: 500,
  transition: 'background-color 0.15s ease',
}

// Danger Button
// className: "px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors duration-150"
```

---

### 6. Input Fields (ALL INPUTS)

```typescript
// Input Container
// className: "w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl text-base focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
{
  width: '100%',
  padding: '12px 16px',  // px-4 py-3
  background: 'rgba(255, 255, 255, 0.5)',
  border: '1.5px solid #e2e8f0',  // border-slate-200
  borderRadius: 16,  // rounded-2xl
  fontSize: 16,  // text-base
  transition: 'all 0.2s ease',
}
// Focus: border-color #007aff, box-shadow 0 0 0 3px rgba(0, 122, 255, 0.2)
```

---

### 7. Table Styles (ALL TABLES)

```typescript
// Table Container
// className: "w-full text-left overflow-x-auto"
// Table: "w-full text-sm text-left"

// Table Header
// className: "bg-slate-50/40 text-xs font-bold uppercase tracking-wider text-slate-500"
{
  backgroundColor: 'rgba(248, 250, 252, 0.4)',  // bg-slate-50/40
  fontSize: 12,  // text-xs
  fontWeight: 700,  // font-bold
  textTransform: 'uppercase',
  letterSpacing: '0.05em',  // tracking-wider
  color: '#6B7280',  // text-slate-500
}

// Table Header Cells
// className: "px-4 py-2.5 font-semibold"

// Table Body Rows
// className: "hover:bg-white/50 transition-colors duration-150"
{
  transition: 'background-color 0.15s ease',
}
// className: "border-b border-slate-100/60"

// Table Cells
// className: "px-4 py-3 font-medium text-slate-800 text-sm"
```

---

### 8. Badge Styles (STATUS INDICATORS)

```typescript
// Success Badge (Active, Approved)
// className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700"

// Warning Badge (Pending)
// className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700"

// Danger Badge (Rejected, Inactive)
// className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700"

// Info Badge (Admin, Member)
// className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
```

---

## 📄 PAGES TO BUILD/REFACTOR (ALL PAGES)

### 1. LandingPage.tsx (LOCKED - DO NOT MODIFY)
- **Status**: LOCKED (2026-05-02) DO NOT MODIFY (EXCEPT Login button + popup - see below)
- **Spec**: Apple Ultra Modern, Mosque w-48 h-48 left-[-8px] top-[-16px], HijabCartoon w-16 h-16, buttons horizontal
- **Note**: This page is an example of Apple Ultra Modern style, but the PRD itself is the authority
- **Login Feature (2026-05-08)**: 
  - Login button (glass-gold variant) next to "Daftar" button
  - Login Popup (Apple Style): fixed inset-0, glass-card w-80 rounded-3xl p-6, email/password form, "Login Sekarang" button
  - **LOGIN METHOD: EMAIL ONLY** (valid email format via `type="email"` input, NO phone number support)
  - Backend still accepts `identifier` field (email or phone), but frontend ONLY sends email
  - On success: `localStorage.setItem('token'); window.location.href = '/dashboard'`
  - Popup design SAME AS BEFORE (jangan diubah)
- **ChangeLog (2026-05-07)**: Added Login button + popup (because Login.tsx removed, no separate login page)
- **See More Details Feature (2026-05-07)**:
  - "See more details" link with hijab cartoon icon + ping animation
  - Opens DetailsPopup with 3 links:
    - Creator Info & Donasi (Heart icon) → `/creator-info`
    - Struktur Organisasi (Building2 icon) → `/organization-structure`  
    - Story Behind (BookOpen icon) → `/story-behind`
  - DetailsPopup: fixed inset-0, glass-effect, 3 link cards with icons, `float-animation`
- **New Pages (2026-05-07)**:
  - `CreatorInfo.tsx` - Creator info + donation link (Saweria), **PUBLIC ACCESS** (no login required)
  - `OrganizationStructure.tsx` - Org structure, editable via Settings (admin)
  - `StoryBehind.tsx` - **LOCKED Personal Story** (NOT editable by admin):
    * "Monumen Bertahan Hidup: Di Balik Koperasi Mini"
    * Personal journey: Sony Vaio tua, titik nadir, ngetik di layar sempit
    * Quote below title: *"Bukan basa-basi seperti kebanyakan apps dan cerita visi misi yang membosankan. Ini adalah cerita ku sendiri."*
    * QRIS image (`/qris-image.jpg`) hardcoded - already added, NOT replaceable by admin
    * **PUBLIC ACCESS** (no login required)
    * **LOCKED**: Only code-level changes allowed, NOT via Settings

### 2. Register.tsx ONLY (Login.tsx REMOVED by user request)
- **Login.tsx**: REMOVED (user intentionally deleted it - see Change Log)
- **Register.tsx**: 
  - **Layout**: MUST use DashboardLayout (NOT LoginLayout/RegisterLayout)
  - **Design**: Glassmorphism card centered, floating animation
  - **Input Fields**: Apple-style with focus states (border-color #007aff, box-shadow)
  - **Buttons**: Gradient primary, floating effect
  - **NO LOGIN TOGGLE** (login now in LandingPage popup)
  - **Show Back Button**: true (back to LandingPage)

### 3. Dashboard.tsx ✅ **IMPLEMENTED (2026-05-07)**
- **Layout**: Uses DashboardLayout (which uses Banner atom with 3 elements: Hamburger, Title, User info)
- **Stat Cards**: Glass effect, 3D shadow, floating animation, `p-3 rounded-3xl`
- **Transaction Table**: Modern rows, hover:bg-gray-50, use Table Styles from Section 7
- **Status**: ✅ COMPLETE - Refactored to use DashboardLayout + Banner atom

### 4. All Feature Pages (MUST APPLY SAME DESIGN)
- SimpananInput.tsx
- SaldoView.tsx
- PinjamanInput.tsx
- AngsuranInput.tsx
- FundingInput.tsx
- KewajibanView.tsx
- Riwayat.tsx
- Approval.tsx
- AnggotaManage.tsx
- About.tsx ✅ **IMPLEMENTED (2026-05-07)** - Dynamic user profile from /auth/me
- StoryBehind.tsx ✅ **IMPLEMENTED (2026-05-07)** - **LOCKED Personal Story** (PUBLIC, tdk bisa di-edit admin)
- CreatorInfo.tsx ✅ **IMPLEMENTED (2026-05-07)** - Creator info + donation (PUBLIC ACCESS)
- OrganizationStructure.tsx ✅ **IMPLEMENTED (2026-05-07)** - Org structure (editable via Settings)
- Project.tsx
- ProposalBisnis.tsx ✅ **IMPLEMENTED (2026-05-07)** - Apple-style, DashboardLayout
- SettingsManage.tsx

**Each page MUST have**:
1. DashboardLayout wrapper (title ONLY, NO guideNote - removed by user request)
2. Main content: `p-2 space-y-2`
3. Cards: `p-3 rounded-3xl glass-card`
4. Glassmorphism containers
5. Floating elements (buttons, cards with hover:scale-[1.02])
6. Interactive hover/click states
7. Responsive layout (mobile-first)

---

### 9. Image Guidelines (MANDATORY)
```typescript
// Image Optimization Rules
- Format: WebP (convert JPG/PNG via ffmpeg)
- Max Size: 400x400px for QRIS, 80x80px for avatars
- Aspect Ratio: 1:1 for QRIS (object-fit: contain)
- Compression: 75% quality (save 50-75% file size)

// Author Photo (About.tsx, StoryBehind.tsx)
className: "w-20 h-20 rounded-full overflow-hidden border-4 border-indigo-100"
// Clickable in About.tsx:
onClick={() => navigate('/story-behind')}
className: "cursor-pointer hover:shadow-md transition-all duration-200"

// QRIS Image (About.tsx)
<div className="w-48 h-48 rounded-2xl overflow-hidden bg-white p-4 shadow-sm">
  <img src="/src/assets/qris-donasi.webp" alt="QRIS Donasi" className="w-full h-full object-contain" />
</div>
className: "flex justify-center mb-4"

// Icons: Use Lucide React (vector) - NO image icons
import { Menu, X, Users, etc. } from 'lucide-react';
```

---

### 10. Morph Animation Origins (MANDATORY for Popups)
```typescript
// Set --morph-origin CSS variable for animation direction

// NavPopup (from Hamburger in header)
style={{ '--morph-origin': 'top left' }}

// Saldo Popup (from Stat Card)
style={{ '--morph-origin': 'center' }}

// Edit Modal (from Button)
style={{ '--morph-origin': 'top right' }}

// Delete Confirmation (from Button)
style={{ '--morph-origin': 'bottom center' }}

// Apply to all popups:
className="glass-card w-72 rounded-3xl p-6 float-animation morph-from-source"
```

---

### 11. Page-Specific Design Specs (ALL PAGES)

#### Login.tsx / Register.tsx (Auth Pages)
```tsx
// Layout: DashboardLayout with special handling
<DashboardLayout 
  title="Login"  // or "Register"
  guideNote="Masuk untuk mengakses sistem"
  showBackButton={true}
  onBack={() => navigate('/')}  // Back to LandingPage
>
  <div className="p-2 space-y-2">
    {/* Glass Card Centered */}
    <div className="max-w-md mx-auto">
      <div className="glass-card rounded-3xl p-6 shadow-xl border border-white/30">
        {/* Form Inputs (Section 6) */}
        {/* Buttons (Section 5 - Primary) */}
      </div>
    </div>
  </div>
</DashboardLayout>
```
**Special Rules for Auth Pages:**
- Hide NavPopup (or disable hamburger click) - user not logged in yet
- Don't show user info in header (no name/role)
- Back button MUST point to '/' (LandingPage)
- NO NavPopup items (Dashboard, Anggota, etc.) because not authenticated

#### Dashboard.tsx (CRITICAL - MUST REFACTOR)
```tsx
// CURRENTLY BROKEN: Does NOT use DashboardLayout
// MUST CHANGE TO:
<DashboardLayout 
  title="Dashboard"
  guideNote="Simpan/Pinjam hanya diproses oleh admin koperasi"
>
  <div className="p-2 space-y-2">
    {/* Stat Cards Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      <div className="glass-card p-3 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02]">
        {/* Card content */}
      </div>
    </div>
    
    {/* Transaction Table */}
    <div className="glass-card rounded-3xl shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100/80 flex items-center justify-between bg-white/30">
        <h2 className="text-sm font-bold text-slate-800 tracking-tight">Transaksi Terbaru</h2>
      </div>
      <div className="overflow-x-auto">
        {/* Table (Section 7) */}
      </div>
    </div>
  </div>
</DashboardLayout>
```
**CRITICAL:** Dashboard.tsx currently builds its OWN header + NavPopup. MUST refactor to use DashboardLayout!

#### StoryBehind.tsx (NEW - Emotional Story Page)
```tsx
<DashboardLayout 
  title="The Story Behind"
  guideNote="Perjalanan hidup membangun Koperasi Mini Syariah"
>
  <div className="p-2 space-y-2">
    {/* Author Profile (Centered) */}
    <div className="glass-card rounded-3xl p-3 text-center">
      <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-indigo-100 mb-3 mx-auto">
        <img src="/author.jpg" alt="Ardy" className="w-full h-full object-cover" />
      </div>
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Ardy</h1>
      <p className="text-sm text-slate-500">Founder & Lead Developer</p>
    </div>
    
    {/* Story Content */}
    <div className="glass-card rounded-3xl p-3">
      <article className="space-y-4 text-sm text-slate-600 leading-relaxed">
        {/* Story paragraphs */}
      </article>
    </div>
    
    {/* Call to Action */}
    <div className="glass-card rounded-3xl p-3 text-center">
      <h3 className="text-lg font-semibold text-slate-800 mb-2">Dukung Perjuangan Ini ❤️</h3>
      <p className="text-sm text-slate-600 mb-3">
        Jika Anda tersentuh dengan cerita ini, silakan kunjungi halaman 
        <span className="font-medium text-indigo-600">"Tentang Koperasi"</span> untuk donasi.
      </p>
      <button 
        onClick={() => navigate('/about')}
        className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-2xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
      >
        Donasi Sekarang →
      </button>
    </div>
  </div>
</DashboardLayout>
```

#### About.tsx (Author Profile + Donation)
```tsx
<DashboardLayout 
  title="Tentang Koperasi"
  guideNote="Profil pengembang dan informasi donasi"
>
  <div className="p-2 space-y-2">
    {/* Author Profile - CLICKABLE to StoryBehind */}
    <div 
      className="glass-card rounded-3xl p-3 text-center cursor-pointer hover:shadow-md transition-all duration-200"
      onClick={() => navigate('/story-behind')}
      title="Click to read the story behind"
    >
      <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-4 border-indigo-100">
        <img src="/author.jpg" alt="Author" className="w-full h-full object-cover" />
      </div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Author Profile</h1>
      <p className="text-slate-600 mb-1">Koperasi Mini Syariah - Developer & Contributor</p>
      <p className="text-xs text-indigo-600 font-medium">Click to read the story behind →</p>
    </div>
    
    {/* Donation Section */}
    <div className="glass-card rounded-3xl p-3">
      <h3 className="text-lg font-semibold text-slate-700 mb-3">Donasi / Buy Me a Coffee</h3>
      <p className="text-sm text-slate-500 mb-4">Dukung pengembangan Koperasi Mini Syariah</p>
      {/* QRIS Image (Section 9) */}
      <p className="text-xs text-slate-400 text-center">Scan QRIS untuk donasi</p>
    </div>
    
    {/* About Text */}
    <div className="glass-card rounded-3xl p-3">
      <h3 className="text-lg font-semibold text-slate-700 mb-3">Tentang Koperasi Mini</h3>
      <p className="text-sm text-slate-600 leading-relaxed">
        Koperasi Mini Syariah adalah aplikasi manajemen koperasi modern...
      </p>
    </div>
  </div>
</DashboardLayout>
```

#### Riwayat.tsx (Transaction History)
```tsx
<DashboardLayout 
  title="Riwayat Transaksi"
  guideNote={currentUser?.role === 'admin' ? 'Semua transaksi koperasi (admin view)' : 'Riwayat transaksi Anda'}
>
  <div className="p-2 space-y-2">
    {/* Header */}
    <div className="border-b border-white/20 pb-4">
      <h2 className="text-2xl font-bold text-slate-800 mb-1">📋 Riwayat Transaksi</h2>
      <p className="text-sm text-slate-500">
        {currentUser?.role === 'admin' ? 'Semua transaksi (admin view)' : 'Riwayat transaksi Anda'}
      </p>
    </div>
    
    {/* Transaction List (use TransactionCard atom) */}
    <div className="space-y-2">
      {transactions.map((tx) => (
        <TransactionCard key={`${tx.type}-${tx.id}`} tx={tx} />
      ))}
    </div>
  </div>
</DashboardLayout>
```
**Note:** Replace inline styles (styles.header, styles.title) with Tailwind classes!

#### SettingsManage.tsx (Admin Settings)
```tsx
<DashboardLayout 
  title="Settings"
  guideNote="Pengaturan koperasi. Hanya admin yang dapat mengubah settings."
>
  <div className="max-w-4xl mx-auto px-6 py-8">
    {/* Header */}
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-slate-800">⚙️ Settings</h1>
      <p className="text-slate-500 mt-2">Kelola pengaturan aplikasi Koperasi Mini Syariah</p>
    </div>
    
    {/* Main Card */}
    <div className="glass-card rounded-3xl p-8 shadow-xl border border-white/30">
      <SettingsTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="mt-8">
        {/* Tab Content */}
      </div>
    </div>
  </div>
</DashboardLayout>
```

---

## 🧩 ATOMIC DESIGN STRUCTURE (NULLCLAW MUST CREATE)

### Atoms (`src/components/atoms/`)
- **Button.tsx**: Gradient primary, floating animation, hover:scale-[1.02]
- **Input.tsx**: Apple-style focus (border-indigo-500, ring-indigo-500/20)
- **Badge.tsx**: Status indicators (success/warning/danger/info)
- **Icon.tsx**: Lucide React wrappers with consistent sizing
- **Banner.tsx**: Banner with 3 elements (Hamburger icon, Title page, User info) - used in DashboardLayout

### Molecules (`src/components/molecules/`)
- **StatCard.tsx**: Glass + floating, `p-3 rounded-3xl`, icon container `w-10 h-10 rounded-2xl`
- **FormField.tsx**: Label + input + error, consistent spacing
- **NavItem.tsx**: Sidebar/menu item with hover effects
- **Alert.tsx**: Notification bubble with glass effect

### Organisms (`src/components/organisms/`)
- **NavPopup.tsx**: Glass + morph animation, `w-72 rounded-3xl p-6`
- **DashboardLayout.tsx**: Uses Banner atom + NavPopup + UserSettingsPopup
- **Banner.tsx**: Atom with 3 elements (Hamburger icon, Title page, User info)
- **UserSettingsPopup.tsx**: User settings popup (photo upload, change email/password, save button)
- **DashboardStats.tsx**: Grid of StatCards (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2`)
- **TransactionTable.tsx**: Modern table with Table Styles from Section 7
- **Footer.tsx**: Compact, with QRIS placeholder if needed

---

## 🚀 WORKFLOW FOR NULLCLAW

### Step 1: Read & Understand
1. Read this PRD_v3_NullClaw.md **completely** (this is the ONLY reference)
2. Read `SOUL.md` for coding standards
3. **DO NOT reference LandingPage.tsx or Dashboard.tsx as "acuan"** - this PRD is the authority

### Step 2: Create Atomic Components
1. Build atoms → molecules → organisms
2. Test each component with `npx tsc --noEmit`
3. Verify with `npx eslint src/`

### Step 3: Refactor All Pages
1. Start with Dashboard.tsx (CRITICAL: it doesn't use DashboardLayout yet!)
2. Apply glass + floating + pop-up design
3. Get mentor (Hermes) approval BEFORE proceeding to other pages
4. After approval, roll out to ALL pages using `multi-file-edit-workflow` skill

### Step 4: Verification (MANDATORY)
After EVERY page refactored:
```bash
cd ~/.nullclaw/workspace/koperasi_mini/frontend
npx tsc --noEmit  # 0 TypeScript errors
npx eslint src/     # 0 ESLint errors
```

### Step 5: Update task.html
- Log progress in `task.html` (Machine: NullClaw workspace)
- Checklist format
- Mark complete after verification

---

## 📱 PWA (Progressive Web App) Setup

Koperasi Mini Syariah sekarang mendukung PWA (Progressive Web App) biar user bisa "Install to Home Screen" dan pake aplikasi kayak native app.

### 1. Plugin & Configuration
- **Plugin**: `vite-plugin-pwa` (installed)
- **Config**: `vite.config.js` sudah diupdate dengan `VitePWA` plugin
- **Manifest**: Generated otomatis oleh plugin (theme color, icons, display: standalone)
- **Service Worker**: Auto-generated (`sw.js`, `workbox-*.js`) untuk caching assets

### 2. PWA Features
- ✅ **Installable**: User bisa install web app ke HP/desktop (icon muncul di home screen)
- ✅ **Offline-ready**: Service worker cache assets (JS, CSS, HTML, images) - app bisa dibuka walau offline
- ✅ **Standalone mode**: Pas dibuka dari icon terinstall, address bar browser hilang (full-screen kayak native app)
- ✅ **Push Notifications**: Ready (kapanpun bisa ditambah)
- ✅ **App Icons**: 192x192 & 512x512 (ada di `public/icon-*.png`)

### 3. Meta Tags (index.html)
```html
<meta name="theme-color" content="#007aff" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="Koperasi Mini" />
```

### 4. PWA Checklist
✅ `vite-plugin-pwa` installed  
✅ `vite.config.js` updated dengan PWA plugin  
✅ Icons (192x192, 512x512) tersedia di `public/`  
✅ `index.html` punya PWA meta tags  
✅ Build generates `sw.js`, `manifest.webmanifest`, `registerSW.js`  
✅ `maximumFileSizeToCacheInBytes` set to 5MB (cache gambar besar)  

### 5. User Experience
- Pas user buka web, bakal muncul prompt "Add to Home Screen" (di browser modern)
- Kalo diinstall, app bakal jalan standalone (tanpa address bar)
- Service worker cache semua assets → loading cepet, bisa offline
- Update service worker otomatis (set `registerType: 'autoUpdate'`)

---

## 📱 SPA (Single Page Application) & App Shell Architecture

SPA adalah kunci utama biar web app kerasa mulus banget. Penjelasannya:

### 1. SPA Core Concept
- **No Reloads**: HTML kerangka di-load cuma sekali di awal. Pas pindah menu, JavaScript cuma merender ulang komponen tertentu & narik data aja. Transisi instan!
- **Client-Side Routing**: URL di address bar tetep berubah (`/dashboard` → `/settings`), navigasi back/forward HP berfungsi normal, tapi halaman **tetep gak reload** sama sekali ke server.
- **React Standard**: Pakai React + React Router, arsitektur SPA emang udah jadi standar kerjanya.

### 2. App Shell Architecture
- **Instant Loading**: "Kerangka" UI (header, navigation, layout structure) di-cache Service Worker. Pas web app dibuka, tampilan langsung kelihatan ready secara instan.
- **Skeleton Loading**: Sambil nunggu data dari backend (FastAPI), tampilin skeleton loading/shimmer/Spinner.
- **Implementation**: App Shell = `DashboardLayout` (header + nav) + bottom routing. Content di-dynamic render.

### 3. Native-like UI/UX & Interactions
Feel aplikasi sangat dipengaruhi visual & interaksi sentuhan:
- **Glassmorphism**: Efek blur 20px, transparan backgrounds
- **Smooth Borders**: Border-radius membulat mulus (24px / `rounded-3xl`)
- **Borderless Layout**: Clean macOS-style, minimal lines
- **Touch Feedback**: Active states, ripple-like effects pas tombol ditekan

**Kombo Maut**: React (SPA) + PWA + App Shell + UI/UX Smooth = 80% perjalanan buat bikin web apps rasa APK!

---

## 🌶️ "Bumbu Rahasia" - 99% Native Feel

Kalo mau ngejar feel 99% yang bener-bener mulus layaknya aplikasi native tanpa cacat, ini "bumbu rahasia" di frontend yang wajib diperhatikan:

### 1. Optimistic UI (UI Optimistis)
**Trik manipulasi psikologi user**: Pas user ngeklik "Save" / "Like", UI harus langsung berubah jadi "Saved/Liked" **detik itu juga**, gak peduli proses nembak API ke backend masih jalan di belakang. 
- **Jangan**: Nunggin response server baru UI berubah → bakal ada delay sekian milidetik yang bikin user sadar "Ini mah website."
- **Implementasi**: Update Zustand store langsung, trigger API di background. Kalau API gagal, rollback UI + show error toast.

### 2. Touch Gestures & Interaksi Sentuhan
Aplikasi native hidup dari sentuhan, bukan klik mouse:
- **Pull-to-Refresh**: Tarik ke bawah buat reload data
- **Swipe-to-Delete**: Gesek item list buat hapus
- **Pinch-to-Zoom**: Di gambar/barcode
- **CSS Touch Action**: `touch-action: manipulation` biar gak ada 300ms delay

### 3. Page Transitions & 60fps Animations
SPA emang bikin pindah halaman jadi instan, tapi kalo tiba-tiba "jreng" berubah gitu aja, tetep kerasa kaku.
- **Slide Transitions**: Pakai Framer Motion (React) - slide dari kanan ke kiri ala iOS/Android
- **Hardware Acceleration**: Pastiin animasi pakai CSS `transform` & `opacity` biar dapet 60fps
- **JANGAN**: Pernah nganimasiin `margin`, `padding`, `width/height` → bakal patah-patah (janky)

### 4. State Management yang Solid
Biar data antar komponen gampang ngobrolnya secara real-time. Mengingat kita pakai pendekatan Modular-Granular & Atomic Design, state management (Zustand atau React Context) ini krusial.
- **Example**: Pas user update nama di halaman "Settings", detik itu juga nama di komponen "Header/Navbar" harus ikut berubah tanpa perlu refresh.
- **Implementation**: Zustand (pilih ini - lebih ringan dari Redux) atau React Context buat global state.

### 5. Code Splitting & Lazy Loading
Kalo web apps makin gede, ukuran file JavaScript bakal bengkak. Biar pas pertama kali dibuka (di-load) tetep ngebut ala aplikasi:
- **React.lazy()**: Halaman yang belum dibuka user, jangan di-load dulu di awal
- **Suspense**: Tampilin loading spinner pas chunk baru di-download
- **Route-based Splitting**: Tiap route (`/dashboard`, `/settings`) jadi chunk terpisah

**Ibarat mobil**: PWA dan SPA itu "mesin"-nya, nah 5 poin di atas ini "suspensi"-nya biar jalan mulus tanpa kerasa gajlukan.

---

## 🗄️ DATABASE ARCHITECTURE

Untuk web apps yang mengurusi banyak data transaksional atau operasional (pencatatan, user management, sistem koperasi), diperlukan database relasional yang tangguh. Berikut arsitektur database Koperasi Mini Syariah:

### 1. Database Engine (PostgreSQL)
**Standar industri** untuk aplikasi yang butuh performa tinggi menangani banyak request bersamaan.
- **Kenapa?** Struktur data rapi, performa tinggi, gampang diintegrasi ke platform cloud modern (Supabase, Railway) untuk deployment.
- **Current State:** SQLite (development), migrasi ke PostgreSQL untuk production.

### 2. ORM (Object-Relational Mapper)
Bridge antara kode Python (FastAPI) dan database tanpa query SQL manual yang ribet.
- **Rekomendasi:** SQLModel atau SQLAlchemy. SQLModel adalah pilihan terbaik (dibuat oleh pencipta FastAPI), integrasi seamless, validasi data otomatis via Pydantic.

### 3. Database Migration Tool (Alembic)
Ibarat "Git" khusus untuk database. Saat development, sering ada penambahan kolom, ubah tipe data, atau bikin tabel baru.
- **Fungsi:** Alembic mencatat semua riwayat perubahan struktur database. Jika deploy ke server atau butuh rollback pas error, struktur database tetap aman dan rapi tanpa takut data ilang.
- **Current State:** Masih pakai `db.create_all()` (development only), akan migrasi ke Alembic untuk production.

### 4. Real-time Capabilities (WebSockets / Supabase Realtime)
Aplikasi native itu datanya kerasa *live*. Jika ada data baru masuk ke database, UI di layar harus langsung update detik itu juga tanpa perlu direfresh.
- **Implementasi:** Setup WebSockets langsung di FastAPI, atau manfaatkan fitur realtime bawaan Supabase (jalur ninja yang lebih praktis). Saat ada baris data berubah di PostgreSQL, frontend React langsung nerima sinyalnya.

### 5. Local Database di Frontend (Offline Sync)
Penyempurna PWA. Biar web apps tetap bisa nampilin data walau HP susah sinyal (atau buka app pas offline), butuh tempat nyimpen data sementara di HP user.
- **Implementasi:** Pakai IndexedDB bawaan browser (dibantu library **Dexie.js** di React). Alur: User input data pas offline → Data masuk ke IndexedDB lokal → Pas dapet sinyal, script di background otomatis ngelempar (sync) data ke API FastAPI buat disimpen permanen di PostgreSQL.

### Arsitektur Database Diagram
```
[React Frontend] ←→ [FastAPI Backend] ←→ [PostgreSQL]
       ↓ (Dexie.js)                     ↑ (WebSockets/Supabase Realtime)
[IndexedDB Local]                       [Alembic Migrations]
```

---

## ⚡ BACKEND ARCHITECTURE (Native Feel Optimizations)

Backend ibarat "otak dan otot" di balik layar. Biar feel APK native makin berasa di frontend, backend harus super responsif dan pantang ngasih delay.

### 1. Asynchronous Processing (Wajib `async/await`)
Aplikasi native nuntut kecepatan instan. Karena Koperasi Mini pakai FastAPI, PASTIKAN endpoint yang narik data atau melakukan I/O (DB query, external API) dibangun pakai `async def`.
- **Manfaat:** Server gak "bengong" nunggu satu request selesai. Response time tetep ngebut biarpun traffic rame.
- **Current State:** FastAPI default sudah async-ready. Review semua endpoint pastikan tidak ada blocking call (pakai `asyncio.to_thread` untuk operasi sync).

### 2. Background Tasks buat Proses Berat
Jangan pernah nahan response API untuk proses makan waktu (contoh: generate laporan, eksekusi script AI/Hermes).
- **Implementasi:** Pakai `BackgroundTasks` bawaan FastAPI atau message broker (Celery/RQ).
- **Flow:** Lempar proses berat ke background → Balikin status HTTP **202 Accepted** secepatnya ke frontend → UI kasih notif "Sedang diproses" (bukan spinner muter terus).
- **Result:** User tetep bisa lanjut pake app tanpa ngerasa "hang".

### 3. Struktur Response API yang Rigid (Pydantic)
Aplikasi native gampang crash kalau nerima format JSON berubah-ubah. Response HARUS konsisten.
- **Standard Schema:**
```python
from pydantic import BaseModel

class ApiResponse(BaseModel):
    status: str  # "success" | "error"
    data: any    # payload data
    message: str # human-readable message
    code: int    # HTTP status code
```
- **Manfaat:** Komponen React selalu tau cara parsing data tanpa error dadakan.

### 4. Stateless Authentication (JWT)
Hindari ngecek database tiap ada request masuk (session-based).
- **Implementasi:** Pakai JWT (JSON Web Tokens) yang sudah diimplementasi di FastAPI.
- **Flow:** Token disimpen aman di client (localStorage/IndexedDB) → FastAPI verifikasi validitas token secara matematis (tanpa DB lookup tiap request).
- **Manfaat:** Jauh lebih ringan, kenceng, dan emang standar buat mobile app.

### 5. Pagination & Payload Optimization
Jangan tarik semua data sekaligus (misal: list 10rb transaksi).
- **Pagination:** Wajib pakai `limit` & `offset` (atau cursor-based) di semua endpoint list.
- **Payload Minimization:** 
  - Gunakan Pydantic `response_model` yang hanya include field yang dibutuhkan frontend.
  - Compress JSON response jika perlu (gzip/brotli).
- **Manfaat:** Makin kecil ukuran data, makin cepet render di HP.

### 6. Caching Strategy
Kurangi beban database dengan cache data yang sering diakses (settings, profile user, dashboard stats).
- **Tools:** `aiocache` atau Redis (untuk production).
- **TTL:** Set time-to-live (misal: 5 menit) biar data tetep fresh tapi nggak nembak DB terus.

**Intinya:** Arsitektur backend harus didesain untuk **"tembak dan lari"** — ngasih jawaban (data/status) secepat mungkin ke user, dan biarin kerjaan berat diselesain di belakang layar.

---

## 📝 CHANGELOG (Updated 2026-05-07)

### Change 1: Login.tsx REMOVED
- **Date**: 2026-05-07
- **Action**: Login.tsx deleted (user intentionally removed it)
- **Reason**: User explicitly said "login page sebelumnya aq buang" - it was intentionally removed before
- **Impact**: 
  - Removed Login.tsx file
  - Removed `/login` route from App.tsx
  - Updated PRD to mark Login.tsx as REMOVED
- **Status**: ✅ Complete

### Change 2: guideNote Prop REMOVED from DashboardLayout
- **Date**: 2026-05-07
- **Action**: Removed `guideNote` prop from DashboardLayout.tsx and all pages
- **Reason**: User said "guide note di hilangkan dr dashboard"
- **Impact**:
  - Removed `guideNote?: string` from DashboardLayoutProps interface
  - Removed guideNote rendering from DashboardLayout component
  - Updated StoryBehind.tsx, ProposalBisnis.tsx to remove guideNote prop
  - Updated PRD v3 to remove all guideNote references
- **Status**: ✅ Complete

### Change 3: New Pages Added (StoryBehind.tsx, ProposalBisnis.tsx)
- **Date**: 2026-05-07
- **Action**: Created StoryBehind.tsx and ProposalBisnis.tsx with Apple-style design
- **Specs**: DashboardLayout wrapper, glass-card, floating elements
- **Routes**: Added `/story-behind` and `/proposal-bisnis` to App.tsx
- **Status**: ✅ Complete (pending Playwright UX audit)

---

## ⚠️ CONSTRAINTS & RULES

1. **I (Hermes) will NOT touch code** - Only guide, review, audit
2. **NullClaw MUST read full files** before patching (no partial reads)
3. **Post-patch verification mandatory** - tsc + eslint after every change
4. **No hardcoded values** - Use environment variables
5. **Mobile-first** - Test on Chrome DevTools (320px width)
6. **LandingPage.tsx LOCKED** - DO NOT MODIFY (reference only, but PRD is authority)
7. **Dashboard.tsx MUST be refactored** to use DashboardLayout (currently doesn't!)

---

## 📊 SUCCESS CRITERIA

✅ All pages use DashboardLayout + NavPopup (NOT BottomNav)  
✅ All pages use Glassmorphism 3D effect  
✅ All buttons have floating animation (hover:scale-[1.02])  
✅ All pop-ups match Apple-style design (glass-card, morph animation)  
✅ All pages pass `tsc --noEmit` (0 errors)  
✅ All pages pass `eslint src/` (0 errors)  
✅ task.html updated with progress  
✅ Mobile responsive (320px-768px)  
✅ Spacing consistent: `p-2 space-y-2` main, `p-3 rounded-3xl` cards, `gap-2` grid  

---

## 🤝 MENTOR-STUDENT DYNAMICS

**Hermes (Mentor)**:
- Guides NullClaw on design principles
- Reviews code (audit only, no direct edits)
- Approves progression to next phase
- Provides feedback on UX/UI

**NullClaw (Student/Builder)**:
- Reads PRD and implements (PRD is the authority, NOT other pages)
- Creates atomic components
- Refactors pages one-by-one
- Runs verification (tsc, eslint)
- Updates task.html
- Asks mentor when stuck

---

**This PRD v3.1 is the SINGLE SOURCE OF TRUTH. No other file should be used as "acuan". Let's build!** 🚀

---

## 🚀 Deployment Adaptation (2026-05-11)

- **Deploy script**: `~/scripts/deploy.sh koperasi_mini stable http://127.0.0.1/p1/health`
- **Showroom path**: `/home/ardy/apps/koperasi_mini/stable/current`
- **Portal Nginx path**: `/p1` (maps to the `stable` version via Nginx proxy).
- **Health‑check URL** used after deployment: `http://127.0.0.1/p1/health` (expects HTTP 200).
- **Port usage**: Uses the **Universal Zone** (4000‑5000) – no conflict with existing projects.
- **PRD updates**: Added this deployment section and noted the need to keep the `stable` symlink pointing to the latest version.

---
