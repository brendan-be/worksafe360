import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Send, CheckCircle2, Clock, Eye, ChevronRight, Plus, UserPlus,
    FileSignature, ShieldCheck, AlertCircle, Search, Filter,
} from 'lucide-react'
import { useStaff } from '../context/StaffContext'
import QuickAddStaffModal from '../components/QuickAddStaffModal'
import type { OnboardingCandidate } from '../data/mockData'

/* ─── Pipeline status config ─── */
const statusCfg: Record<OnboardingCandidate['status'], { icon: any; bg: string; tx: string; label: string }> = {
    'draft':            { icon: Clock,          bg: '#FFF7ED', tx: '#EA580C', label: 'Draft' },
    'sent':             { icon: Send,           bg: '#EFF6FF', tx: '#2563EB', label: 'Sent' },
    'viewed':           { icon: Eye,            bg: '#FFFBEB', tx: '#D97706', label: 'Viewed' },
    'partially-signed': { icon: FileSignature,  bg: '#FDF4FF', tx: '#9333EA', label: 'Partial' },
    'signed':           { icon: CheckCircle2,   bg: '#ECFDF5', tx: '#059669', label: 'Signed' },
    'complete':         { icon: ShieldCheck,     bg: '#F0FDF4', tx: '#16A34A', label: 'Complete' },
}

const pipelineStages: OnboardingCandidate['status'][] = ['draft', 'sent', 'viewed', 'partially-signed', 'signed', 'complete']

