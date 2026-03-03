import { createContext, useContext, useState, ReactNode } from 'react'
import {
    OnboardingCandidate,
    OnboardingDocument,
    onboardingCandidates as seedCandidates,
} from '../data/mockData'

// ─── Legacy NewHire (kept for QuickAddStaffModal compat) ───
export interface NewHire {
    id: string
    name: string
    email: string
    role: string
    salary: string
    department: string
    site: string
    startDate: string
    manager: string
    employmentType: string
    trialPeriod: boolean
    selectedDocs: string[]
    status: 'draft' | 'sent' | 'viewed' | 'signed'
    createdAt: string
}

// ─── Context shape ───
interface StaffContextType {
    // Legacy
    newHires: NewHire[]
    addHire: (hire: Omit<NewHire, 'id' | 'status' | 'createdAt'>) => void
    removeHire: (id: string) => void
    updateHireStatus: (id: string, status: NewHire['status']) => void

    // Onboarding candidates
    candidates: OnboardingCandidate[]
    addCandidate: (candidate: Omit<OnboardingCandidate, 'id' | 'createdAt'>) => void
    updateCandidateStatus: (id: string, status: OnboardingCandidate['status']) => void
    updateDocument: (candidateId: string, docId: string, updates: Partial<OnboardingDocument>) => void
    toggleHardGate: (candidateId: string, gate: keyof OnboardingCandidate['hardGates']) => void
    applyOverride: (candidateId: string, overrideBy: string) => void
    sendReminder: (candidateId: string) => void
    removeCandidate: (id: string) => void
}

const StaffContext = createContext<StaffContextType | null>(null)

export function useStaff() {
    const ctx = useContext(StaffContext)
    if (!ctx) throw new Error('useStaff must be used within StaffProvider')
    return ctx
}

export function StaffProvider({ children }: { children: ReactNode }) {
    // ─── Legacy new-hire state ───
    const [newHires, setNewHires] = useState<NewHire[]>([])

    const addHire = (hire: Omit<NewHire, 'id' | 'status' | 'createdAt'>) => {
        const newEntry: NewHire = {
            ...hire,
            id: `nh-${Date.now()}`,
            status: 'draft',
            createdAt: new Date().toISOString().slice(0, 10),
        }
        setNewHires(prev => [newEntry, ...prev])
    }

    const removeHire = (id: string) => setNewHires(prev => prev.filter(h => h.id !== id))
    const updateHireStatus = (id: string, status: NewHire['status']) =>
        setNewHires(prev => prev.map(h => h.id === id ? { ...h, status } : h))

    // ─── Onboarding candidates ───
    const [candidates, setCandidates] = useState<OnboardingCandidate[]>(seedCandidates)

    const addCandidate = (candidate: Omit<OnboardingCandidate, 'id' | 'createdAt'>) => {
        const entry: OnboardingCandidate = {
            ...candidate,
            id: `oc-${Date.now()}`,
            createdAt: new Date().toISOString().slice(0, 10),
        }
        setCandidates(prev => [entry, ...prev])
    }

    const updateCandidateStatus = (id: string, status: OnboardingCandidate['status']) =>
        setCandidates(prev => prev.map(c => c.id === id ? { ...c, status } : c))

    const updateDocument = (candidateId: string, docId: string, updates: Partial<OnboardingDocument>) =>
        setCandidates(prev => prev.map(c => {
            if (c.id !== candidateId) return c
            return {
                ...c,
                documents: c.documents.map(d => d.id === docId ? { ...d, ...updates } : d),
            }
        }))

    const toggleHardGate = (candidateId: string, gate: keyof OnboardingCandidate['hardGates']) =>
        setCandidates(prev => prev.map(c => {
            if (c.id !== candidateId) return c
            const gates = { ...c.hardGates }
            const val = gates[gate]
            if (typeof val === 'boolean') {
                (gates as any)[gate] = !val
            }
            return { ...c, hardGates: gates }
        }))

    const applyOverride = (candidateId: string, overrideBy: string) =>
        setCandidates(prev => prev.map(c => {
            if (c.id !== candidateId) return c
            return {
                ...c,
                hardGates: {
                    ...c.hardGates,
                    overrideApplied: true,
                    overrideBy,
                    overrideAt: new Date().toISOString(),
                },
            }
        }))

    const sendReminder = (candidateId: string) =>
        setCandidates(prev => prev.map(c => {
            if (c.id !== candidateId) return c
            return { ...c, lastReminder: new Date().toISOString() }
        }))

    const removeCandidate = (id: string) =>
        setCandidates(prev => prev.filter(c => c.id !== id))

    return (
        <StaffContext.Provider value={{
            newHires, addHire, removeHire, updateHireStatus,
            candidates, addCandidate, updateCandidateStatus,
            updateDocument, toggleHardGate, applyOverride,
            sendReminder, removeCandidate,
        }}>
            {children}
        </StaffContext.Provider>
    )
}
