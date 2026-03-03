import { useState } from 'react'
import {
    Search, Filter, FileText, ShieldCheck, Eye, Upload, Plus,
    Tag, Clock, Users, ChevronDown, MoreVertical, X,
} from 'lucide-react'
import { documentTemplates, type DocumentTemplate } from '../data/mockData'

/* ─── Category config ─── */
const categories: { key: DocumentTemplate['category'] | 'all'; label: string; icon: any }[] = [
    { key: 'all', label: 'All', icon: FileText },
    { key: 'contract', label: 'Contracts', icon: FileText },
    { key: 'policy', label: 'Policies', icon: ShieldCheck },
    { key: 'sop', label: 'SOPs', icon: Eye },
    { key: 'compliance', label: 'Compliance', icon: Tag },
    { key: 'job-description', label: 'Job Descriptions', icon: Users },
]

const reqBadge: Record<DocumentTemplate['requirementType'], { bg: string; tx: string; label: string }> = {
    'mandatory-sign': { bg: '#FEF2F2', tx: '#DC2626', label: 'Must Sign' },
    'mandatory-acknowledge': { bg: '#FFFBEB', tx: '#D97706', label: 'Must Acknowledge' },
    'non-mandatory': { bg: '#F1F5F9', tx: '#64748B', label: 'Optional' },
}

const catColor: Record<string, string> = {
    contract: '#2563EB', policy: '#D97706', sop: '#059669',
    compliance: '#9333EA', 'job-description': '#64748B',
}

