import { useState } from 'react'
import {
    Search, Lightbulb, MapPin, Clock, User, ChevronDown, ChevronUp,
    AlertTriangle, CheckCircle2, Circle, Filter, X, Plus, Send,
} from 'lucide-react'
import { type ImprovementNote } from '../data/mockData'
import { useStaff } from '../context/StaffContext'
import { useToast } from '../components/Toast'

const catCfg: Record<string, { bg: string; tx: string; label: string }> = {
    safety: { bg: '#FEF2F2', tx: '#DC2626', label: 'Safety' },
    process: { bg: '#EFF6FF', tx: '#2563EB', label: 'Process' },
    infrastructure: { bg: '#FFFBEB', tx: '#D97706', label: 'Infrastructure' },
    environment: { bg: '#F0FDF4', tx: '#059669', label: 'Environment' },
    quality: { bg: '#FDF4FF', tx: '#9333EA', label: 'Quality' },
    other: { bg: '#F1F5F9', tx: '#64748B', label: 'Other' },
}

const statusCfg: Record<string, { bg: string; tx: string; label: string }> = {
    submitted: { bg: '#EFF6FF', tx: '#2563EB', label: 'Submitted' },
    acknowledged: { bg: '#FFFBEB', tx: '#D97706', label: 'Acknowledged' },
    actioned: { bg: '#ECFDF5', tx: '#059669', label: 'Actioned' },
    closed: { bg: '#F1F5F9', tx: '#64748B', label: 'Closed' },
}

