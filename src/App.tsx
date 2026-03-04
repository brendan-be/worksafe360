import { Routes, Route } from 'react-router-dom'
import { StaffProvider } from './context/StaffContext'
import { ToastProvider } from './components/Toast'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import Contracts from './pages/Contracts'
import OnboardingDetail from './pages/OnboardingDetail'
import Documents from './pages/Documents'
import Learning from './pages/Learning'
import Checklists from './pages/Checklists'
import HealthSafety from './pages/HealthSafety'
import Improvements from './pages/Improvements'
import Communications from './pages/Communications'
import SiteSignIn from './pages/SiteSignIn'
import Budgets from './pages/Budgets'
import AuditPage from './pages/AuditPage'
import CandidatePortal from './pages/CandidatePortal'
import EmployeePortal from './pages/EmployeePortal'

export default function App() {
    return (
        <ToastProvider>
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
                        <Route path="/improvements" element={<Improvements />} />
                        <Route path="/communications" element={<Communications />} />
                        <Route path="/site-sign-in" element={<SiteSignIn />} />
                        <Route path="/budgets" element={<Budgets />} />
                        <Route path="/audit" element={<AuditPage />} />
                    </Route>

                    {/* Employee portal (standalone — no sidebar) */}
                    <Route path="/employee" element={<EmployeePortal />} />

                    {/* Candidate portal (standalone — no sidebar) */}
                    <Route path="/candidate/:token" element={<CandidatePortal />} />
                </Routes>
            </StaffProvider>
        </ToastProvider>
    )
}
