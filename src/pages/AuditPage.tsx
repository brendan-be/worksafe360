import { useState } from 'react'
import {
    Shield, Clock, User, Search, FileText, AlertTriangle,
    ClipboardList, UserPlus, FileSignature, Lightbulb,
    ChevronDown, ChevronUp, ArrowRight,
} from 'lucide-react'
import { auditLog, pendingActions, type AuditLogEntry, type PendingAction } from '../data/mockData'

/* ─── Config ─── */
const entityIcon: Record<string, any> = {
    OnboardingCandidate: UserPlus,
    DocumentTemplate: FileText,
    OnboardingDocument: FileSignature,
    Checklist: ClipboardList,
    ImprovementNote: Lightbulb,
    Incident: AlertTriangle,
}

const prioCfg: Record<PendingAction['priority'], { bg: string; tx: string; label: string }> = {
    urgent: { bg: '#FEF2F2', tx: '#DC2626', label: 'Urgent' },
    high: { bg: '#FFFBEB', tx: '#D97706', label: 'High' },
    normal: { bg: '#F1F5F9', tx: '#64748B', label: 'Normal' },
}

type TabView = 'audit-log' | 'pending'

export default function AuditPage() {
    const [tab, setTab] = useState<TabView>('pending')
    const [search, setSearch] = useState('')
    const [expandedId, setExpandedId] = useState<string | null>(null)

    const filteredLog = auditLog.filter(e => {
        if (!search) return true
        const q = search.toLowerCase()
        return e.userName.toLowerCase().includes(q) || e.action.toLowerCase().includes(q) || (e.details || '').toLowerCase().includes(q)
    })

    const filteredActions = pendingActions.filter(a => {
        if (!search) return true
        const q = search.toLowerCase()
        return a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
    })

    const urgentCount = pendingActions.filter(a => a.priority === 'urgent').length

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 1400 }}>
            {/* Header */}
            <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: 15, color: '#64748B' }}>{auditLog.length} audit entries · {pendingActions.length} pending actions</p>
            </div>

            {/* Summary */}
            <div className="animate-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {[
                    { label: 'Pending Actions', value: pendingActions.length, icon: ClipboardList, bg: '#FFFBEB', tx: '#D97706', sub: `${urgentCount} urgent` },
                    { label: 'Audit Log Entries', value: auditLog.length, icon: Shield, bg: '#EFF6FF', tx: '#2563EB', sub: 'Last 7 days' },
                    { label: 'System Events', value: auditLog.filter(e => e.userName === 'System').length, icon: Clock, bg: '#F1F5F9', tx: '#475569', sub: 'Auto-generated' },
                ].map(c => {
                    const CI = c.icon
                    return (
                        <div key={c.label} className="card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ width: 48, height: 48, borderRadius: 16, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <CI style={{ width: 22, height: 22, color: c.tx }} />
                            </div>
                            <div>
                                <p style={{ fontSize: 24, fontWeight: 700, color: '#0F172A' }}>{c.value}</p>
                                <p style={{ fontSize: 12, fontWeight: 500, color: '#64748B' }}>{c.label}</p>
                                <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{c.sub}</p>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Tabs */}
            <div className="animate-in" style={{ display: 'flex', gap: 4, background: 'white', borderRadius: 16, padding: 4, boxShadow: '0 1px 3px rgba(15,23,42,0.04)', width: 'fit-content' }}>
                {([{ key: 'pending' as TabView, label: `Pending Actions (${pendingActions.length})` }, { key: 'audit-log' as TabView, label: `Audit Log (${auditLog.length})` }]).map(t => (
                    <button key={t.key} onClick={() => { setTab(t.key); setSearch('') }}
                        style={{ padding: '10px 24px', borderRadius: 12, border: 'none', fontSize: 13, fontWeight: tab === t.key ? 600 : 500, cursor: 'pointer', background: tab === t.key ? '#FFFBEB' : 'transparent', color: tab === t.key ? '#B45309' : '#64748B', transition: 'all 0.2s' }}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="animate-in" style={{ position: 'relative' }}>
                <Search style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#94A3B8' }} />
                <input type="text" placeholder={`Search ${tab === 'pending' ? 'actions' : 'audit log'}...`} className="input" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 44 }} />
            </div>

            {/* ─── PENDING ACTIONS ─── */}
            {tab === 'pending' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {filteredActions.map((pa, i) => {
                        const pc = prioCfg[pa.priority]
                        const TypeIcon = entityIcon[pa.type] || ClipboardList
                        return (
                            <div key={pa.id} className={`card animate-in delay-${Math.min(i + 1, 4)}`} style={{ padding: '24px 28px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 14, background: pc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <TypeIcon style={{ width: 20, height: 20, color: pc.tx }} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>{pa.title}</p>
                                        <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>{pa.description}</p>
                                    </div>
                                    <span style={{ fontSize: 12, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}><Clock style={{ width: 11, height: 11 }} />Due: {pa.dueDate}</span>
                                    <span style={{ padding: '4px 14px', borderRadius: 10, fontSize: 11, fontWeight: 700, background: pc.bg, color: pc.tx }}>{pc.label}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* ─── AUDIT LOG ─── */}
            {tab === 'audit-log' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {filteredLog.map((entry, i) => {
                        const EIcon = entityIcon[entry.entity] || Shield
                        const isExp = expandedId === entry.id
                        const ts = new Date(entry.timestamp)
                        return (
                            <div key={entry.id} className={`card animate-in delay-${Math.min(i + 1, 4)}`} style={{ padding: '18px 24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 12, background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <EIcon style={{ width: 16, height: 16, color: '#94A3B8' }} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span style={{ fontSize: 13, fontWeight: 600, color: entry.userName === 'System' ? '#94A3B8' : '#1E293B' }}>{entry.userName}</span>
                                            <ArrowRight style={{ width: 10, height: 10, color: '#CBD5E1' }} />
                                            <span style={{ fontSize: 13, color: '#475569' }}>{entry.action}</span>
                                        </div>
                                    </div>
                                    <span style={{ fontSize: 11, color: '#94A3B8', whiteSpace: 'nowrap' }}>
                                        {ts.toLocaleDateString('en-NZ')} {ts.toLocaleTimeString('en-NZ', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    {entry.details && (
                                        <button onClick={() => setExpandedId(isExp ? null : entry.id)} style={{ padding: 4, border: 'none', background: 'none', cursor: 'pointer' }}>
                                            {isExp ? <ChevronUp style={{ width: 14, height: 14, color: '#94A3B8' }} /> : <ChevronDown style={{ width: 14, height: 14, color: '#94A3B8' }} />}
                                        </button>
                                    )}
                                </div>
                                {isExp && entry.details && (
                                    <div className="animate-in" style={{ marginTop: 12, padding: '12px 16px', background: '#FAFAFA', borderRadius: 12, marginLeft: 50 }}>
                                        <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>{entry.details}</p>
                                        {entry.previousValue && (
                                            <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 6 }}>
                                                Changed: <span style={{ color: '#DC2626', textDecoration: 'line-through' }}>{entry.previousValue}</span> → <span style={{ color: '#059669' }}>{entry.newValue}</span>
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
