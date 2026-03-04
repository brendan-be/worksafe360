import { createContext, useContext, useState, ReactNode } from 'react'
import {
    OnboardingCandidate,
    OnboardingDocument,
    LearningContent,
    Checklist,
    ChecklistItem,
    ImprovementNote,
    onboardingCandidates as seedCandidates,
    learningContent as seedLearning,
    checklists as seedChecklists,
    improvementNotes as seedImprovements,
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

    // Learning
    learningItems: LearningContent[]
    addLearningItem: (item: Omit<LearningContent, 'id'>) => void
    updateLearningProgress: (id: string, progress: number) => void

    // Checklists
    checklistItems: Checklist[]
    updateChecklistItemStatus: (checklistId: string, itemId: string, status: ChecklistItem['status'], notes?: string) => void
    signChecklist: (checklistId: string, who: 'employee' | 'manager') => void

    // Improvement notes
    improvementNotes: ImprovementNote[]
    addImprovementNote: (note: Omit<ImprovementNote, 'id' | 'date' | 'status'>) => void
    updateImprovementStatus: (id: string, status: ImprovementNote['status']) => void
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

    // ─── Learning ───
    const [learningItems, setLearningItems] = useState<LearningContent[]>(seedLearning)

    const addLearningItem = (item: Omit<LearningContent, 'id'>) => {
        const entry: LearningContent = { ...item, id: `lc-${Date.now()}` }
        setLearningItems(prev => [entry, ...prev])
    }

    const updateLearningProgress = (id: string, progress: number) =>
        setLearningItems(prev => prev.map(l => l.id === id ? { ...l, progress } : l))

    // ─── Checklists ───
    const [checklistItems, setChecklistItems] = useState<Checklist[]>(seedChecklists)

    const updateChecklistItemStatus = (checklistId: string, itemId: string, status: ChecklistItem['status'], notes?: string) =>
        setChecklistItems(prev => prev.map(cl => {
            if (cl.id !== checklistId) return cl
            const items = cl.items.map(it => it.id === itemId ? { ...it, status, ...(notes !== undefined ? { notes } : {}) } : it)
            const completeCount = items.filter(it => it.status === 'complete').length
            const score = items.length > 0 ? Math.round((completeCount / items.length) * 100) : 0
            return { ...cl, items, score }
        }))

    const signChecklist = (checklistId: string, who: 'employee' | 'manager') =>
        setChecklistItems(prev => prev.map(cl => {
            if (cl.id !== checklistId) return cl
            const now = new Date().toISOString()
            if (who === 'employee') return { ...cl, employeeSignature: true, employeeSignedAt: now }
            return { ...cl, managerSignature: true, managerSignedAt: now }
        }))

    // ─── Improvement notes ───
    const [improvementNotes, setImprovementNotes] = useState<ImprovementNote[]>(seedImprovements)

    const addImprovementNote = (note: Omit<ImprovementNote, 'id' | 'date' | 'status'>) => {
        const entry: ImprovementNote = {
            ...note,
            id: `in-${Date.now()}`,
            date: new Date().toISOString().slice(0, 10),
            status: 'submitted',
        }
        setImprovementNotes(prev => [entry, ...prev])
    }

    const updateImprovementStatus = (id: string, status: ImprovementNote['status']) => {
        setImprovementNotes(prev => prev.map(n => n.id === id ? { ...n, status } : n))
    }

    return (
        <StaffContext.Provider value={{
            newHires, addHire, removeHire, updateHireStatus,
            candidates, addCandidate, updateCandidateStatus,
            updateDocument, toggleHardGate, applyOverride,
            sendReminder, removeCandidate,
            learningItems, addLearningItem, updateLearningProgress,
            checklistItems, updateChecklistItemStatus, signChecklist,
            improvementNotes, addImprovementNote, updateImprovementStatus,
        }}>
            {children}
        </StaffContext.Provider>
    )
}
