import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    ArrowLeft, Egg, Clock, BookOpen, FileText, ClipboardCheck, LayoutDashboard,
    Award, Shield, MapPin, Calendar, Play, CheckCircle2, Circle, AlertTriangle,
    ChevronDown, Plus, X, Star, Zap, TrendingUp, Users, Lightbulb, List, Grid3X3,
    Heart, Gift, Trophy, Cake, CalendarHeart,
} from 'lucide-react'
import { useStaff } from '../context/StaffContext'
import {
    employees, certifications, timeEntries, documentTemplates,
    onboardingCandidates, recognitions, calendarEvents, type LearningContent, type ImprovementNote,
} from '../data/mockData'

/* ═══════════════════════════════════════════════
   Employee Portal — single-page tabbed layout
   ═══════════════════════════════════════════════ */

// We simulate being "logged in" as Tom Henderson (id 6)
const CURRENT_EMP_ID = '6'
const emp = employees.find(e => e.id === CURRENT_EMP_ID)!

/* ─── Recognition type config ─── */
const recTypeConfig: Record<string, { icon: typeof Star; color: string; defaultVisibility: string }> = {
    'values': { icon: Heart, color: '#DC2626', defaultVisibility: 'Company-wide' },
    'behavioural': { icon: TrendingUp, color: '#D97706', defaultVisibility: 'Site-wide' },
    'shout-out': { icon: Trophy, color: '#2563EB', defaultVisibility: 'Team' },
    'high-performance': { icon: Star, color: '#9333EA', defaultVisibility: 'Private' },
    'birthday': { icon: Cake, color: '#EC4899', defaultVisibility: 'Managers and above' },
    'work-anniversary': { icon: CalendarHeart, color: '#059669', defaultVisibility: 'Managers and above' },
}

const tabs = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'onboarding', label: 'Onboarding', icon: ClipboardCheck },
    { key: 'time', label: 'Time & Attendance', icon: Clock },
    { key: 'learning', label: 'Learning & Training', icon: BookOpen },
    { key: 'checklists', label: 'Checklists', icon: ClipboardCheck },
    { key: 'calendar', label: 'Calendar', icon: Calendar },
    { key: 'improvements', label: 'Improvements', icon: Lightbulb },
    { key: 'documents', label: 'Documents', icon: FileText },
] as const
type TabKey = typeof tabs[number]['key']

/* ─── Status colours ─── */
const statusClr: Record<string, { bg: string; tx: string }> = {
    complete: { bg: '#ECFDF5', tx: '#059669' },
    partial: { bg: '#FFFBEB', tx: '#D97706' },
    'not-complete': { bg: '#FEF2F2', tx: '#DC2626' },
    'not-started': { bg: '#F1F5F9', tx: '#64748B' },
}