export default function Contracts() {
    const navigate = useNavigate()
    const { candidates } = useStaff()
    const [showAdd, setShowAdd] = useState(false)
    const [filterStatus, setFilterStatus] = useState<string | null>(null)
    const [search, setSearch] = useState('')

    /* Pipeline counts */
    const counts: Record<string, number> = {}
    pipelineStages.forEach(s => { counts[s] = 0 })
    candidates.forEach(c => { counts[c.status] = (counts[c.status] || 0) + 1 })

    /* Filter + search */
    const filtered = candidates.filter(c => {
        if (filterStatus && c.status !== filterStatus) return false
        if (search) {
            const q = search.toLowerCase()
            return c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q) || c.site.toLowerCase().includes(q)
        }
        return true
    })

    return (
        <>
            <QuickAddStaffModal open={showAdd} onClose={() => setShowAdd(false)} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 40, maxWidth: 1400 }}>
                {/* Header */}
                <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p style={{ fontSize: 15, color: '#64748B' }}>Track candidates through the onboarding pipeline</p>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button className="btn btn-outline"><Plus style={{ width: 16, height: 16 }} />New Contract</button>
                        <button onClick={() => setShowAdd(true)} className="btn btn-amber"><UserPlus style={{ width: 16, height: 16 }} />Quick Add Staff</button>
                    </div>
                </div>

                {/* Pipeline cards */}
                <div className="animate-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16 }}>
                    {pipelineStages.map(s => {
                        const cfg = statusCfg[s]
                        const Icon = cfg.icon
                        const isActive = filterStatus === s
                        return (
                            <button key={s} onClick={() => setFilterStatus(isActive ? null : s)}
                                className="card" style={{
                                    padding: '20px 18px', display: 'flex', alignItems: 'center', gap: 14,
                                    cursor: 'pointer', border: isActive ? `2px solid ${cfg.tx}` : '1px solid #F1F5F9',
                                    background: isActive ? cfg.bg : 'white', textAlign: 'left' as any,
                                    transition: 'all 0.2s',
                                }}>
                                <div style={{ width: 42, height: 42, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', background: cfg.bg, color: cfg.tx, flexShrink: 0 }}>
                                    <Icon style={{ width: 18, height: 18 }} />
                                </div>
                                <div>
                                    <p style={{ fontSize: 24, fontWeight: 700, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>{counts[s] || 0}</p>
                                    <p style={{ fontSize: 11, color: '#64748B', fontWeight: 500, marginTop: 1 }}>{cfg.label}</p>
                                </div>
                            </button>
                        )
                    })}
                </div>

                {/* Search bar */}
                <div className="animate-in" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#94A3B8' }} />
                        <input
                            type="text" placeholder="Search candidates..." className="input"
                            value={search} onChange={e => setSearch(e.target.value)}
                            style={{ paddingLeft: 44 }}
                        />
                    </div>
                    {filterStatus && (
                        <button onClick={() => setFilterStatus(null)} className="btn btn-outline" style={{ fontSize: 12 }}>
                            <Filter style={{ width: 14, height: 14 }} />Clear filter
                        </button>
                    )}
                </div>

                {/* Candidate list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {filtered.length === 0 && (
                        <div className="card animate-in" style={{ padding: 48, textAlign: 'center' }}>
                            <AlertCircle style={{ width: 32, height: 32, color: '#CBD5E1', margin: '0 auto 16px' }} />
                            <p style={{ fontSize: 15, color: '#94A3B8' }}>No candidates match your criteria</p>
                        </div>
                    )}
                    {filtered.map((c, i) => {
                        const cfg = statusCfg[c.status]
                        const Icon = cfg.icon
                        const totalDocs = c.documents.length
                        const signedDocs = c.documents.filter(d => d.status === 'signed' || d.status === 'acknowledged').length
                        const docPct = totalDocs > 0 ? Math.round((signedDocs / totalDocs) * 100) : 0
                        const initials = c.name.split(' ').map(n => n[0]).join('').slice(0, 2)

                        /* Hard gate progress */
                        const hg = c.hardGates
                        const gatesDone = [hg.regulatoryDocsSigned, hg.mandatoryPoliciesSigned, hg.rightToWorkUploaded, hg.firstDayInduction, hg.firstWeekInduction].filter(Boolean).length

                        return (
                            <div key={c.id} className={`card animate-in delay-${Math.min(i + 1, 4)}`}
                                onClick={() => navigate(`/onboarding/${c.id}`)}
                                style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', gap: 20, cursor: 'pointer', transition: 'all 0.2s' }}
                            >
                                {/* Avatar */}
                                <div style={{
                                    width: 48, height: 48, borderRadius: 16,
                                    background: 'linear-gradient(135deg, #FCD34D, #F59E0B)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white', fontWeight: 700, fontSize: 15, flexShrink: 0,
                                }}>
                                    {initials}
                                </div>

                                {/* Name + meta */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>{c.name}</p>
                                    <p style={{ fontSize: 13, color: '#64748B', marginTop: 3 }}>{c.role} · {c.site}</p>
                                </div>

                                {/* Document progress */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 140 }}>
                                    <div style={{ flex: 1, height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${docPct}%`, height: '100%', borderRadius: 4,
                                            background: docPct === 100 ? '#10B981' : '#FBBF24',
                                            transition: 'width 0.5s ease',
                                        }} />
                                    </div>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: '#64748B', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                                        {signedDocs}/{totalDocs} docs
                                    </span>
                                </div>

                                {/* Hard gates */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 100 }}>
                                    <ShieldCheck style={{ width: 14, height: 14, color: gatesDone === 5 ? '#10B981' : '#CBD5E1' }} />
                                    <span style={{ fontSize: 12, fontWeight: 600, color: gatesDone === 5 ? '#059669' : '#94A3B8', fontVariantNumeric: 'tabular-nums' }}>
                                        {gatesDone}/5 gates
                                    </span>
                                </div>

                                {/* Status badge */}
                                <span style={{
                                    padding: '5px 16px', borderRadius: 14, fontSize: 11, fontWeight: 700,
                                    background: cfg.bg, color: cfg.tx, whiteSpace: 'nowrap',
                                }}>
                                    {cfg.label}
                                </span>

                                <ChevronRight style={{ width: 16, height: 16, color: '#CBD5E1' }} />
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}
