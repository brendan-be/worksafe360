import { Routes, Route } from 'react-router-dom'
import { StaffProvider } from './context/StaffContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import Contracts from './pages/Contracts'
import OnboardingDetail from './pages/OnboardingDetail'
import Documents from './pages/Documents'
import Learning from './pages/Learning'
import Checklists from './pages/Checklists'
import HealthSafety from './pages/HealthSafety'
import SiteSignIn from './pages/SiteSignIn'
import CandidatePortal from './pages/CandidatePortal'

export default function App() {
    return (
        <StaffProvider>
            <Routes>
                {/* Admin routes (inside Layout) */}
                <Route element={<Layout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/employees" element={<Employees />} />
                    <Route path="/onboarding" element={<Contracts />} />
                    <Route path="/onboarding/:id" element={<OnboardingDetail />} />
                    <Route path="/documents" element={<Documents />} />
                    <Route path="/learning" element={<Learning />} />
                    <Route path="/checklists" element={<Checklists />} />
                    <Route path="/health-safety" element={<HealthSafety />} />
                    <Route path="/site-sign-in" element={<SiteSignIn />} />
                </Route>

                {/* Candidate portal (standalone — no sidebar) */}
                <Route path="/candidate/:token" element={<CandidatePortal />} />
            </Routes>
        </StaffProvider>
    )
}