/* ════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════ */
export default function EmployeePortal() {
    const navigate = useNavigate()
    const {
        learningItems, updateLearningProgress,
        checklistItems, updateChecklistItemStatus, signChecklist,
        improvementNotes, addImprovementNote,
    } = useStaff()

    const [activeTab, setActiveTab] = useState<TabKey>('overview')
    const [addImprovementOpen, setAddImprovementOpen] = useState(false)

    const myCerts = certifications.filter(c => c.employeeId === CURRENT_EMP_ID)
    const myTime = timeEntries.filter(t => t.employeeId === CURRENT_EMP_ID)
    const myOnboarding = onboardingCandidates.find(c => c.name === emp.name)
    const myRecognitions = recognitions.filter(r => r.to === emp.name)
    const myChecklists = checklistItems.filter(c => c.assignedTo === emp.name)
    const myImprovements = improvementNotes.filter(n => n.submittedBy === emp.name)
    const myDocs = documentTemplates.filter(dt =>
        dt.roleAssignments.includes('all') || dt.roleAssignments.includes(emp.role)
    )

    return (
        <div className="flex flex-col" style={{ minHeight: '100vh', background: '#F8FAFC' }}>
            {/* ─── Top Bar ─── */}
            <header style={{
                height: 80, borderBottom: '1px solid #E2E8F0',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 40px', flexShrink: 0,
                background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 30,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <img src="/better-eggs-logo-sm.png" alt="Better Eggs" style={{ width: 42, height: 42, objectFit: 'contain' }} />
                    <div>
                        <p style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>My Portal</p>
                        <p style={{ fontSize: 13, color: '#64748B' }}>{emp.name} — {emp.role}</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '10px 20px', borderRadius: 16, fontSize: 13, fontWeight: 600,
                        color: '#64748B', background: '#F1F5F9', border: 'none', cursor: 'pointer',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#E2E8F0' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#F1F5F9' }}
                >
                    <ArrowLeft style={{ width: 16, height: 16 }} />Back to Admin
                </button>
            </header>

            {/* ─── Tab Bar ─── */}
            <div style={{
                display: 'flex', gap: 6, padding: '20px 40px 0',
                borderBottom: '1px solid #E2E8F0', background: 'white',
            }}>
                {tabs.map(tab => {
                    const Icon = tab.icon
                    const active = activeTab === tab.key
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                padding: '14px 22px', fontSize: 13, fontWeight: active ? 700 : 500,
                                color: active ? '#B45309' : '#64748B',
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                borderBottom: active ? '3px solid #D97706' : '3px solid transparent',
                                transition: 'all 0.2s', marginBottom: -1,
                            }}
                        >
                            <Icon style={{ width: 16, height: 16, color: active ? '#D97706' : '#94A3B8' }} />
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* ─── Content Area ─── */}
            <main style={{ flex: 1, padding: '40px 40px 60px', maxWidth: 1200, width: '100%', margin: '0 auto' }}>
                {activeTab === 'overview' && <OverviewTab myCerts={myCerts} myTime={myTime} myRecognitions={myRecognitions} learningItems={learningItems} />}
                {activeTab === 'onboarding' && <OnboardingTab onboarding={myOnboarding} />}
                {activeTab === 'time' && <TimeTab entries={myTime} />}
                {activeTab === 'learning' && (
                    <LearningTab
                        items={learningItems}
                        onProgress={updateLearningProgress}
                    />
                )}
                {activeTab === 'checklists' && (
                    <ChecklistsTab
                        checklists={myChecklists}
                        onUpdateItem={updateChecklistItemStatus}
                        onSign={signChecklist}
                    />
                )}
                {activeTab === 'calendar' && <CalendarTab />}
                {activeTab === 'improvements' && (
                    <ImprovementsTab
                        notes={myImprovements}
                        onAddOpen={() => setAddImprovementOpen(true)}
                    />
                )}
                {activeTab === 'documents' && <DocumentsTab docs={myDocs} />}
            </main>

            {/* ─── Modals ─── */}
            {addImprovementOpen && <AddImprovementModal onClose={() => setAddImprovementOpen(false)} onAdd={addImprovementNote} />}
        </div>
    )
}


/* ════════════════════════════════════════════════
   TAB: OVERVIEW
   ════════════════════════════════════════════════ */
function OverviewTab({ myCerts, myTime, myRecognitions, learningItems }: {
    myCerts: typeof certifications; myTime: typeof timeEntries;
    myRecognitions: typeof recognitions; learningItems: LearningContent[]
}) {
    const assigned = learningItems.filter(l => l.roles.includes('all') || l.roles.includes(emp.role))
    const completed = assigned.filter(l => (l.progress ?? 0) >= 100).length
    const totalHours = myTime.reduce((s, t) => s + t.actual, 0)

    return (
        <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {/* Welcome */}
            <div className="card" style={{
                padding: 36, background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
                border: '1px solid #FDE68A',
            }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#92400E' }}>
                    Welcome back, {emp.name.split(' ')[0]}! 👋
                </h2>
                <p style={{ fontSize: 14, color: '#B45309', marginTop: 8 }}>
                    {emp.role} at {emp.site} · Started {new Date(emp.startDate).toLocaleDateString('en-NZ', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            {/* Quick stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
                {[
                    { icon: Shield, label: 'Certifications', value: `${myCerts.filter(c => c.status === 'valid').length}/${myCerts.length} valid`, color: '#059669' },
                    { icon: Clock, label: 'Hours This Period', value: `${totalHours} hrs`, color: '#2563EB' },
                    { icon: BookOpen, label: 'Learning', value: `${completed}/${assigned.length} done`, color: '#D97706' },
                    { icon: Star, label: 'Recognitions', value: `${myRecognitions.length} received`, color: '#9333EA' },
                ].map((s, i) => (
                    <div key={i} className="card animate-in" style={{ padding: 28, animationDelay: `${i * 60}ms` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 14, background: `${s.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <s.icon style={{ width: 18, height: 18, color: s.color }} />
                            </div>
                        </div>
                        <p style={{ fontSize: 22, fontWeight: 700, color: '#0F172A' }}>{s.value}</p>
                        <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Certifications */}
            {myCerts.length > 0 && (
                <div className="card animate-in delay-2" style={{ padding: 32 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 20 }}>My Certifications</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {myCerts.map(c => {
                            const clr = c.status === 'valid' ? '#059669' : c.status === 'expiring' ? '#D97706' : '#DC2626'
                            return (
                                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderRadius: 16, background: '#F8FAFC' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <Award style={{ width: 18, height: 18, color: clr }} />
                                        <span style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{c.type}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <span style={{ fontSize: 13, color: '#64748B' }}>Expires {c.expiryDate}</span>
                                        <span style={{ padding: '4px 12px', borderRadius: 10, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' as const, background: `${clr}15`, color: clr }}>{c.status}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Recognitions */}
            {myRecognitions.length > 0 && (
                <div className="card animate-in delay-3" style={{ padding: 32 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 20 }}>Recognitions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {myRecognitions.map(r => {
                            const cfg = recTypeConfig[r.type] || recTypeConfig['shout-out']
                            const RecIcon = cfg.icon
                            return (
                                <div key={r.id} style={{ padding: '16px 20px', borderRadius: 16, background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                        <RecIcon style={{ width: 14, height: 14, color: cfg.color }} />
                                        <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color, textTransform: 'uppercase' as const }}>{r.type.replace('-', ' ')}</span>
                                        {r.value && <span style={{ fontSize: 12, color: '#92400E' }}>· {r.value}</span>}
                                        <span style={{ marginLeft: 'auto', padding: '2px 8px', borderRadius: 8, fontSize: 10, fontWeight: 600, background: '#F1F5F9', color: '#64748B' }}>{r.visibility}</span>
                                    </div>
                                    <p style={{ fontSize: 14, color: '#0F172A', lineHeight: 1.6 }}>"{r.message}"</p>
                                    <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 8 }}>From {r.from} · {r.date}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}


/* ════════════════════════════════════════════════
   TAB: ONBOARDING
   ════════════════════════════════════════════════ */
function OnboardingTab({ onboarding }: { onboarding: typeof onboardingCandidates[0] | undefined }) {
    if (!onboarding) {
        return (
            <div className="card animate-in" style={{ padding: 48, textAlign: 'center' }}>
                <CheckCircle2 style={{ width: 48, height: 48, color: '#059669', margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A' }}>Onboarding Complete</h3>
                <p style={{ fontSize: 14, color: '#64748B', marginTop: 8 }}>All onboarding tasks have been completed. Welcome to the team!</p>
            </div>
        )
    }

    const signed = onboarding.documents.filter(d => d.status === 'signed' || d.status === 'acknowledged').length
    const total = onboarding.documents.length
    const pct = Math.round((signed / total) * 100)

    const docStatusIcon: Record<string, { icon: typeof CheckCircle2; color: string }> = {
        'signed': { icon: CheckCircle2, color: '#059669' },
        'acknowledged': { icon: CheckCircle2, color: '#059669' },
        'viewed': { icon: Circle, color: '#D97706' },
        'sent': { icon: Circle, color: '#3B82F6' },
        'not-sent': { icon: Circle, color: '#94A3B8' },
    }

    return (
        <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Progress card */}
            <div className="card" style={{ padding: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>Document Progress</h3>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#D97706' }}>{pct}%</span>
                </div>
                <div style={{ height: 10, borderRadius: 5, background: '#F1F5F9', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #FBBF24, #D97706)', borderRadius: 5, transition: 'width 0.5s ease' }} />
                </div>
                <p style={{ fontSize: 13, color: '#64748B', marginTop: 12 }}>{signed} of {total} documents completed</p>
            </div>

            {/* Documents list */}
            <div className="card" style={{ padding: 32 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 20 }}>Documents</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {onboarding.documents.map(doc => {
                        const st = docStatusIcon[doc.status] || docStatusIcon['not-sent']
                        const Icon = st.icon
                        return (
                            <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderRadius: 14, background: '#F8FAFC' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <Icon style={{ width: 18, height: 18, color: st.color }} />
                                    <div>
                                        <p style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{doc.name}</p>
                                        <p style={{ fontSize: 12, color: '#94A3B8' }}>{doc.category} · {doc.interactionMode.replace('-', ' ')}</p>
                                    </div>
                                </div>
                                <span style={{
                                    padding: '4px 12px', borderRadius: 10, fontSize: 11, fontWeight: 700,
                                    textTransform: 'uppercase' as const,
                                    background: `${st.color}15`, color: st.color,
                                }}>{doc.status.replace('-', ' ')}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Hard gates */}
            <div className="card" style={{ padding: 32 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 20 }}>Hard Gates</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {([
                        ['regulatoryDocsSigned', 'Regulatory docs signed'],
                        ['mandatoryPoliciesSigned', 'Mandatory policies signed'],
                        ['rightToWorkUploaded', 'Right to work uploaded'],
                        ['firstDayInduction', 'Day 1 induction completed'],
                        ['firstWeekInduction', 'Week 1 induction completed'],
                    ] as const).map(([key, label]) => {
                        const done = onboarding.hardGates[key] as boolean
                        return (
                            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 14, background: done ? '#F0FDF4' : '#F8FAFC' }}>
                                {done ? <CheckCircle2 style={{ width: 18, height: 18, color: '#059669' }} /> : <Circle style={{ width: 18, height: 18, color: '#CBD5E1' }} />}
                                <span style={{ fontSize: 13, color: done ? '#059669' : '#64748B' }}>{label}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}


/* ════════════════════════════════════════════════
   TAB: TIME & ATTENDANCE
   ════════════════════════════════════════════════ */
function TimeTab({ entries }: { entries: typeof timeEntries }) {
    const totalHrs = entries.reduce((s, t) => s + t.actual, 0)
    const totalContracted = entries.reduce((s, t) => s + t.contracted, 0)

    return (
        <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                {[
                    { label: 'Total Hours', value: `${totalHrs}`, sub: 'This period' },
                    { label: 'Contracted', value: `${totalContracted}`, sub: 'Expected hours' },
                    { label: 'Variance', value: totalHrs >= totalContracted ? `+${totalHrs - totalContracted}` : `${totalHrs - totalContracted}`, sub: totalHrs >= totalContracted ? 'Over' : 'Under' },
                ].map((s, i) => (
                    <div key={i} className="card" style={{ padding: 28 }}>
                        <p style={{ fontSize: 13, color: '#64748B', marginBottom: 8 }}>{s.label}</p>
                        <p style={{ fontSize: 28, fontWeight: 700, color: '#0F172A' }}>{s.value}<span style={{ fontSize: 14, fontWeight: 500, color: '#94A3B8', marginLeft: 4 }}>hrs</span></p>
                        <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>{s.sub}</p>
                    </div>
                ))}
            </div>

            {/* Entries */}
            <div className="card" style={{ padding: 32 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 20 }}>Recent Entries</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                            {['Date', 'Clock In', 'Clock Out', 'Site', 'Actual', 'Exception'].map(h => (
                                <th key={h} style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#94A3B8', textAlign: 'left', textTransform: 'uppercase' as const }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map(t => (
                            <tr key={t.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                <td style={{ padding: '14px 16px', fontSize: 14, color: '#0F172A', fontWeight: 600 }}>{t.date}</td>
                                <td style={{ padding: '14px 16px', fontSize: 14, color: '#0F172A' }}>{t.clockIn}</td>
                                <td style={{ padding: '14px 16px', fontSize: 14, color: '#0F172A' }}>{t.clockOut || '—'}</td>
                                <td style={{ padding: '14px 16px', fontSize: 14, color: '#64748B' }}>{t.site}</td>
                                <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: t.actual > t.contracted ? '#D97706' : '#0F172A' }}>{t.actual} hrs</td>
                                <td style={{ padding: '14px 16px', fontSize: 13, color: t.exception ? '#D97706' : '#94A3B8' }}>{t.exception || '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}


/* ════════════════════════════════════════════════
   TAB: LEARNING & TRAINING
   ════════════════════════════════════════════════ */
function LearningTab({ items, onProgress }: {
    items: LearningContent[]; onProgress: (id: string, p: number) => void
}) {
    const assigned = items.filter(l => l.roles.includes('all') || l.roles.includes(emp.role))
    const typeIcon: Record<string, typeof Play> = { video: Play, document: FileText, sop: FileText, interactive: Zap }

    return (
        <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Header */}
            <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>Assigned Learning</h3>
                <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>{assigned.filter(l => (l.progress ?? 0) >= 100).length} of {assigned.length} complete</p>
            </div>

            {/* Modules */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {assigned.map((l, i) => {
                    const Icon = typeIcon[l.type] || FileText
                    const prog = l.progress ?? 0
                    const done = prog >= 100
                    return (
                        <div key={l.id} className="card animate-in" style={{ padding: 28, animationDelay: `${i * 50}ms` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', gap: 16, flex: 1 }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 14, background: done ? '#ECFDF5' : '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        {done ? <CheckCircle2 style={{ width: 20, height: 20, color: '#059669' }} /> : <Icon style={{ width: 20, height: 20, color: '#3B82F6' }} />}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                                            <p style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>{l.title}</p>
                                            {l.mandatory && <span style={{ padding: '2px 8px', borderRadius: 8, fontSize: 10, fontWeight: 700, background: '#FEF2F2', color: '#DC2626' }}>REQUIRED</span>}
                                        </div>
                                        <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>{l.description}</p>
                                        <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
                                            <span style={{ fontSize: 12, color: '#94A3B8' }}>{l.category}</span>
                                            <span style={{ fontSize: 12, color: '#94A3B8' }}>{l.duration}</span>
                                            <span style={{ fontSize: 12, color: '#94A3B8' }}>{l.timeSequence}</span>
                                        </div>
                                        {/* Progress bar */}
                                        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{ flex: 1, height: 6, borderRadius: 3, background: '#F1F5F9', overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${prog}%`, background: done ? '#059669' : 'linear-gradient(90deg, #FBBF24, #D97706)', borderRadius: 3, transition: 'width 0.5s ease' }} />
                                            </div>
                                            <span style={{ fontSize: 12, fontWeight: 600, color: done ? '#059669' : '#64748B', minWidth: 36 }}>{prog}%</span>
                                        </div>
                                    </div>
                                </div>
                                {!done && (
                                    <button
                                        onClick={() => onProgress(l.id, Math.min(100, prog + 25))}
                                        style={{
                                            padding: '8px 16px', borderRadius: 12, fontSize: 12, fontWeight: 600,
                                            color: '#D97706', background: '#FFFBEB', border: '1px solid #FDE68A',
                                            cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' as const,
                                        }}
                                    >
                                        Continue
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}


/* ════════════════════════════════════════════════
   TAB: CHECKLISTS
   ════════════════════════════════════════════════ */
function ChecklistsTab({ checklists, onUpdateItem, onSign }: {
    checklists: ReturnType<typeof useStaff>['checklistItems']
    onUpdateItem: (clId: string, itemId: string, status: 'complete' | 'partial' | 'not-complete', notes?: string) => void
    onSign: (clId: string, who: 'employee' | 'manager') => void
}) {
    const [expandedId, setExpandedId] = useState<string | null>(checklists[0]?.id ?? null)

    if (checklists.length === 0) {
        return (
            <div className="card animate-in" style={{ padding: 48, textAlign: 'center' }}>
                <ClipboardCheck style={{ width: 48, height: 48, color: '#94A3B8', margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A' }}>No Active Checklists</h3>
                <p style={{ fontSize: 14, color: '#64748B', marginTop: 8 }}>You don't have any checklists assigned at the moment.</p>
            </div>
        )
    }

    return (
        <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {checklists.map((cl, idx) => {
                const expanded = expandedId === cl.id
                const completedItems = cl.items.filter(it => it.status === 'complete').length
                const totalItems = cl.items.length
                const pct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
                const passesThreshold = cl.passMark ? pct >= cl.passMark : true

                return (
                    <div key={cl.id} className="card animate-in" style={{ overflow: 'hidden', animationDelay: `${idx * 60}ms` }}>
                        {/* Checklist header */}
                        <button
                            onClick={() => setExpandedId(expanded ? null : cl.id)}
                            style={{
                                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '24px 28px', background: 'transparent', border: 'none', cursor: 'pointer',
                                textAlign: 'left' as const,
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                                    <span style={{
                                        padding: '3px 10px', borderRadius: 8, fontSize: 10, fontWeight: 700,
                                        textTransform: 'uppercase' as const,
                                        background: cl.type === 'induction' ? '#EFF6FF' : cl.type === 'safety-walk' ? '#ECFDF5' : '#FFFBEB',
                                        color: cl.type === 'induction' ? '#2563EB' : cl.type === 'safety-walk' ? '#059669' : '#D97706',
                                    }}>{cl.type.replace('-', ' ')}</span>
                                    <span style={{ fontSize: 12, color: '#94A3B8' }}>{cl.date}</span>
                                </div>
                                <p style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>{cl.name}</p>
                                <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>Owner: {cl.owner} · {completedItems}/{totalItems} items complete</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                {/* Score badge */}
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: 22, fontWeight: 700, color: passesThreshold ? '#059669' : '#D97706' }}>{pct}%</p>
                                    {cl.passMark && <p style={{ fontSize: 11, color: '#94A3B8' }}>Pass: {cl.passMark}%</p>}
                                </div>
                                <ChevronDown style={{ width: 20, height: 20, color: '#94A3B8', transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'none' }} />
                            </div>
                        </button>

                        {/* Expanded checklist items */}
                        {expanded && (
                            <div style={{ borderTop: '1px solid #F1F5F9', padding: '4px 0' }}>
                                {cl.items.map(item => {
                                    const sc = statusClr[item.status] || statusClr['not-complete']
                                    return (
                                        <div key={item.id} style={{ padding: '18px 28px', borderBottom: '1px solid #FAFAFA', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                                            {/* Status cycle button */}
                                            <button
                                                onClick={() => {
                                                    const next = item.status === 'not-complete' ? 'partial' : item.status === 'partial' ? 'complete' : 'not-complete'
                                                    onUpdateItem(cl.id, item.id, next)
                                                }}
                                                style={{
                                                    width: 28, height: 28, borderRadius: 8, border: 'none', cursor: 'pointer',
                                                    background: sc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    flexShrink: 0, marginTop: 2, transition: 'all 0.2s',
                                                }}
                                                title={`Status: ${item.status} — click to cycle`}
                                            >
                                                {item.status === 'complete' && <CheckCircle2 style={{ width: 16, height: 16, color: sc.tx }} />}
                                                {item.status === 'partial' && <AlertTriangle style={{ width: 14, height: 14, color: sc.tx }} />}
                                                {item.status === 'not-complete' && <Circle style={{ width: 14, height: 14, color: sc.tx }} />}
                                            </button>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: 14, fontWeight: 600, color: item.status === 'complete' ? '#059669' : '#0F172A' }}>{item.title}</p>
                                                <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 4, lineHeight: 1.5 }}>{item.guidance}</p>
                                                {item.notes && <p style={{ fontSize: 12, color: '#64748B', marginTop: 6, fontStyle: 'italic' }}>Note: {item.notes}</p>}
                                            </div>
                                            <span style={{
                                                padding: '3px 10px', borderRadius: 8, fontSize: 10, fontWeight: 700,
                                                textTransform: 'uppercase' as const, background: sc.bg, color: sc.tx,
                                                whiteSpace: 'nowrap' as const,
                                            }}>{item.status.replace('-', ' ')}</span>
                                        </div>
                                    )
                                })}

                                {/* Sign-off section */}
                                <div style={{ padding: '20px 28px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: 16 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            {cl.employeeSignature
                                                ? <CheckCircle2 style={{ width: 16, height: 16, color: '#059669' }} />
                                                : <Circle style={{ width: 16, height: 16, color: '#CBD5E1' }} />
                                            }
                                            <span style={{ fontSize: 13, color: cl.employeeSignature ? '#059669' : '#64748B' }}>
                                                Employee {cl.employeeSignature ? `signed ${new Date(cl.employeeSignedAt!).toLocaleDateString()}` : 'not signed'}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            {cl.managerSignature
                                                ? <CheckCircle2 style={{ width: 16, height: 16, color: '#059669' }} />
                                                : <Circle style={{ width: 16, height: 16, color: '#CBD5E1' }} />
                                            }
                                            <span style={{ fontSize: 13, color: cl.managerSignature ? '#059669' : '#64748B' }}>
                                                Manager {cl.managerSignature ? `signed ${new Date(cl.managerSignedAt!).toLocaleDateString()}` : 'not signed'}
                                            </span>
                                        </div>
                                    </div>
                                    {!cl.employeeSignature && (
                                        <button
                                            onClick={() => onSign(cl.id, 'employee')}
                                            className="btn btn-amber"
                                            style={{ padding: '8px 20px', fontSize: 12 }}
                                        >
                                            Sign Off
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}


/* ════════════════════════════════════════════════
   TAB: DOCUMENTS
   ════════════════════════════════════════════════ */
function DocumentsTab({ docs }: { docs: typeof documentTemplates }) {
    const categories = [...new Set(docs.map(d => d.category))]
    const [filter, setFilter] = useState('all')
    const filtered = filter === 'all' ? docs : docs.filter(d => d.category === filter)

    const catColor: Record<string, string> = {
        contract: '#2563EB', policy: '#D97706', sop: '#059669',
        compliance: '#9333EA', 'job-description': '#64748B',
    }

    return (
        <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Filters */}
            <div style={{ display: 'flex', gap: 8 }}>
                <button
                    onClick={() => setFilter('all')}
                    style={{
                        padding: '8px 18px', borderRadius: 12, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
                        background: filter === 'all' ? '#FFFBEB' : '#F1F5F9',
                        color: filter === 'all' ? '#B45309' : '#64748B',
                    }}
                >All</button>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        style={{
                            padding: '8px 18px', borderRadius: 12, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
                            background: filter === cat ? '#FFFBEB' : '#F1F5F9',
                            color: filter === cat ? '#B45309' : '#64748B',
                            textTransform: 'capitalize' as const,
                        }}
                    >{cat.replace('-', ' ')}</button>
                ))}
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {filtered.map((doc, i) => (
                    <div key={doc.id} className="card animate-in" style={{ padding: 24, animationDelay: `${i * 40}ms` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 12, background: `${catColor[doc.category] || '#64748B'}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FileText style={{ width: 16, height: 16, color: catColor[doc.category] || '#64748B' }} />
                            </div>
                            <div>
                                <p style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{doc.name}</p>
                                <p style={{ fontSize: 12, color: '#94A3B8' }}>v{doc.version} · {doc.lastUpdated}</p>
                            </div>
                        </div>
                        <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>{doc.description}</p>
                        <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
                            <span style={{
                                padding: '3px 10px', borderRadius: 8, fontSize: 10, fontWeight: 700,
                                textTransform: 'uppercase' as const,
                                background: `${catColor[doc.category] || '#64748B'}12`,
                                color: catColor[doc.category] || '#64748B',
                            }}>{doc.category.replace('-', ' ')}</span>
                            <span style={{
                                padding: '3px 10px', borderRadius: 8, fontSize: 10, fontWeight: 700,
                                textTransform: 'uppercase' as const,
                                background: doc.requirementType === 'mandatory-sign' ? '#FEF2F2' : doc.requirementType === 'mandatory-acknowledge' ? '#FFFBEB' : '#F1F5F9',
                                color: doc.requirementType === 'mandatory-sign' ? '#DC2626' : doc.requirementType === 'mandatory-acknowledge' ? '#D97706' : '#64748B',
                            }}>{doc.requirementType.replace(/-/g, ' ')}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}


/* ════════════════════════════════════════════════
   MODAL: ADD LEARNING MODULE
   ════════════════════════════════════════════════ */
function AddModuleModal({ onClose, onAdd }: {
    onClose: () => void
    onAdd: (item: Omit<LearningContent, 'id'>) => void
}) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [type, setType] = useState<LearningContent['type']>('document')
    const [category, setCategory] = useState('Safety')
    const [mandatory, setMandatory] = useState(false)
    const [duration, setDuration] = useState('')
    const [timeSeq, setTimeSeq] = useState('Week 1')

    const handleSubmit = () => {
        if (!title.trim()) return
        onAdd({
            title: title.trim(),
            description: description.trim(),
            type,
            category,
            mandatory,
            roles: ['all'],
            timeSequence: timeSeq,
            isDevelopmentSignal: category === 'Development',
            duration: duration || '30 min',
            progress: 0,
        })
        onClose()
    }

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)',
        }} onClick={onClose}>
            <div
                className="animate-pop"
                onClick={e => e.stopPropagation()}
                style={{
                    width: 520, background: 'white', borderRadius: 24,
                    boxShadow: '0 25px 60px -12px rgb(15 23 42 / 0.15)', overflow: 'hidden',
                }}
            >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 28px', borderBottom: '1px solid #F1F5F9' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>Add Learning Module</h3>
                    <button onClick={onClose} style={{ padding: 6, borderRadius: 10, border: 'none', background: 'transparent', cursor: 'pointer' }}>
                        <X style={{ width: 18, height: 18, color: '#94A3B8' }} />
                    </button>
                </div>

                {/* Form */}
                <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 6, display: 'block' }}>Title *</label>
                        <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Chemical Safety — HSNO" />
                    </div>
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 6, display: 'block' }}>Description</label>
                        <textarea className="input" value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Brief description of the learning content..." style={{ resize: 'vertical' as const }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 6, display: 'block' }}>Type</label>
                            <select className="input" value={type} onChange={e => setType(e.target.value as any)} style={{ cursor: 'pointer' }}>
                                <option value="document">Document</option>
                                <option value="video">Video</option>
                                <option value="sop">SOP</option>
                                <option value="interactive">Interactive</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 6, display: 'block' }}>Category</label>
                            <select className="input" value={category} onChange={e => setCategory(e.target.value)} style={{ cursor: 'pointer' }}>
                                <option>Safety</option>
                                <option>Compliance</option>
                                <option>Operations</option>
                                <option>Development</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 6, display: 'block' }}>Duration</label>
                            <input className="input" value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g. 30 min" />
                        </div>
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 6, display: 'block' }}>Time Sequence</label>
                            <select className="input" value={timeSeq} onChange={e => setTimeSeq(e.target.value)} style={{ cursor: 'pointer' }}>
                                <option>Week 1</option>
                                <option>Week 2</option>
                                <option>Week 3</option>
                                <option>Optional</option>
                            </select>
                        </div>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                        <input
                            type="checkbox" checked={mandatory} onChange={e => setMandatory(e.target.checked)}
                            style={{ width: 18, height: 18, accentColor: '#D97706', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: 13, color: '#0F172A', fontWeight: 500 }}>Mandatory for all assigned roles</span>
                    </label>
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, padding: '16px 28px', borderTop: '1px solid #F1F5F9' }}>
                    <button onClick={onClose} className="btn btn-outline" style={{ padding: '10px 20px' }}>Cancel</button>
                    <button onClick={handleSubmit} className="btn btn-amber" style={{ padding: '10px 24px' }}>Add Module</button>
                </div>
            </div>
        </div>
    )
}


/* ════════════════════════════════════════════════
   TAB: CALENDAR (list / grid toggle)
   ════════════════════════════════════════════════ */
const catColors: Record<string, { bg: string; tx: string }> = {
    company: { bg: '#EFF6FF', tx: '#2563EB' },
    site: { bg: '#ECFDF5', tx: '#059669' },
    training: { bg: '#FEF2F2', tx: '#DC2626' },
    social: { bg: '#FDF4FF', tx: '#9333EA' },
    operational: { bg: '#FFFBEB', tx: '#D97706' },
    'one-on-one': { bg: '#F0F9FF', tx: '#0284C7' },
}

function CalendarTab() {
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
    const sorted = [...calendarEvents].sort((a, b) => a.date.localeCompare(b.date))

    // Build a simple month grid for grid view
    const month = 3 // March 2026
    const year = 2026
    const daysInMonth = new Date(year, month, 0).getDate()
    const firstDay = new Date(year, month - 1, 1).getDay() // 0=Sun
    const cells: (number | null)[] = Array(firstDay === 0 ? 6 : firstDay - 1).fill(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    while (cells.length % 7 !== 0) cells.push(null)

    const eventsByDay = (day: number) => {
        const ds = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        return sorted.filter(e => e.date === ds)
    }

    return (
        <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Header with toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>Upcoming Events</h3>
                <div style={{ display: 'flex', gap: 4, background: '#F1F5F9', borderRadius: 12, padding: 4 }}>
                    <button
                        onClick={() => setViewMode('list')}
                        style={{
                            padding: '8px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
                            fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
                            background: viewMode === 'list' ? 'white' : 'transparent',
                            color: viewMode === 'list' ? '#0F172A' : '#94A3B8',
                            boxShadow: viewMode === 'list' ? '0 1px 3px rgb(0 0 0 / 0.1)' : 'none',
                        }}
                    >
                        <List style={{ width: 14, height: 14 }} />List
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        style={{
                            padding: '8px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
                            fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
                            background: viewMode === 'grid' ? 'white' : 'transparent',
                            color: viewMode === 'grid' ? '#0F172A' : '#94A3B8',
                            boxShadow: viewMode === 'grid' ? '0 1px 3px rgb(0 0 0 / 0.1)' : 'none',
                        }}
                    >
                        <Grid3X3 style={{ width: 14, height: 14 }} />Calendar
                    </button>
                </div>
            </div>

            {/* List view */}
            {viewMode === 'list' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {sorted.map((ev, i) => {
                        const cc = catColors[ev.category] || catColors.company
                        return (
                            <div key={ev.id} className="card animate-in" style={{ padding: 24, animationDelay: `${i * 40}ms` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                            <span style={{ padding: '3px 10px', borderRadius: 8, fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, background: cc.bg, color: cc.tx }}>{ev.category}</span>
                                            <span style={{ fontSize: 12, color: '#94A3B8' }}>{ev.target}</span>
                                        </div>
                                        <p style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>{ev.title}</p>
                                        {ev.description && <p style={{ fontSize: 13, color: '#64748B', marginTop: 6, lineHeight: 1.5 }}>{ev.description}</p>}
                                    </div>
                                    <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 20 }}>
                                        <p style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{ev.date}</p>
                                        <p style={{ fontSize: 13, color: '#64748B' }}>{ev.time}{ev.endTime ? ` – ${ev.endTime}` : ''}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Grid (calendar) view */}
            {viewMode === 'grid' && (
                <div className="card" style={{ padding: 24 }}>
                    <p style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 20, textAlign: 'center' }}>March 2026</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                            <div key={d} style={{ padding: '8px 4px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' as const }}>{d}</div>
                        ))}
                        {cells.map((day, idx) => {
                            const evs = day ? eventsByDay(day) : []
                            const isToday = day === 4
                            return (
                                <div key={idx} style={{
                                    minHeight: 80, padding: 6, borderRadius: 10,
                                    background: isToday ? '#FFFBEB' : day ? 'white' : '#FAFAFA',
                                    border: isToday ? '2px solid #FDE68A' : '1px solid #F1F5F9',
                                }}>
                                    {day && (
                                        <>
                                            <p style={{ fontSize: 12, fontWeight: isToday ? 700 : 500, color: isToday ? '#B45309' : '#64748B', marginBottom: 4 }}>{day}</p>
                                            {evs.map(ev => {
                                                const cc = catColors[ev.category] || catColors.company
                                                return (
                                                    <div key={ev.id} style={{
                                                        padding: '2px 6px', marginBottom: 2, borderRadius: 4,
                                                        background: cc.bg, fontSize: 9, fontWeight: 600, color: cc.tx,
                                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const,
                                                    }} title={`${ev.title} · ${ev.time}`}>
                                                        {ev.title}
                                                    </div>
                                                )
                                            })}
                                        </>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}


/* ════════════════════════════════════════════════
   TAB: IMPROVEMENTS
   ════════════════════════════════════════════════ */
const improvementStatusClr: Record<string, { bg: string; tx: string }> = {
    submitted: { bg: '#EFF6FF', tx: '#2563EB' },
    acknowledged: { bg: '#FFFBEB', tx: '#D97706' },
    actioned: { bg: '#ECFDF5', tx: '#059669' },
}

function ImprovementsTab({ notes, onAddOpen }: {
    notes: ImprovementNote[]; onAddOpen: () => void
}) {
    return (
        <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>My Improvement Notes</h3>
                    <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>{notes.length} note{notes.length !== 1 ? 's' : ''} submitted</p>
                </div>
                <button onClick={onAddOpen} className="btn btn-amber"><Plus style={{ width: 16, height: 16 }} />Submit Improvement</button>
            </div>

            {notes.length === 0 ? (
                <div className="card" style={{ padding: 48, textAlign: 'center' }}>
                    <Lightbulb style={{ width: 48, height: 48, color: '#D97706', margin: '0 auto 16px' }} />
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A' }}>No Improvements Yet</h3>
                    <p style={{ fontSize: 14, color: '#64748B', marginTop: 8 }}>Spot something that could be better? Submit an improvement note — your ideas make a difference.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {notes.map((n, i) => {
                        const sc = improvementStatusClr[n.status] || improvementStatusClr.submitted
                        return (
                            <div key={n.id} className="card animate-in" style={{ padding: 24, animationDelay: `${i * 50}ms` }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                    <span style={{ padding: '3px 10px', borderRadius: 8, fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, background: `${n.category === 'safety' ? '#DC2626' : n.category === 'health' ? '#059669' : n.category === 'infrastructure' ? '#2563EB' : '#D97706'}15`, color: n.category === 'safety' ? '#DC2626' : n.category === 'health' ? '#059669' : n.category === 'infrastructure' ? '#2563EB' : '#D97706' }}>{n.category}</span>
                                    <span style={{ fontSize: 12, color: '#94A3B8' }}>{n.site}</span>
                                    <span style={{ marginLeft: 'auto', padding: '3px 10px', borderRadius: 8, fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, background: sc.bg, color: sc.tx }}>{n.status}</span>
                                </div>
                                <p style={{ fontSize: 14, color: '#0F172A', lineHeight: 1.6 }}>{n.description}</p>
                                <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                                    <p style={{ fontSize: 12, color: '#94A3B8' }}>Submitted {n.date}</p>
                                    {n.routedTo.length > 0 && <p style={{ fontSize: 12, color: '#94A3B8' }}>Routed to: {n.routedTo.join(', ')}</p>}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}


/* ════════════════════════════════════════════════
   MODAL: ADD IMPROVEMENT NOTE
   ════════════════════════════════════════════════ */
function AddImprovementModal({ onClose, onAdd }: {
    onClose: () => void
    onAdd: (note: Omit<ImprovementNote, 'id' | 'date' | 'status'>) => void
}) {
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState<ImprovementNote['category']>('process')
    const [site, setSite] = useState(emp.site)

    const handleSubmit = () => {
        if (!description.trim()) return
        onAdd({
            submittedBy: emp.name,
            category,
            description: description.trim(),
            site,
            routedTo: [],
        })
        onClose()
    }

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)',
        }} onClick={onClose}>
            <div
                className="animate-pop"
                onClick={e => e.stopPropagation()}
                style={{
                    width: 520, background: 'white', borderRadius: 24,
                    boxShadow: '0 25px 60px -12px rgb(15 23 42 / 0.15)', overflow: 'hidden',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 28px', borderBottom: '1px solid #F1F5F9' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>Submit Improvement Note</h3>
                    <button onClick={onClose} style={{ padding: 6, borderRadius: 10, border: 'none', background: 'transparent', cursor: 'pointer' }}>
                        <X style={{ width: 18, height: 18, color: '#94A3B8' }} />
                    </button>
                </div>

                <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 6, display: 'block' }}>Category</label>
                            <select className="input" value={category} onChange={e => setCategory(e.target.value as any)} style={{ cursor: 'pointer' }}>
                                <option value="safety">Safety</option>
                                <option value="health">Health</option>
                                <option value="infrastructure">Infrastructure</option>
                                <option value="process">Process</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 6, display: 'block' }}>Site</label>
                            <input className="input" value={site} onChange={e => setSite(e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 6, display: 'block' }}>What could be improved? *</label>
                        <textarea className="input" value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Describe the improvement or issue you've noticed..." style={{ resize: 'vertical' as const }} />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, padding: '16px 28px', borderTop: '1px solid #F1F5F9' }}>
                    <button onClick={onClose} className="btn btn-outline" style={{ padding: '10px 20px' }}>Cancel</button>
                    <button onClick={handleSubmit} className="btn btn-amber" style={{ padding: '10px 24px' }}>Submit</button>
                </div>
            </div>
        </div>
    )
}
