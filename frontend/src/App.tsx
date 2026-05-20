import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import LoadingSpinner from './components/atoms/LoadingSpinner'
import ErrorBoundary from './components/atoms/ErrorBoundary'
import PwaInstallPrompt from "./features/PwaInstallPrompt"

// Lazy load all pages for code splitting
const LandingPage = lazy(() => import('./pages/LandingPage'))
const Register = lazy(() => import('./pages/Register'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Riwayat = lazy(() => import('./pages/Riwayat'))
const AnggotaManage = lazy(() => import('./pages/AnggotaManage'))
const SimpananInput = lazy(() => import('./pages/SimpananInput'))
const PinjamanInput = lazy(() => import('./pages/PinjamanInput'))
const AngsuranInput = lazy(() => import('./pages/AngsuranInput'))
const FundingInput = lazy(() => import('./pages/FundingInput'))
const SaldoView = lazy(() => import('./pages/SaldoView'))
const KewajibanView = lazy(() => import('./pages/KewajibanView'))
const LandingPageManage = lazy(() => import('./pages/LandingPageManage'))
const PengajuanPinjaman = lazy(() => import('./pages/PengajuanPinjaman'))
const Approval = lazy(() => import('./pages/Approval'))
const SettingsManage = lazy(() => import('./pages/SettingsManage'))
const MarginSettings = lazy(() => import('./pages/MarginSettings'))
const About = lazy(() => import('./pages/About'))
const StoryBehind = lazy(() => import('./pages/StoryBehind'))
const CreatorInfo = lazy(() => import('./pages/CreatorInfo'))
const OrganizationStructure = lazy(() => import('./pages/OrganizationStructure'))
const ProposalBisnis = lazy(() => import('./pages/ProposalBisnis'))
const Project = lazy(() => import('./pages/Project'))
const SettingsTheme = lazy(() => import('./pages/SettingsTheme'))
const SettingsOrganization = lazy(() => import('./pages/SettingsOrganization'))
const DashboardTest = lazy(() => import('./pages/DashboardTest'))
const Laporan = lazy(() => import('./pages/Laporan'))

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, x: 300 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -300 }
}

function App() {
  const token = localStorage.getItem('token')

  return (
    <BrowserRouter>
      <PwaInstallPrompt />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size={48} />
        </div>
      }>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <ErrorBoundary><LandingPage /></ErrorBoundary>
              </motion.div>
            } />
            <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <ErrorBoundary><Register /></ErrorBoundary>} />

            {/* Protected Routes (require token) */}
            <Route path="/dashboard" element={token ? <ErrorBoundary><Dashboard /></ErrorBoundary> : <Navigate to="/" />} />
            <Route path="/anggota" element={token ? <ErrorBoundary><AnggotaManage /></ErrorBoundary> : <Navigate to="/" />} />
            <Route path="/pinjaman/pengajuan" element={token ? <ErrorBoundary><PengajuanPinjaman /></ErrorBoundary> : <Navigate to="/" />} />
            <Route path="/pinjaman/approval" element={token ? <ErrorBoundary><Approval /></ErrorBoundary> : <Navigate to="/" />} />
            <Route path="/simpanan/input" element={token ? <ErrorBoundary><SimpananInput /></ErrorBoundary> : <Navigate to="/" />} />
            <Route path="/pinjaman/input" element={token ? <ErrorBoundary><PinjamanInput /></ErrorBoundary> : <Navigate to="/" />} />
            <Route path="/angsuran/input" element={token ? <ErrorBoundary><AngsuranInput /></ErrorBoundary> : <Navigate to="/" />} />
            <Route path="/funding/input" element={token ? <ErrorBoundary><FundingInput /></ErrorBoundary> : <Navigate to="/" />} />
            <Route path="/saldo" element={token ? <ErrorBoundary><SaldoView /></ErrorBoundary> : <Navigate to="/" />} />
            <Route path="/kewajiban" element={token ? <ErrorBoundary><KewajibanView /></ErrorBoundary> : <Navigate to="/" />} />
            <Route path="/riwayat" element={token ? <ErrorBoundary><Riwayat /></ErrorBoundary> : <Navigate to="/" />} />
            <Route path="/dashboard-test" element={token ? <ErrorBoundary><DashboardTest /></ErrorBoundary> : <Navigate to="/" />} />
            <Route path="/settings" element={token ? <ErrorBoundary><SettingsManage /></ErrorBoundary> : <Navigate to="/" />} />
            <Route path="/settings/margin" element={token ? <ErrorBoundary><MarginSettings /></ErrorBoundary> : <Navigate to="/" />} />
            <Route path="/landing-manage" element={token ? <ErrorBoundary><LandingPageManage /></ErrorBoundary> : <Navigate to="/" />} />
            <Route path="/about" element={token ? <ErrorBoundary><About /></ErrorBoundary> : <Navigate to="/" />} />
            <Route path="/project" element={token ? <ErrorBoundary><Project /></ErrorBoundary> : <Navigate to="/" />} />
            <Route path="/settings/theme" element={token ? <ErrorBoundary><SettingsTheme /></ErrorBoundary> : <Navigate to="/" />} />
            <Route path="/settings/organization" element={token ? <ErrorBoundary><SettingsOrganization /></ErrorBoundary> : <Navigate to="/" />} />
            <Route path="/story-behind" element={<ErrorBoundary><StoryBehind /></ErrorBoundary>} />
            <Route path="/creator-info" element={<ErrorBoundary><CreatorInfo /></ErrorBoundary>} />
            <Route path="/organization-structure" element={<ErrorBoundary><OrganizationStructure /></ErrorBoundary>} />
            <Route path="/proposal-bisnis" element={token ? <ErrorBoundary><ProposalBisnis /></ErrorBoundary> : <Navigate to="/" />} />
            <Route path="/laporan" element={token ? <ErrorBoundary><Laporan /></ErrorBoundary> : <Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
