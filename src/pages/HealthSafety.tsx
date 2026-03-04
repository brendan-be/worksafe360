import { useState } from 'react'
import {
    AlertTriangle, ShieldAlert, Plus, Eye, Search, Filter,
    CheckCircle2, Clock, Circle, MapPin, User, ChevronDown,
    ChevronUp, MessageSquare, ArrowUpRight, X, Flame, AlertCircle,
    Lightbulb, Wrench, Activity, Heart,
} from 'lucide-react'
import { incidents as seedIncidents, improvementNotes, type Incident, type ImprovementNote } from '../data/mockData'

/* ─── Severity config ─── */
const sevCfg: Record<Incident['severity'], { bg: string; tx: string; ring: string; label: string }> = {
    critical: { bg: '#FEF2F2', tx: '#DC2626', ring: '#DC2626', label: 'Critical' },
    high: { bg: '#FFF7ED', tx: '#EA580C', ring: '#EA580C', label: 'High' },
    medium: { bg: '#FFFBEB', tx: '#D97706', ring: '#D97706', label: 'Medium' },
    low: { bg: '#F0FDF4', tx: '#16A34A', ring: '#16A34A', label: 'Low' },
}

const statusCfg: Record<Incident['status'], { icon: any; bg: string; tx: string; label: string }> = {
    open: { icon: Circle, bg: '#FEF2F2', tx: '#DC2626', label: 'Open' },
    investigating: { icon: Eye, bg: '#FFF7ED', tx: '#EA580C', label: 'Investigating' },
    resolved: { icon: CheckCircle2, bg: '#F0FDF4', tx: '#16A34A', label: 'Resolved' },
}

const noteCatCfg: Record<string, { icon: any; bg: string; tx: string; label: string }> = {
    safety: { icon: ShieldAlert, bg: '#FEF2F2', tx: '#DC2626', label: 'Safety' },
    health: { icon: Heart, bg: '#FDF4FF', tx: '#9333EA', label: 'Health' },
    infrastructure: { icon: Wrench, bg: '#EFF6FF', tx: '#2563EB', label: 'Infrastructure' },
    process: { icon: Activity, bg: '#F0FDF4', tx: '#059669', label: 'Process' },
    environment: { icon: Lightbulb, bg: '#F0FDF4', tx: '#059669', label: 'Environment' },
    quality: { icon: AlertCircle, bg: '#FDF4FF', tx: '#9333EA', label: 'Quality' },
    other: { icon: Lightbulb, bg: '#F1F5F9', tx: '#64748B', label: 'Other' },
}

const noteStatusCfg: Record<string, { bg: string; tx: string; label: string }> = {
    submitted: { bg: '#F1F5F9', tx: '#64748B', label: 'Submitted' },
    acknowledged: { bg: '#FFFBEB', tx: '#D97706', label: 'Acknowledged' },
    actioned: { bg: '#F0FDF4', tx: '#059669', label: 'Actioned' },
    closed: { bg: '#F1F5F9', tx: '#475569', label: 'Closed' },
}

const siteOptions = ['Forest Farm', 'Lichfield Farm', 'Masterton Farm', 'Main Office (Lichfield)', 'Sunny Bay Farm']
const reporters = ['Luke Benefield', 'James Wiremu', 'Liam Chen', 'Aroha Ngata', 'Tom Henderson', 'Priya Sharma', 'Mere Tūhoe', 'Rawiri Manu', 'Tane Rewi', 'Karl Braun']

type TabView = 'incidents' | 'improvements'

