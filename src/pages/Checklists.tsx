import { useState } from 'react'
import {
    ClipboardCheck, CheckCircle2, Circle, AlertCircle, Search, Plus,
    ChevronRight, ArrowLeft, FileSignature, Clock, User, MapPin,
    AlertTriangle, MessageSquare, X, Filter,
} from 'lucide-react'
import { checklists as seedChecklists, type Checklist, type ChecklistItem } from '../data/mockData'

/* ─── Type config ─── */
const typeCfg: Record<Checklist['type'], { bg: string; tx: string; label: string }> = {
    'induction': { bg: '#FFFBEB', tx: '#D97706', label: 'Induction' },
    'safety-walk': { bg: '#EFF6FF', tx: '#2563EB', label: 'Safety Walk' },
    'audit': { bg: '#FDF4FF', tx: '#9333EA', label: 'Audit' },
    'competency': { bg: '#F0FDF4', tx: '#16A34A', label: 'Competency' },
    'operational': { bg: '#F1F5F9', tx: '#475569', label: 'Operational' },
}

const statusCfg: Record<ChecklistItem['status'], { icon: any; bg: string; tx: string; label: string }> = {
    'complete': { icon: CheckCircle2, bg: '#ECFDF5', tx: '#059669', label: 'Complete' },
    'partial': { icon: AlertCircle, bg: '#FFFBEB', tx: '#D97706', label: 'Partial' },
    'not-complete': { icon: Circle, bg: '#F1F5F9', tx: '#64748B', label: 'Not Complete' },
}

const typeTabs: { key: string; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'induction', label: 'Induction' },
    { key: 'safety-walk', label: 'Safety Walk' },
    { key: 'audit', label: 'Audit' },
    { key: 'competency', label: 'Competency' },
    { key: 'operational', label: 'Operational' },
]

const siteEmployees = ['Rawiri Manu', 'Liam Chen', 'Priya Sharma', 'Mere Tūhoe', 'Tane Rewi', 'Karl Braun', 'Aroha Ngata', 'Tom Henderson']
const managers = ['James Wiremu', 'Luke Benefield', 'Liam Chen', 'Aroha Ngata']