/* ─── Upload Modal ─── */
function UploadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    if (!open) return null
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.3)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
            <div className="animate-pop" style={{ position: 'relative', width: 560, background: 'white', borderRadius: 28, padding: 40, boxShadow: '0 24px 48px -12px rgba(15,23,42,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A' }}>Upload Document</h3>
                    <button onClick={onClose} style={{ padding: 6, borderRadius: 12, border: 'none', background: 'transparent', cursor: 'pointer' }}><X style={{ width: 18, height: 18, color: '#94A3B8' }} /></button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64748B', marginBottom: 8 }}>Document Name</label>
                        <input type="text" className="input" placeholder="e.g. Health & Safety Policy" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64748B', marginBottom: 8 }}>Category</label>
                            <select className="input" style={{ appearance: 'auto' }}>
                                <option value="">Select category</option>
                                {categories.filter(c => c.key !== 'all').map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64748B', marginBottom: 8 }}>Requirement Type</label>
                            <select className="input" style={{ appearance: 'auto' }}>
                                <option value="mandatory-sign">Must Sign</option>
                                <option value="mandatory-acknowledge">Must Acknowledge</option>
                                <option value="non-mandatory">Optional</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64748B', marginBottom: 8 }}>Description</label>
                        <textarea className="input" rows={3} placeholder="Brief description of this document..." style={{ resize: 'vertical' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64748B', marginBottom: 8 }}>Role Assignments</label>
                        <input type="text" className="input" placeholder="e.g. all, Farm Hand, Packhouse Operator" />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64748B', marginBottom: 8 }}>File Upload</label>
                        <div style={{ padding: 32, border: '2px dashed #E2E8F0', borderRadius: 18, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                            <Upload style={{ width: 28, height: 28, color: '#CBD5E1', margin: '0 auto 12px' }} />
                            <p style={{ fontSize: 14, fontWeight: 600, color: '#64748B' }}>Drag & drop or click to upload</p>
                            <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>PDF, DOCX, or TXT (max 10MB)</p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 32, justifyContent: 'flex-end' }}>
                    <button onClick={onClose} className="btn btn-outline">Cancel</button>
                    <button onClick={onClose} className="btn btn-amber"><Upload style={{ width: 14, height: 14 }} />Upload Document</button>
                </div>
            </div>
        </div>
    )
}

/* ─── Version History Drawer ─── */
function VersionDrawer({ doc, onClose }: { doc: DocumentTemplate; onClose: () => void }) {
    const versions = [
        { v: doc.version, date: doc.lastUpdated, author: 'Luke Benefield', note: 'Current version', current: true },
        { v: `${parseFloat(doc.version) - 0.1}`, date: '2025-09-20', author: 'Aroha Ngata', note: 'Minor formatting updates', current: false },
        { v: `${parseFloat(doc.version) - 0.5}`, date: '2025-06-15', author: 'Luke Benefield', note: 'Initial release', current: false },
    ]

    return (
        <div className="animate-in" style={{ padding: 28, background: '#FAFAFA', borderRadius: '0 0 24px 24px', borderTop: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Version History</h4>
                <button onClick={onClose} style={{ padding: 4, border: 'none', background: 'none', cursor: 'pointer' }}><X style={{ width: 14, height: 14, color: '#94A3B8' }} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {versions.map((v, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 14, background: v.current ? 'rgba(236,253,245,0.5)' : 'white', border: `1px solid ${v.current ? '#D1FAE5' : '#F1F5F9'}` }}>
                        <div style={{ width: 36, height: 36, borderRadius: 12, background: v.current ? '#ECFDF5' : '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: v.current ? '#059669' : '#94A3B8' }}>v{v.v}</span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 13, fontWeight: 500, color: '#1E293B' }}>{v.note}</p>
                            <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{v.author} · {v.date}</p>
                        </div>
                        {v.current && <span style={{ padding: '2px 10px', borderRadius: 8, fontSize: 10, fontWeight: 700, background: '#ECFDF5', color: '#059669' }}>Current</span>}
                    </div>
                ))}
            </div>
        </div>
    )
}

/* ═══ Main Page ═══ */
export default function Documents() {
    const [activeTab, setActiveTab] = useState<DocumentTemplate['category'] | 'all'>('all')
    const [search, setSearch] = useState('')
    const [reqFilter, setReqFilter] = useState<DocumentTemplate['requirementType'] | ''>('')
    const [showUpload, setShowUpload] = useState(false)
    const [versionDoc, setVersionDoc] = useState<string | null>(null)
    const [menuDoc, setMenuDoc] = useState<string | null>(null)

    /* Filter logic */
    const filtered = documentTemplates.filter(d => {
        if (activeTab !== 'all' && d.category !== activeTab) return false
        if (reqFilter && d.requirementType !== reqFilter) return false
        if (search) {
            const q = search.toLowerCase()
            return d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q)
        }
        return true
    })

    /* Stats */
    const totalDocs = documentTemplates.length
    const mandatoryCount = documentTemplates.filter(d => d.requirementType !== 'non-mandatory').length

    return (
        <>
            <UploadModal open={showUpload} onClose={() => setShowUpload(false)} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 1400 }}>
                {/* Header */}
                <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p style={{ fontSize: 15, color: '#64748B' }}>
                            {totalDocs} documents · {mandatoryCount} mandatory
                        </p>
                    </div>
                    <button onClick={() => setShowUpload(true)} className="btn btn-amber">
                        <Plus style={{ width: 16, height: 16 }} />Upload Document
                    </button>
                </div>

                {/* Category tabs */}
                <div className="animate-in" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {categories.map(cat => {
                        const Icon = cat.icon
                        const isActive = activeTab === cat.key
                        const count = cat.key === 'all' ? documentTemplates.length : documentTemplates.filter(d => d.category === cat.key).length
                        return (
                            <button key={cat.key} onClick={() => setActiveTab(cat.key)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    padding: '10px 20px', borderRadius: 14, border: 'none',
                                    fontSize: 13, fontWeight: isActive ? 600 : 500, cursor: 'pointer',
                                    background: isActive ? '#FFFBEB' : 'white',
                                    color: isActive ? '#B45309' : '#64748B',
                                    boxShadow: isActive ? '0 1px 3px rgba(245,158,11,0.15)' : '0 1px 2px rgba(15,23,42,0.04)',
                                    transition: 'all 0.2s',
                                }}>
                                <Icon style={{ width: 14, height: 14, color: isActive ? '#D97706' : '#94A3B8' }} />
                                {cat.label}
                                <span style={{ padding: '1px 8px', borderRadius: 8, fontSize: 11, fontWeight: 700, background: isActive ? '#FDE68A' : '#F1F5F9', color: isActive ? '#92400E' : '#94A3B8' }}>{count}</span>
                            </button>
                        )
                    })}
                </div>

                {/* Search + filter row */}
                <div className="animate-in" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#94A3B8' }} />
                        <input type="text" placeholder="Search documents..." className="input" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 44 }} />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <select value={reqFilter} onChange={e => setReqFilter(e.target.value as any)} className="input"
                            style={{ paddingLeft: 40, paddingRight: 20, appearance: 'auto', minWidth: 180 }}>
                            <option value="">All types</option>
                            <option value="mandatory-sign">Must Sign</option>
                            <option value="mandatory-acknowledge">Must Acknowledge</option>
                            <option value="non-mandatory">Optional</option>
                        </select>
                        <Filter style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: '#94A3B8', pointerEvents: 'none' }} />
                    </div>
                </div>

                {/* Document grid */}
                {filtered.length === 0 ? (
                    <div className="card animate-in" style={{ padding: 48, textAlign: 'center' }}>
                        <FileText style={{ width: 32, height: 32, color: '#CBD5E1', margin: '0 auto 16px' }} />
                        <p style={{ fontSize: 15, color: '#94A3B8' }}>No documents match your criteria</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 20 }}>
                        {filtered.map((doc, i) => {
                            const badge = reqBadge[doc.requirementType]
                            const color = catColor[doc.category] || '#64748B'
                            const isVersionOpen = versionDoc === doc.id
                            const isMenuOpen = menuDoc === doc.id

                            return (
                                <div key={doc.id} className={`card animate-in delay-${Math.min(i + 1, 4)}`} style={{ overflow: 'hidden' }}>
                                    <div style={{ padding: '24px 28px' }}>
                                        {/* Top row */}
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                                            <div style={{
                                                width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                                                background: `${color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <FileText style={{ width: 20, height: 20, color }} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>{doc.name}</p>
                                                <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 3 }}>{doc.description}</p>
                                            </div>

                                            {/* Kebab menu */}
                                            <div style={{ position: 'relative' }}>
                                                <button onClick={e => { e.stopPropagation(); setMenuDoc(isMenuOpen ? null : doc.id) }}
                                                    style={{ padding: 6, borderRadius: 10, border: 'none', background: 'transparent', cursor: 'pointer' }}>
                                                    <MoreVertical style={{ width: 16, height: 16, color: '#94A3B8' }} />
                                                </button>
                                                {isMenuOpen && (
                                                    <div className="animate-pop" style={{ position: 'absolute', right: 0, top: '100%', marginTop: 4, width: 160, background: 'white', borderRadius: 16, border: '1px solid #F1F5F9', boxShadow: '0 8px 24px -4px rgba(15,23,42,0.1)', zIndex: 10, overflow: 'hidden' }}>
                                                        {['Edit Properties', 'Duplicate', 'Archive'].map(action => (
                                                            <button key={action} onClick={() => setMenuDoc(null)} style={{ width: '100%', padding: '12px 16px', fontSize: 13, color: action === 'Archive' ? '#DC2626' : '#475569', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s' }}
                                                                onMouseEnter={e => (e.target as HTMLElement).style.background = '#F8FAFC'}
                                                                onMouseLeave={e => (e.target as HTMLElement).style.background = 'transparent'}
                                                            >{action}</button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Badges row */}
                                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
                                            <span style={{ padding: '3px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600, background: badge.bg, color: badge.tx }}>{badge.label}</span>
                                            <span style={{ padding: '3px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600, background: `${color}10`, color, textTransform: 'capitalize' }}>{doc.category.replace('-', ' ')}</span>
                                        </div>

                                        {/* Meta row */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 16, paddingTop: 16, borderTop: '1px solid #F8FAFC' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <Tag style={{ width: 12, height: 12, color: '#CBD5E1' }} />
                                                <span style={{ fontSize: 12, color: '#94A3B8' }}>v{doc.version}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <Clock style={{ width: 12, height: 12, color: '#CBD5E1' }} />
                                                <span style={{ fontSize: 12, color: '#94A3B8' }}>{doc.lastUpdated}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <Users style={{ width: 12, height: 12, color: '#CBD5E1' }} />
                                                <span style={{ fontSize: 12, color: '#94A3B8' }}>{doc.roleAssignments.join(', ')}</span>
                                            </div>
                                            <button onClick={() => setVersionDoc(isVersionOpen ? null : doc.id)} style={{
                                                marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4,
                                                padding: '4px 10px', borderRadius: 8, border: 'none', fontSize: 11, fontWeight: 600,
                                                background: isVersionOpen ? '#FFFBEB' : '#F8FAFC', color: isVersionOpen ? '#D97706' : '#94A3B8',
                                                cursor: 'pointer', transition: 'all 0.2s',
                                            }}>
                                                <ChevronDown style={{ width: 12, height: 12, transition: 'transform 0.2s', transform: isVersionOpen ? 'rotate(180deg)' : 'none' }} />
                                                History
                                            </button>
                                        </div>
                                    </div>

                                    {/* Version history (inline drawer) */}
                                    {isVersionOpen && <VersionDrawer doc={doc} onClose={() => setVersionDoc(null)} />}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </>
    )
}