/* ═══ Report Incident Modal ═══ */
function ReportIncidentModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (inc: Incident) => void }) {
    const [title, setTitle] = useState('')
    const [site, setSite] = useState(siteOptions[0])
    const [severity, setSeverity] = useState<Incident['severity']>('medium')
    const [type, setType] = useState<Incident['type']>('incident')
    const [reportedBy, setReportedBy] = useState(reporters[0])
    const [description, setDescription] = useState('')

    const canSubmit = title.trim().length > 0

    const handleSubmit = () => {
        if (!canSubmit) return
        const newInc: Incident = {
            id: `inc-${Date.now()}`,
            title: title.trim(),
            site,
            severity,
            status: 'open',
            reportedBy,
            reportedDate: new Date().toISOString().slice(0, 10),
            type,
            description: description.trim() || undefined,
        }
        onSubmit(newInc)
    }

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
            <div className="animate-pop" style={{ position: 'relative', width: 580, maxHeight: '85vh', overflow: 'auto', background: 'white', borderRadius: 28, padding: 40, boxShadow: '0 24px 48px -12px rgba(15,23,42,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                    <div>
                        <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A' }}>Report Incident</h3>
                        <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>Log a new incident or near-miss</p>
                    </div>
                    <button onClick={onClose} style={{ padding: 6, borderRadius: 12, border: 'none', background: 'transparent', cursor: 'pointer' }}><X style={{ width: 18, height: 18, color: '#94A3B8' }} /></button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Title */}
                    <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 6, textTransform: 'uppercase' as any, letterSpacing: '0.05em' }}>Incident Title *</label>
                        <input className="input" placeholder="e.g. Slip on wet floor" value={title} onChange={e => setTitle(e.target.value)} />
                    </div>

                    {/* Type toggle */}
                    <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 8, textTransform: 'uppercase' as any, letterSpacing: '0.05em' }}>Type</label>
                        <div style={{ display: 'flex', gap: 8 }}>
                            {(['incident', 'near-miss'] as Incident['type'][]).map(t => (
                                <button key={t} onClick={() => setType(t)} style={{
                                    flex: 1, padding: '12px 16px', borderRadius: 14, border: 'none',
                                    background: type === t ? '#FFFBEB' : '#F8FAFC',
                                    color: type === t ? '#B45309' : '#64748B',
                                    fontWeight: type === t ? 600 : 500, fontSize: 13, cursor: 'pointer',
                                    boxShadow: type === t ? '0 0 0 2px #F59E0B' : 'none',
                                    transition: 'all 0.2s', textTransform: 'capitalize',
                                }}>
                                    {t === 'near-miss' ? '⚠️ Near-miss' : '🔴 Incident'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Site + Severity row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 6, textTransform: 'uppercase' as any, letterSpacing: '0.05em' }}>Site</label>
                            <select className="input" value={site} onChange={e => setSite(e.target.value)} style={{ appearance: 'auto' }}>
                                {siteOptions.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 6, textTransform: 'uppercase' as any, letterSpacing: '0.05em' }}>Severity</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                                {(['low', 'medium', 'high', 'critical'] as Incident['severity'][]).map(s => {
                                    const cfg = sevCfg[s]
                                    return (
                                        <button key={s} onClick={() => setSeverity(s)} style={{
                                            padding: '8px 4px', borderRadius: 10, border: 'none', fontSize: 11, fontWeight: 600,
                                            background: severity === s ? cfg.bg : '#F8FAFC',
                                            color: severity === s ? cfg.tx : '#94A3B8',
                                            boxShadow: severity === s ? `0 0 0 2px ${cfg.ring}` : 'none',
                                            cursor: 'pointer', transition: 'all 0.15s', textTransform: 'capitalize',
                                        }}>
                                            {cfg.label}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Reported by */}
                    <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 6, textTransform: 'uppercase' as any, letterSpacing: '0.05em' }}>Reported By</label>
                        <select className="input" value={reportedBy} onChange={e => setReportedBy(e.target.value)} style={{ appearance: 'auto' }}>
                            {reporters.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 6, textTransform: 'uppercase' as any, letterSpacing: '0.05em' }}>Description</label>
                        <textarea className="input" value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe what happened, where, and any injuries or damage..." rows={4} style={{ resize: 'vertical', fontSize: 13, lineHeight: 1.6 }} />
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32 }}>
                    <button onClick={onClose} className="btn btn-outline">Cancel</button>
                    <button onClick={handleSubmit} className="btn btn-amber" disabled={!canSubmit} style={{ opacity: canSubmit ? 1 : 0.5 }}>
                        <AlertTriangle style={{ width: 14, height: 14 }} />Report Incident
                    </button>
                </div>
            </div>
        </div>
    )
}