/* ═══ New Checklist Modal ═══ */
function NewChecklistModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (cl: Checklist) => void }) {
    const [name, setName] = useState('')
    const [type, setType] = useState<Checklist['type']>('induction')
    const [assignedTo, setAssignedTo] = useState(siteEmployees[0])
    const [owner, setOwner] = useState(managers[0])
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
    const [items, setItems] = useState<{ title: string; guidance: string }[]>([{ title: '', guidance: '' }])

    const canSubmit = name.trim().length > 0 && items.some(it => it.title.trim().length > 0)

    const addItem = () => setItems(prev => [...prev, { title: '', guidance: '' }])
    const removeItem = (idx: number) => setItems(prev => prev.filter((_, i) => i !== idx))
    const updateItem = (idx: number, field: 'title' | 'guidance', val: string) => {
        setItems(prev => prev.map((it, i) => i === idx ? { ...it, [field]: val } : it))
    }

    const handleSubmit = () => {
        if (!canSubmit) return
        const validItems = items.filter(it => it.title.trim())
        const newCl: Checklist = {
            id: `cl-${Date.now()}`,
            name: name.trim(),
            type,
            assignedTo,
            owner,
            date,
            items: validItems.map((it, i) => ({
                id: `cli-${Date.now()}-${i}`,
                title: it.title.trim(),
                guidance: it.guidance.trim(),
                status: 'not-complete' as const,
            })),
            passMark: type === 'induction' || type === 'competency' ? 100 : undefined,
        }
        onSubmit(newCl)
    }

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
            <div className="animate-pop" style={{ position: 'relative', width: 620, maxHeight: '85vh', overflow: 'auto', background: 'white', borderRadius: 28, padding: 40, boxShadow: '0 24px 48px -12px rgba(15,23,42,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                    <div>
                        <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A' }}>New Checklist</h3>
                        <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>Create a checklist with items to complete</p>
                    </div>
                    <button onClick={onClose} style={{ padding: 6, borderRadius: 12, border: 'none', background: 'transparent', cursor: 'pointer' }}><X style={{ width: 18, height: 18, color: '#94A3B8' }} /></button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Name */}
                    <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 6, textTransform: 'uppercase' as any, letterSpacing: '0.05em' }}>Checklist Name *</label>
                        <input className="input" placeholder="e.g. Day 1 Induction — Forest Farm" value={name} onChange={e => setName(e.target.value)} />
                    </div>

                    {/* Type selector */}
                    <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 8, textTransform: 'uppercase' as any, letterSpacing: '0.05em' }}>Type</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
                            {(['induction', 'safety-walk', 'audit', 'competency', 'operational'] as Checklist['type'][]).map(t => {
                                const cfg = typeCfg[t]
                                return (
                                    <button key={t} onClick={() => setType(t)} style={{
                                        padding: '10px 6px', borderRadius: 12, border: 'none', fontSize: 11, fontWeight: 600,
                                        background: type === t ? cfg.bg : '#F8FAFC',
                                        color: type === t ? cfg.tx : '#94A3B8',
                                        boxShadow: type === t ? `0 0 0 2px ${cfg.tx}` : 'none',
                                        cursor: 'pointer', transition: 'all 0.15s',
                                    }}>
                                        {cfg.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Assigned + Owner + Date */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 6, textTransform: 'uppercase' as any, letterSpacing: '0.05em' }}>Assigned To</label>
                            <select className="input" value={assignedTo} onChange={e => setAssignedTo(e.target.value)} style={{ appearance: 'auto' }}>
                                {siteEmployees.map(e => <option key={e} value={e}>{e}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 6, textTransform: 'uppercase' as any, letterSpacing: '0.05em' }}>Owner / Manager</label>
                            <select className="input" value={owner} onChange={e => setOwner(e.target.value)} style={{ appearance: 'auto' }}>
                                {managers.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 6, textTransform: 'uppercase' as any, letterSpacing: '0.05em' }}>Date</label>
                            <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} />
                        </div>
                    </div>

                    {/* Items */}
                    <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 8, textTransform: 'uppercase' as any, letterSpacing: '0.05em' }}>Checklist Items *</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {items.map((it, i) => (
                                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <input className="input" placeholder={`Item ${i + 1} title`} value={it.title} onChange={e => updateItem(i, 'title', e.target.value)} style={{ fontSize: 13 }} />
                                        <input className="input" placeholder="Guidance (optional)" value={it.guidance} onChange={e => updateItem(i, 'guidance', e.target.value)} style={{ fontSize: 12, color: '#64748B' }} />
                                    </div>
                                    {items.length > 1 && (
                                        <button onClick={() => removeItem(i)} style={{ padding: 8, borderRadius: 10, border: 'none', background: '#FEF2F2', cursor: 'pointer', marginTop: 4 }}>
                                            <X style={{ width: 14, height: 14, color: '#DC2626' }} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button onClick={addItem} style={{ marginTop: 10, padding: '8px 16px', borderRadius: 10, border: '1px dashed #CBD5E1', background: 'transparent', cursor: 'pointer', fontSize: 12, color: '#64748B', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, width: '100%', justifyContent: 'center' }}>
                            <Plus style={{ width: 12, height: 12 }} />Add Item
                        </button>
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 28 }}>
                    <button onClick={onClose} className="btn btn-outline">Cancel</button>
                    <button onClick={handleSubmit} className="btn btn-amber" disabled={!canSubmit} style={{ opacity: canSubmit ? 1 : 0.5 }}>
                        <ClipboardCheck style={{ width: 14, height: 14 }} />Create Checklist
                    </button>
                </div>
            </div>
        </div>
    )
}

/* ═══ Main Page ═══ */
export default function Checklists() {
    const [lists, setLists] = useState<Checklist[]>(seedChecklists.map(c => ({ ...c, items: c.items.map(i => ({ ...i })) })))
    const [activeTab, setActiveTab] = useState('all')
    const [search, setSearch] = useState('')
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [editingNote, setEditingNote] = useState<string | null>(null)
    const [noteText, setNoteText] = useState('')
    const [showAdd, setShowAdd] = useState(false)

    const handleAddChecklist = (cl: Checklist) => {
        setLists(prev => [cl, ...prev])
        setShowAdd(false)
        setSelectedId(cl.id)
    }

    /* Filter */
    const filtered = lists.filter(cl => {
        if (activeTab !== 'all' && cl.type !== activeTab) return false
        if (search) {
            const q = search.toLowerCase()
            return cl.name.toLowerCase().includes(q) || cl.assignedTo.toLowerCase().includes(q)
        }
        return true
    })

    const selected = selectedId ? lists.find(cl => cl.id === selectedId) : null

    /* Status helpers */
    const getScore = (cl: Checklist) => {
        const done = cl.items.filter(i => i.status === 'complete').length
        return { done, total: cl.items.length, pct: cl.items.length > 0 ? Math.round((done / cl.items.length) * 100) : 0 }
    }

    /* Actions */
    const cycleStatus = (clId: string, itemId: string) => {
        setLists(prev => prev.map(cl => {
            if (cl.id !== clId) return cl
            return {
                ...cl, items: cl.items.map(it => {
                    if (it.id !== itemId) return it
                    const next: ChecklistItem['status'] = it.status === 'not-complete' ? 'partial' : it.status === 'partial' ? 'complete' : 'not-complete'
                    return { ...it, status: next }
                })
            }
        }))
    }

    const saveNote = (clId: string, itemId: string) => {
        setLists(prev => prev.map(cl => {
            if (cl.id !== clId) return cl
            return { ...cl, items: cl.items.map(it => it.id === itemId ? { ...it, notes: noteText } : it) }
        }))
        setEditingNote(null)
        setNoteText('')
    }

    const toggleSignature = (clId: string, who: 'employee' | 'manager') => {
        setLists(prev => prev.map(cl => {
            if (cl.id !== clId) return cl
            if (who === 'employee') return { ...cl, employeeSignature: !cl.employeeSignature, employeeSignedAt: !cl.employeeSignature ? new Date().toISOString() : undefined }
            return { ...cl, managerSignature: !cl.managerSignature, managerSignedAt: !cl.managerSignature ? new Date().toISOString() : undefined }
        }))
    }

    /* ─── Detail view ─── */
    if (selected) {
        const { done, total, pct } = getScore(selected)
        const tcfg = typeCfg[selected.type]
        const passMarkMet = selected.passMark ? pct >= selected.passMark : true

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 900 }}>
                {/* Back + header */}
                <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button onClick={() => setSelectedId(null)} className="btn btn-outline" style={{ gap: 8 }}>
                        <ArrowLeft style={{ width: 16, height: 16 }} />Back to checklists
                    </button>
                    <span style={{ padding: '5px 16px', borderRadius: 14, fontSize: 12, fontWeight: 700, background: tcfg.bg, color: tcfg.tx }}>{tcfg.label}</span>
                </div>

                {/* Header card */}
                <div className="card animate-in" style={{ padding: 36 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', marginBottom: 12 }}>{selected.name}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
                        {[
                            [User, 'Assigned To', selected.assignedTo],
                            [User, 'Owner', selected.owner],
                            [Clock, 'Date', selected.date],
                            [MapPin, 'Progress', `${done}/${total} (${pct}%)`],
                        ].map(([IconComp, label, val]) => {
                            const IC = IconComp as any
                            return (
                                <div key={label as string}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                                        <IC style={{ width: 12, height: 12, color: '#94A3B8' }} />
                                        <span style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' as any, letterSpacing: '0.05em' }}>{label as string}</span>
                                    </div>
                                    <p style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>{val as string}</p>
                                </div>
                            )
                        })}
                    </div>

                    {/* Progress bar */}
                    <div style={{ marginTop: 24 }}>
                        <div style={{ width: '100%', height: 10, background: '#F1F5F9', borderRadius: 5, overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', borderRadius: 5, background: pct === 100 ? '#10B981' : '#FBBF24', transition: 'width 0.5s' }} />
                        </div>
                    </div>

                    {selected.passMark && (
                        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                            {passMarkMet
                                ? <CheckCircle2 style={{ width: 14, height: 14, color: '#10B981' }} />
                                : <AlertTriangle style={{ width: 14, height: 14, color: '#D97706' }} />
                            }
                            <span style={{ fontSize: 12, fontWeight: 600, color: passMarkMet ? '#059669' : '#D97706' }}>
                                Pass mark: {selected.passMark}% — {passMarkMet ? 'Met' : 'Not yet met'}
                            </span>
                        </div>
                    )}
                </div>

                {/* Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {selected.items.map((item, i) => {
                        const scfg = statusCfg[item.status]
                        const SIcon = scfg.icon
                        const isEditingNote = editingNote === item.id

                        return (
                            <div key={item.id} className={`card animate-in delay-${Math.min(i + 1, 4)}`} style={{ padding: '20px 24px' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                                    {/* Toggle */}
                                    <button onClick={() => cycleStatus(selected.id, item.id)} style={{ padding: 0, border: 'none', background: 'none', cursor: 'pointer', marginTop: 2 }}>
                                        <SIcon style={{ width: 22, height: 22, color: scfg.tx }} />
                                    </button>

                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: 15, fontWeight: 600, color: item.status === 'complete' ? '#94A3B8' : '#1E293B', textDecoration: item.status === 'complete' ? 'line-through' : 'none' }}>
                                            {item.title}
                                        </p>
                                        <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 4, lineHeight: 1.5 }}>{item.guidance}</p>

                                        {/* Notes */}
                                        {item.notes && !isEditingNote && (
                                            <div style={{ marginTop: 10, padding: '10px 14px', borderRadius: 12, background: '#FFFBEB', border: '1px solid #FDE68A', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                                <MessageSquare style={{ width: 12, height: 12, color: '#D97706', marginTop: 2, flexShrink: 0 }} />
                                                <p style={{ fontSize: 12, color: '#92400E', lineHeight: 1.5 }}>{item.notes}</p>
                                            </div>
                                        )}

                                        {isEditingNote && (
                                            <div className="animate-in" style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                                                <textarea className="input" rows={2} value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Add a note..." style={{ resize: 'vertical', flex: 1, fontSize: 13 }} />
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                                    <button onClick={() => saveNote(selected.id, item.id)} className="btn btn-amber" style={{ fontSize: 11, padding: '6px 14px' }}>Save</button>
                                                    <button onClick={() => { setEditingNote(null); setNoteText('') }} className="btn btn-outline" style={{ fontSize: 11, padding: '6px 14px' }}>Cancel</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Status badge + note btn */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        {!isEditingNote && (
                                            <button onClick={() => { setEditingNote(item.id); setNoteText(item.notes || '') }} style={{ padding: 6, borderRadius: 10, border: 'none', background: 'transparent', cursor: 'pointer' }}>
                                                <MessageSquare style={{ width: 14, height: 14, color: item.notes ? '#D97706' : '#CBD5E1' }} />
                                            </button>
                                        )}
                                        <span style={{ padding: '4px 14px', borderRadius: 10, fontSize: 11, fontWeight: 600, background: scfg.bg, color: scfg.tx, whiteSpace: 'nowrap' }}>{scfg.label}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Signatures */}
                <div className="card animate-in" style={{ padding: 32 }}>
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 20 }}>Sign-Off</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        {/* Employee */}
                        <div style={{ padding: 20, borderRadius: 18, background: selected.employeeSignature ? 'rgba(236,253,245,0.4)' : '#F8FAFC', border: `1px solid ${selected.employeeSignature ? '#D1FAE5' : '#F1F5F9'}`, transition: 'all 0.2s' }}>
                            <p style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' as any, letterSpacing: '0.05em', marginBottom: 10 }}>Employee</p>
                            <p style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', marginBottom: 12 }}>{selected.assignedTo}</p>
                            {selected.employeeSignature ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <CheckCircle2 style={{ width: 16, height: 16, color: '#10B981' }} />
                                    <span style={{ fontSize: 12, color: '#059669', fontWeight: 600 }}>Signed {selected.employeeSignedAt ? new Date(selected.employeeSignedAt).toLocaleDateString() : ''}</span>
                                </div>
                            ) : (
                                <button onClick={() => toggleSignature(selected.id, 'employee')} className="btn btn-amber" style={{ fontSize: 12, padding: '8px 18px' }}>
                                    <FileSignature style={{ width: 14, height: 14 }} />Sign
                                </button>
                            )}
                        </div>

                        {/* Manager */}
                        <div style={{ padding: 20, borderRadius: 18, background: selected.managerSignature ? 'rgba(236,253,245,0.4)' : '#F8FAFC', border: `1px solid ${selected.managerSignature ? '#D1FAE5' : '#F1F5F9'}`, transition: 'all 0.2s' }}>
                            <p style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' as any, letterSpacing: '0.05em', marginBottom: 10 }}>Manager</p>
                            <p style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', marginBottom: 12 }}>{selected.owner}</p>
                            {selected.managerSignature ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <CheckCircle2 style={{ width: 16, height: 16, color: '#10B981' }} />
                                    <span style={{ fontSize: 12, color: '#059669', fontWeight: 600 }}>Signed {selected.managerSignedAt ? new Date(selected.managerSignedAt).toLocaleDateString() : ''}</span>
                                </div>
                            ) : (
                                <button onClick={() => toggleSignature(selected.id, 'manager')} className="btn btn-amber" style={{ fontSize: 12, padding: '8px 18px' }}>
                                    <FileSignature style={{ width: 14, height: 14 }} />Sign
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    /* ─── List view ─── */
    return (
        <>
            {showAdd && <NewChecklistModal onClose={() => setShowAdd(false)} onSubmit={handleAddChecklist} />}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 1400 }}>
                {/* Header */}
                <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: 15, color: '#64748B' }}>{lists.length} checklists</p>
                    <button onClick={() => setShowAdd(true)} className="btn btn-amber"><Plus style={{ width: 16, height: 16 }} />New Checklist</button>
                </div>

                {/* Type tabs */}
                <div className="animate-in" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {typeTabs.map(tab => {
                        const isActive = activeTab === tab.key
                        const count = tab.key === 'all' ? lists.length : lists.filter(cl => cl.type === tab.key).length
                        return (
                            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    padding: '10px 20px', borderRadius: 14, border: 'none',
                                    fontSize: 13, fontWeight: isActive ? 600 : 500, cursor: 'pointer',
                                    background: isActive ? '#FFFBEB' : 'white',
                                    color: isActive ? '#B45309' : '#64748B',
                                    boxShadow: isActive ? '0 1px 3px rgba(245,158,11,0.15)' : '0 1px 2px rgba(15,23,42,0.04)',
                                    transition: 'all 0.2s',
                                }}>
                                {tab.label}
                                {count > 0 && <span style={{ padding: '1px 8px', borderRadius: 8, fontSize: 11, fontWeight: 700, background: isActive ? '#FDE68A' : '#F1F5F9', color: isActive ? '#92400E' : '#94A3B8' }}>{count}</span>}
                            </button>
                        )
                    })}
                </div>

                {/* Search */}
                <div className="animate-in" style={{ position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#94A3B8' }} />
                    <input type="text" placeholder="Search checklists..." className="input" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 44 }} />
                </div>

                {/* Checklist cards */}
                {filtered.length === 0 ? (
                    <div className="card animate-in" style={{ padding: 48, textAlign: 'center' }}>
                        <ClipboardCheck style={{ width: 32, height: 32, color: '#CBD5E1', margin: '0 auto 16px' }} />
                        <p style={{ fontSize: 15, color: '#94A3B8' }}>No checklists match your criteria</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: 20 }}>
                        {filtered.map((cl, i) => {
                            const tcfg2 = typeCfg[cl.type]
                            const { done, total, pct } = getScore(cl)
                            const hasSigs = cl.employeeSignature || cl.managerSignature

                            return (
                                <div key={cl.id} className={`card animate-in delay-${Math.min(i + 1, 4)}`}
                                    onClick={() => setSelectedId(cl.id)}
                                    style={{ padding: '28px 32px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                                        <div style={{ width: 48, height: 48, borderRadius: 16, background: tcfg2.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <ClipboardCheck style={{ width: 22, height: 22, color: tcfg2.tx }} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>{cl.name}</p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
                                                <span style={{ padding: '2px 10px', borderRadius: 8, fontSize: 10, fontWeight: 700, background: tcfg2.bg, color: tcfg2.tx }}>{tcfg2.label}</span>
                                                <span style={{ fontSize: 12, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4 }}><User style={{ width: 11, height: 11 }} />{cl.assignedTo}</span>
                                                <span style={{ fontSize: 12, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4 }}><Clock style={{ width: 11, height: 11 }} />{cl.date}</span>
                                            </div>
                                        </div>
                                        <ChevronRight style={{ width: 16, height: 16, color: '#CBD5E1', marginTop: 4 }} />
                                    </div>

                                    {/* Progress */}
                                    <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ flex: 1, height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                                            <div style={{ width: `${pct}%`, height: '100%', borderRadius: 4, background: pct === 100 ? '#10B981' : '#FBBF24', transition: 'width 0.5s' }} />
                                        </div>
                                        <span style={{ fontSize: 12, fontWeight: 700, color: pct === 100 ? '#059669' : '#64748B', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{done}/{total}</span>
                                    </div>

                                    {/* Signature status */}
                                    <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            {cl.employeeSignature ? <CheckCircle2 style={{ width: 12, height: 12, color: '#10B981' }} /> : <Circle style={{ width: 12, height: 12, color: '#CBD5E1' }} />}
                                            <span style={{ fontSize: 11, color: cl.employeeSignature ? '#059669' : '#94A3B8' }}>Employee</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            {cl.managerSignature ? <CheckCircle2 style={{ width: 12, height: 12, color: '#10B981' }} /> : <Circle style={{ width: 12, height: 12, color: '#CBD5E1' }} />}
                                            <span style={{ fontSize: 11, color: cl.managerSignature ? '#059669' : '#94A3B8' }}>Manager</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </>
    )
}