export default function Improvements() {
    const { improvementNotes: allNotes, updateImprovementStatus } = useStaff()
    const { showToast } = useToast()
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [catFilter, setCatFilter] = useState('')

    const filtered = allNotes.filter(n => {
        if (statusFilter && n.status !== statusFilter) return false
        if (catFilter && n.category !== catFilter) return false
        if (search) {
            const q = search.toLowerCase()
            return n.description.toLowerCase().includes(q) || n.submittedBy.toLowerCase().includes(q) || n.site.toLowerCase().includes(q)
        }
        return true
    }).sort((a, b) => b.date.localeCompare(a.date))

    const handleStatusChange = (id: string, newStatus: ImprovementNote['status']) => {
        updateImprovementStatus(id, newStatus)
        const labels: Record<string, string> = { acknowledged: 'acknowledged', actioned: 'marked as actioned', closed: 'closed' }
        showToast(`Improvement note ${labels[newStatus] || 'updated'}`)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 1400 }}>
            {/* Header */}
            <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: 15, color: '#64748B' }}>
                    {allNotes.length} improvement notes · {allNotes.filter(n => n.status === 'submitted').length} pending review
                </p>
            </div>

            {/* Stats cards */}
            <div className="animate-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                {[
                    { label: 'Total Notes', value: allNotes.length, icon: Lightbulb, bg: '#FFFBEB', tx: '#D97706' },
                    { label: 'Submitted', value: allNotes.filter(n => n.status === 'submitted').length, icon: Send, bg: '#EFF6FF', tx: '#2563EB' },
                    { label: 'Acknowledged', value: allNotes.filter(n => n.status === 'acknowledged').length, icon: Circle, bg: '#FFFBEB', tx: '#D97706' },
                    { label: 'Actioned', value: allNotes.filter(n => n.status === 'actioned').length, icon: CheckCircle2, bg: '#ECFDF5', tx: '#059669' },
                ].map(card => {
                    const CIcon = card.icon
                    return (
                        <div key={card.label} className="card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ width: 48, height: 48, borderRadius: 16, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <CIcon style={{ width: 22, height: 22, color: card.tx }} />
                            </div>
                            <div>
                                <p style={{ fontSize: 24, fontWeight: 700, color: '#0F172A' }}>{card.value}</p>
                                <p style={{ fontSize: 12, fontWeight: 500, color: '#64748B' }}>{card.label}</p>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Filters */}
            <div className="animate-in" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#94A3B8' }} />
                    <input type="text" placeholder="Search notes..." className="input" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 44 }} />
                </div>
                <select className="input" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ minWidth: 150, appearance: 'auto' }}>
                    <option value="">All statuses</option>
                    <option value="submitted">Submitted</option>
                    <option value="acknowledged">Acknowledged</option>
                    <option value="actioned">Actioned</option>
                    <option value="closed">Closed</option>
                </select>
                <select className="input" value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ minWidth: 150, appearance: 'auto' }}>
                    <option value="">All categories</option>
                    {Object.entries(catCfg).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
            </div>

            {/* Notes list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filtered.map((note, i) => {
                    const cat = catCfg[note.category] || catCfg.other
                    const status = statusCfg[note.status] || statusCfg.submitted
                    return (
                        <div key={note.id} className={`card animate-in delay-${Math.min(i + 1, 4)}`} style={{ overflow: 'hidden' }}>
                            <div style={{ padding: '24px 28px' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                                    <div style={{ width: 48, height: 48, borderRadius: 16, background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Lightbulb style={{ width: 22, height: 22, color: cat.tx }} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                            <span style={{ padding: '2px 10px', borderRadius: 8, fontSize: 10, fontWeight: 700, background: cat.bg, color: cat.tx, textTransform: 'uppercase' }}>{cat.label}</span>
                                            <span style={{ fontSize: 12, color: '#94A3B8' }}>{note.site}</span>
                                            <span style={{ marginLeft: 'auto', padding: '3px 12px', borderRadius: 8, fontSize: 10, fontWeight: 700, background: status.bg, color: status.tx, textTransform: 'uppercase' }}>{status.label}</span>
                                        </div>
                                        <p style={{ fontSize: 14, color: '#1E293B', lineHeight: 1.6 }}>{note.description}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 10 }}>
                                            <span style={{ fontSize: 12, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4 }}><User style={{ width: 11, height: 11 }} />{note.submittedBy}</span>
                                            <span style={{ fontSize: 12, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4 }}><Clock style={{ width: 11, height: 11 }} />{note.date}</span>
                                            <span style={{ fontSize: 12, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4 }}><Send style={{ width: 11, height: 11 }} />Routed to: {note.routedTo.join(', ')}</span>
                                        </div>

                                        {/* Action buttons */}
                                        {note.status !== 'closed' && (
                                            <div style={{ display: 'flex', gap: 8, marginTop: 14, paddingTop: 14, borderTop: '1px solid #F1F5F9' }}>
                                                {note.status === 'submitted' && (
                                                    <button onClick={() => handleStatusChange(note.id, 'acknowledged')} style={{
                                                        padding: '6px 16px', borderRadius: 10, border: 'none', fontSize: 12, fontWeight: 600,
                                                        background: '#FFFBEB', color: '#B45309', cursor: 'pointer', transition: 'all 0.15s',
                                                        display: 'flex', alignItems: 'center', gap: 6,
                                                    }}>
                                                        <Circle style={{ width: 12, height: 12 }} />Acknowledge
                                                    </button>
                                                )}
                                                {(note.status === 'submitted' || note.status === 'acknowledged') && (
                                                    <button onClick={() => handleStatusChange(note.id, 'actioned')} style={{
                                                        padding: '6px 16px', borderRadius: 10, border: 'none', fontSize: 12, fontWeight: 600,
                                                        background: '#ECFDF5', color: '#059669', cursor: 'pointer', transition: 'all 0.15s',
                                                        display: 'flex', alignItems: 'center', gap: 6,
                                                    }}>
                                                        <CheckCircle2 style={{ width: 12, height: 12 }} />Mark Actioned
                                                    </button>
                                                )}
                                                {note.status === 'actioned' && (
                                                    <button onClick={() => handleStatusChange(note.id, 'closed')} style={{
                                                        padding: '6px 16px', borderRadius: 10, border: 'none', fontSize: 12, fontWeight: 600,
                                                        background: '#F1F5F9', color: '#64748B', cursor: 'pointer', transition: 'all 0.15s',
                                                        display: 'flex', alignItems: 'center', gap: 6,
                                                    }}>
                                                        <X style={{ width: 12, height: 12 }} />Close
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