/* ═══ Main Page ═══ */
export default function HealthSafety() {
    const [allIncidents, setAllIncidents] = useState<Incident[]>([...seedIncidents])
    const [tab, setTab] = useState<TabView>('incidents')
    const [search, setSearch] = useState('')
    const [sevFilter, setSevFilter] = useState<Incident['severity'] | ''>('')
    const [statusFilter, setStatusFilter] = useState<Incident['status'] | ''>('')
    const [catFilter, setCatFilter] = useState<ImprovementNote['category'] | ''>('')
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [showReport, setShowReport] = useState(false)

    /* Stats */
    const openCount = allIncidents.filter(i => i.status === 'open').length
    const invCount = allIncidents.filter(i => i.status === 'investigating').length
    const critHigh = allIncidents.filter(i => i.severity === 'critical' || i.severity === 'high').length
    const notesCount = improvementNotes.length
    const notesActioned = improvementNotes.filter(n => n.status === 'actioned').length

    /* Filtered data */
    const filteredIncidents = allIncidents.filter(inc => {
        if (sevFilter && inc.severity !== sevFilter) return false
        if (statusFilter && inc.status !== statusFilter) return false
        if (search) {
            const q = search.toLowerCase()
            return inc.title.toLowerCase().includes(q) || inc.site.toLowerCase().includes(q) || inc.reportedBy.toLowerCase().includes(q)
        }
        return true
    })

    const filteredNotes = improvementNotes.filter(note => {
        if (catFilter && note.category !== catFilter) return false
        if (search) {
            const q = search.toLowerCase()
            return note.description.toLowerCase().includes(q) || note.submittedBy.toLowerCase().includes(q) || note.site.toLowerCase().includes(q)
        }
        return true
    })

    const handleAddIncident = (inc: Incident) => {
        setAllIncidents(prev => [inc, ...prev])
        setShowReport(false)
        setTab('incidents')
    }

    return (
        <>
            {showReport && <ReportIncidentModal onClose={() => setShowReport(false)} onSubmit={handleAddIncident} />}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 1400 }}>
                {/* Header */}
                <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: 15, color: '#64748B' }}>
                        {allIncidents.length} incidents · {improvementNotes.length} improvement notes
                    </p>
                    <button onClick={() => setShowReport(true)} className="btn btn-amber"><Plus style={{ width: 16, height: 16 }} />Report Incident</button>
                </div>

                {/* Summary cards */}
                <div className="animate-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                    {[
                        { label: 'Open Incidents', value: openCount, icon: AlertTriangle, bg: '#FEF2F2', tx: '#DC2626' },
                        { label: 'Investigating', value: invCount, icon: Eye, bg: '#FFF7ED', tx: '#EA580C' },
                        { label: 'Critical / High', value: critHigh, icon: Flame, bg: '#FFFBEB', tx: '#D97706' },
                        { label: 'Improvement Notes', value: notesCount, icon: Lightbulb, bg: '#F0FDF4', tx: '#059669', sub: `${notesActioned} actioned` },
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
                                    {(card as any).sub && <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{(card as any).sub}</p>}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Tab toggle */}
                <div className="animate-in" style={{ display: 'flex', gap: 4, background: 'white', borderRadius: 16, padding: 4, boxShadow: '0 1px 3px rgba(15,23,42,0.04)', width: 'fit-content' }}>
                    {(['incidents', 'improvements'] as TabView[]).map(t => (
                        <button key={t} onClick={() => { setTab(t); setSearch(''); setExpandedId(null) }}
                            style={{
                                padding: '10px 24px', borderRadius: 12, border: 'none',
                                fontSize: 13, fontWeight: tab === t ? 600 : 500, cursor: 'pointer',
                                background: tab === t ? '#FFFBEB' : 'transparent',
                                color: tab === t ? '#B45309' : '#64748B',
                                transition: 'all 0.2s',
                            }}>
                            {t === 'incidents' ? `Incidents (${allIncidents.length})` : `Improvement Notes (${improvementNotes.length})`}
                        </button>
                    ))}
                </div>

                {/* ─── INCIDENTS TAB ─── */}
                {tab === 'incidents' && (
                    <>
                        {/* Search + filters */}
                        <div className="animate-in" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                            <div style={{ flex: 1, position: 'relative' }}>
                                <Search style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#94A3B8' }} />
                                <input type="text" placeholder="Search incidents..." className="input" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 44 }} />
                            </div>
                            <select value={sevFilter} onChange={e => setSevFilter(e.target.value as any)} className="input" style={{ minWidth: 150, appearance: 'auto' }}>
                                <option value="">All severities</option>
                                <option value="critical">Critical</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="input" style={{ minWidth: 150, appearance: 'auto' }}>
                                <option value="">All statuses</option>
                                <option value="open">Open</option>
                                <option value="investigating">Investigating</option>
                                <option value="resolved">Resolved</option>
                            </select>
                        </div>

                        {/* Incident list */}
                        {filteredIncidents.length === 0 ? (
                            <div className="card animate-in" style={{ padding: 48, textAlign: 'center' }}>
                                <ShieldAlert style={{ width: 32, height: 32, color: '#CBD5E1', margin: '0 auto 16px' }} />
                                <p style={{ fontSize: 15, color: '#94A3B8' }}>No incidents match your filters</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {filteredIncidents.map((inc, i) => {
                                    const sev = sevCfg[inc.severity]
                                    const st = statusCfg[inc.status]
                                    const SIcon = st.icon
                                    const isExp = expandedId === inc.id

                                    return (
                                        <div key={inc.id} className={`card animate-in delay-${Math.min(i + 1, 4)}`} style={{ overflow: 'hidden' }}>
                                            <div style={{ padding: '24px 28px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: sev.ring, flexShrink: 0, boxShadow: `0 0 0 3px ${sev.bg}` }} />
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                            <p style={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>{inc.title}</p>
                                                            {inc.type === 'near-miss' && <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, background: '#FDF4FF', color: '#9333EA' }}>Near-miss</span>}
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 6 }}>
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#94A3B8' }}><MapPin style={{ width: 11, height: 11 }} />{inc.site}</span>
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#94A3B8' }}><User style={{ width: 11, height: 11 }} />{inc.reportedBy}</span>
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#94A3B8' }}><Clock style={{ width: 11, height: 11 }} />{inc.reportedDate}</span>
                                                        </div>
                                                    </div>
                                                    <span style={{ padding: '4px 14px', borderRadius: 10, fontSize: 11, fontWeight: 700, background: sev.bg, color: sev.tx }}>{sev.label}</span>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 10, background: st.bg }}>
                                                        <SIcon style={{ width: 12, height: 12, color: st.tx }} />
                                                        <span style={{ fontSize: 11, fontWeight: 700, color: st.tx }}>{st.label}</span>
                                                    </div>
                                                    <button onClick={() => setExpandedId(isExp ? null : inc.id)} style={{ padding: 6, border: 'none', background: 'none', cursor: 'pointer' }}>
                                                        {isExp ? <ChevronUp style={{ width: 16, height: 16, color: '#94A3B8' }} /> : <ChevronDown style={{ width: 16, height: 16, color: '#94A3B8' }} />}
                                                    </button>
                                                </div>
                                            </div>
                                            {isExp && inc.description && (
                                                <div className="animate-in" style={{ padding: '0 28px 24px' }}>
                                                    <div style={{ padding: 20, background: '#FAFAFA', borderRadius: 16, border: '1px solid #F1F5F9' }}>
                                                        <p style={{ fontSize: 13, fontWeight: 600, color: '#64748B', marginBottom: 8 }}>Description</p>
                                                        <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7 }}>{inc.description}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </>
                )}

                {/* ─── IMPROVEMENT NOTES TAB ─── */}
                {tab === 'improvements' && (
                    <>
                        <div className="animate-in" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                            <div style={{ flex: 1, position: 'relative' }}>
                                <Search style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#94A3B8' }} />
                                <input type="text" placeholder="Search improvement notes..." className="input" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 44 }} />
                            </div>
                            <select value={catFilter} onChange={e => setCatFilter(e.target.value as any)} className="input" style={{ minWidth: 170, appearance: 'auto' }}>
                                <option value="">All categories</option>
                                <option value="safety">Safety</option>
                                <option value="health">Health</option>
                                <option value="infrastructure">Infrastructure</option>
                                <option value="process">Process</option>
                            </select>
                        </div>
                        {filteredNotes.length === 0 ? (
                            <div className="card animate-in" style={{ padding: 48, textAlign: 'center' }}>
                                <Lightbulb style={{ width: 32, height: 32, color: '#CBD5E1', margin: '0 auto 16px' }} />
                                <p style={{ fontSize: 15, color: '#94A3B8' }}>No improvement notes match your filters</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {filteredNotes.map((note, i) => {
                                    const cat = noteCatCfg[note.category]
                                    const ns = noteStatusCfg[note.status]
                                    const CatIcon = cat.icon
                                    return (
                                        <div key={note.id} className={`card animate-in delay-${Math.min(i + 1, 4)}`} style={{ padding: '24px 28px' }}>
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                                                <div style={{ width: 44, height: 44, borderRadius: 14, background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                    <CatIcon style={{ width: 20, height: 20, color: cat.tx }} />
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{ fontSize: 14, color: '#1E293B', lineHeight: 1.6, marginBottom: 10 }}>{note.description}</p>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                                                        <span style={{ padding: '2px 10px', borderRadius: 8, fontSize: 10, fontWeight: 700, background: cat.bg, color: cat.tx, textTransform: 'capitalize' }}>{cat.label}</span>
                                                        <span style={{ fontSize: 12, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4 }}><User style={{ width: 11, height: 11 }} />{note.submittedBy}</span>
                                                        <span style={{ fontSize: 12, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4 }}><MapPin style={{ width: 11, height: 11 }} />{note.site}</span>
                                                        <span style={{ fontSize: 12, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4 }}><Clock style={{ width: 11, height: 11 }} />{note.date}</span>
                                                    </div>
                                                    <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        <ArrowUpRight style={{ width: 12, height: 12, color: '#94A3B8' }} />
                                                        <span style={{ fontSize: 12, color: '#94A3B8' }}>Routed to:</span>
                                                        {note.routedTo.map(name => (
                                                            <span key={name} style={{ padding: '2px 10px', borderRadius: 8, fontSize: 11, fontWeight: 500, background: '#F8FAFC', color: '#475569' }}>{name}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <span style={{ padding: '5px 16px', borderRadius: 10, fontSize: 11, fontWeight: 700, background: ns.bg, color: ns.tx, whiteSpace: 'nowrap', flexShrink: 0 }}>{ns.label}</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    )
}
