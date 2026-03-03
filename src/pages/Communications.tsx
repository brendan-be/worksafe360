import { useState } from 'react'
import {
    Megaphone, Calendar, Star, Search, Clock, MapPin, User,
    ChevronDown, ChevronUp, Paperclip, Plus, X, Heart,
    Trophy, Sparkles, Eye, MessageSquare, Users, Zap,
} from 'lucide-react'
import { announcements as seedAnn, calendarEvents, recognitions, type Announcement, type CalendarEvent, type Recognition } from '../data/mockData'

const targets = ['Company-wide', 'Forest Farm', 'Lichfield Farm', 'Masterton Farm', 'Sunny Bay Farm', 'Main Office (Lichfield)']

/* ═══ New Announcement Modal ═══ */
function NewAnnouncementModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (a: Announcement) => void }) {
    const [title, setTitle] = useState('')
    const [type, setType] = useState<'announcement' | 'memo'>('announcement')
    const [target, setTarget] = useState(targets[0])
    const [content, setContent] = useState('')

    const canSubmit = title.trim().length > 0 && content.trim().length > 0

    const handleSubmit = () => {
        if (!canSubmit) return
        onSubmit({
            id: `a-${Date.now()}`,
            title: title.trim(),
            type,
            target,
            content: content.trim(),
            author: 'Luke Benefield',
            publishedAt: new Date().toISOString().slice(0, 10),
        })
    }

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
            <div className="animate-pop" style={{ position: 'relative', width: 560, background: 'white', borderRadius: 28, padding: 40, boxShadow: '0 24px 48px -12px rgba(15,23,42,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                    <div>
                        <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A' }}>New Announcement</h3>
                        <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>Share an update with your team</p>
                    </div>
                    <button onClick={onClose} style={{ padding: 6, borderRadius: 12, border: 'none', background: 'transparent', cursor: 'pointer' }}><X style={{ width: 18, height: 18, color: '#94A3B8' }} /></button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 6, textTransform: 'uppercase' as any, letterSpacing: '0.05em' }}>Title *</label>
                        <input className="input" placeholder="e.g. Weekly team update" value={title} onChange={e => setTitle(e.target.value)} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 8, textTransform: 'uppercase' as any, letterSpacing: '0.05em' }}>Type</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                                {(['announcement', 'memo'] as const).map(t => (
                                    <button key={t} onClick={() => setType(t)} style={{
                                        padding: '10px 6px', borderRadius: 12, border: 'none', fontSize: 12, fontWeight: 600,
                                        background: type === t ? (t === 'memo' ? '#FEF2F2' : '#EFF6FF') : '#F8FAFC',
                                        color: type === t ? (t === 'memo' ? '#DC2626' : '#2563EB') : '#94A3B8',
                                        boxShadow: type === t ? `0 0 0 2px ${t === 'memo' ? '#DC2626' : '#2563EB'}` : 'none',
                                        cursor: 'pointer', transition: 'all 0.15s', textTransform: 'capitalize',
                                    }}>
                                        {t === 'memo' ? '📋 Memo' : '📢 Announcement'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 8, textTransform: 'uppercase' as any, letterSpacing: '0.05em' }}>Target Audience</label>
                            <select className="input" value={target} onChange={e => setTarget(e.target.value)} style={{ appearance: 'auto' }}>
                                {targets.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 6, textTransform: 'uppercase' as any, letterSpacing: '0.05em' }}>Content *</label>
                        <textarea className="input" rows={4} placeholder="Write your announcement..." value={content} onChange={e => setContent(e.target.value)} style={{ resize: 'vertical' }} />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 28 }}>
                    <button onClick={onClose} className="btn btn-outline">Cancel</button>
                    <button onClick={handleSubmit} className="btn btn-amber" disabled={!canSubmit} style={{ opacity: canSubmit ? 1 : 0.5 }}>
                        <Megaphone style={{ width: 14, height: 14 }} />Publish
                    </button>
                </div>
            </div>
        </div>
    )
}

/* ─── Config ─── */
const catCfg: Record<CalendarEvent['category'], { bg: string; tx: string; label: string; emoji: string }> = {
    company: { bg: '#EFF6FF', tx: '#2563EB', label: 'Company', emoji: '🏢' },
    site: { bg: '#F0FDF4', tx: '#059669', label: 'Site', emoji: '📍' },
    training: { bg: '#FFFBEB', tx: '#D97706', label: 'Training', emoji: '📚' },
    social: { bg: '#FDF4FF', tx: '#9333EA', label: 'Social', emoji: '🎉' },
    operational: { bg: '#FEF2F2', tx: '#DC2626', label: 'Operational', emoji: '⚙️' },
    'one-on-one': { bg: '#F1F5F9', tx: '#475569', label: '1:1', emoji: '💬' },
}

const recTypeCfg: Record<Recognition['type'], { bg: string; tx: string; label: string; icon: any }> = {
    values: { bg: '#FFFBEB', tx: '#D97706', label: 'Values', icon: Heart },
    behavioural: { bg: '#F0FDF4', tx: '#059669', label: 'Behavioural', icon: Zap },
    'shout-out': { bg: '#EFF6FF', tx: '#2563EB', label: 'Shout-out', icon: Megaphone },
    'high-performance': { bg: '#FDF4FF', tx: '#9333EA', label: 'High Performance', icon: Trophy },
}

type TabView = 'announcements' | 'calendar' | 'recognition'

export default function Communications() {
    const [annList, setAnnList] = useState<Announcement[]>([...seedAnn])
    const [tab, setTab] = useState<TabView>('announcements')
    const [search, setSearch] = useState('')
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [calCat, setCalCat] = useState<CalendarEvent['category'] | ''>('')
    const [showAdd, setShowAdd] = useState(false)

    const handleAddAnn = (a: Announcement) => {
        setAnnList(prev => [a, ...prev])
        setShowAdd(false)
    }

    /* Filtered data */
    const filteredAnn = annList.filter(a => {
        if (!search) return true
        const q = search.toLowerCase()
        return a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q)
    })

    const filteredCal = calendarEvents.filter(e => {
        if (calCat && e.category !== calCat) return false
        if (search) {
            const q = search.toLowerCase()
            return e.title.toLowerCase().includes(q) || (e.description || '').toLowerCase().includes(q)
        }
        return true
    }).sort((a, b) => a.date.localeCompare(b.date))

    const filteredRec = recognitions.filter(r => {
        if (!search) return true
        const q = search.toLowerCase()
        return r.to.toLowerCase().includes(q) || r.from.toLowerCase().includes(q) || r.message.toLowerCase().includes(q)
    })

    return (
        <>
            {showAdd && <NewAnnouncementModal onClose={() => setShowAdd(false)} onSubmit={handleAddAnn} />}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 1400 }}>
                {/* Header */}
                <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: 15, color: '#64748B' }}>
                        {annList.length} announcements · {calendarEvents.length} events · {recognitions.length} recognitions
                    </p>
                    <button onClick={() => setShowAdd(true)} className="btn btn-amber"><Plus style={{ width: 16, height: 16 }} />New Announcement</button>
                </div>

                {/* Summary cards */}
                <div className="animate-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                    {[
                        { label: 'Announcements', value: annList.length, icon: Megaphone, bg: '#EFF6FF', tx: '#2563EB', sub: `${annList.filter(a => a.type === 'memo').length} memos` },
                        { label: 'Upcoming Events', value: calendarEvents.length, icon: Calendar, bg: '#FFFBEB', tx: '#D97706', sub: `${calendarEvents.filter(e => e.category === 'training').length} training` },
                        { label: 'Recognitions', value: recognitions.length, icon: Star, bg: '#FDF4FF', tx: '#9333EA', sub: 'This month' },
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
                                    <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{card.sub}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Tabs */}
                <div className="animate-in" style={{ display: 'flex', gap: 4, background: 'white', borderRadius: 16, padding: 4, boxShadow: '0 1px 3px rgba(15,23,42,0.04)', width: 'fit-content' }}>
                    {([
                        { key: 'announcements' as TabView, label: `Announcements (${annList.length})` },
                        { key: 'calendar' as TabView, label: `Calendar (${calendarEvents.length})` },
                        { key: 'recognition' as TabView, label: `Recognition (${recognitions.length})` },
                    ]).map(t => (
                        <button key={t.key} onClick={() => { setTab(t.key); setSearch('') }}
                            style={{
                                padding: '10px 24px', borderRadius: 12, border: 'none',
                                fontSize: 13, fontWeight: tab === t.key ? 600 : 500, cursor: 'pointer',
                                background: tab === t.key ? '#FFFBEB' : 'transparent',
                                color: tab === t.key ? '#B45309' : '#64748B',
                                transition: 'all 0.2s',
                            }}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* ─── ANNOUNCEMENTS TAB ─── */}
                {tab === 'announcements' && (
                    <>
                        <div className="animate-in" style={{ position: 'relative' }}>
                            <Search style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#94A3B8' }} />
                            <input type="text" placeholder="Search announcements..." className="input" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 44 }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {filteredAnn.map((ann, i) => {
                                const isExp = expandedId === ann.id
                                return (
                                    <div key={ann.id} className={`card animate-in delay-${Math.min(i + 1, 4)}`} style={{ padding: '28px 32px' }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                                            <div style={{
                                                width: 48, height: 48, borderRadius: 16, flexShrink: 0,
                                                background: ann.type === 'memo' ? '#FEF2F2' : '#EFF6FF',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <Megaphone style={{ width: 22, height: 22, color: ann.type === 'memo' ? '#DC2626' : '#2563EB' }} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                                    <p style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>{ann.title}</p>
                                                    <span style={{ padding: '2px 10px', borderRadius: 8, fontSize: 10, fontWeight: 700, background: ann.type === 'memo' ? '#FEF2F2' : '#EFF6FF', color: ann.type === 'memo' ? '#DC2626' : '#2563EB', textTransform: 'capitalize' }}>{ann.type}</span>
                                                </div>
                                                <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, marginBottom: 12 }}>{ann.content}</p>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                                    <span style={{ fontSize: 12, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4 }}><User style={{ width: 11, height: 11 }} />{ann.author}</span>
                                                    <span style={{ fontSize: 12, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4 }}><Clock style={{ width: 11, height: 11 }} />{ann.publishedAt}</span>
                                                    <span style={{ fontSize: 12, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4 }}><Users style={{ width: 11, height: 11 }} />{ann.target}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}

                {/* ─── CALENDAR TAB ─── */}
                {tab === 'calendar' && (
                    <>
                        <div className="animate-in" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                            <div style={{ flex: 1, position: 'relative' }}>
                                <Search style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#94A3B8' }} />
                                <input type="text" placeholder="Search events..." className="input" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 44 }} />
                            </div>
                            <select value={calCat} onChange={e => setCalCat(e.target.value as any)} className="input" style={{ minWidth: 160, appearance: 'auto' }}>
                                <option value="">All categories</option>
                                <option value="company">Company</option>
                                <option value="site">Site</option>
                                <option value="training">Training</option>
                                <option value="social">Social</option>
                                <option value="operational">Operational</option>
                                <option value="one-on-one">1:1</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {filteredCal.map((ev, i) => {
                                const cc = catCfg[ev.category]
                                return (
                                    <div key={ev.id} className={`card animate-in delay-${Math.min(i + 1, 4)}`} style={{ padding: '24px 28px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                            {/* Date block */}
                                            <div style={{ width: 60, height: 64, borderRadius: 16, background: '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #F1F5F9' }}>
                                                <p style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>{new Date(ev.date + 'T00:00:00').toLocaleDateString('en-NZ', { month: 'short' })}</p>
                                                <p style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{new Date(ev.date + 'T00:00:00').getDate()}</p>
                                            </div>

                                            {/* Event info */}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <p style={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>{ev.title}</p>
                                                    <span style={{ padding: '2px 10px', borderRadius: 8, fontSize: 10, fontWeight: 700, background: cc.bg, color: cc.tx }}>{cc.emoji} {cc.label}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 6 }}>
                                                    <span style={{ fontSize: 12, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4 }}><Clock style={{ width: 11, height: 11 }} />{ev.time}{ev.endTime ? ` – ${ev.endTime}` : ''}</span>
                                                    <span style={{ fontSize: 12, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4 }}><Users style={{ width: 11, height: 11 }} />{ev.target}</span>
                                                    {ev.site && <span style={{ fontSize: 12, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4 }}><MapPin style={{ width: 11, height: 11 }} />{ev.site}</span>}
                                                </div>
                                                {ev.description && <p style={{ fontSize: 13, color: '#64748B', marginTop: 8, lineHeight: 1.5 }}>{ev.description}</p>}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}

                {/* ─── RECOGNITION TAB ─── */}
                {tab === 'recognition' && (
                    <>
                        <div className="animate-in" style={{ position: 'relative' }}>
                            <Search style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#94A3B8' }} />
                            <input type="text" placeholder="Search recognitions..." className="input" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 44 }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {filteredRec.map((rec, i) => {
                                const rt = recTypeCfg[rec.type]
                                const RIcon = rt.icon
                                return (
                                    <div key={rec.id} className={`card animate-in delay-${Math.min(i + 1, 4)}`} style={{ padding: '28px 32px' }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                                            <div style={{ width: 48, height: 48, borderRadius: 16, background: rt.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <RIcon style={{ width: 22, height: 22, color: rt.tx }} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                                    <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{rec.from}</span>
                                                    <span style={{ fontSize: 13, color: '#94A3B8' }}>→</span>
                                                    <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{rec.to}</span>
                                                    <span style={{ padding: '2px 10px', borderRadius: 8, fontSize: 10, fontWeight: 700, background: rt.bg, color: rt.tx }}>{rt.label}</span>
                                                </div>
                                                {rec.value && (
                                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 10, background: '#FFFBEB', marginBottom: 10 }}>
                                                        <Sparkles style={{ width: 12, height: 12, color: '#D97706' }} />
                                                        <span style={{ fontSize: 12, fontWeight: 600, color: '#92400E' }}>{rec.value}</span>
                                                    </div>
                                                )}
                                                <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7 }}>{rec.message}</p>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 10 }}>
                                                    <span style={{ fontSize: 12, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4 }}><Clock style={{ width: 11, height: 11 }} />{rec.date}</span>
                                                    <span style={{ fontSize: 12, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4 }}><Eye style={{ width: 11, height: 11 }} />{rec.visibility}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}
            </div>
        </>
    )
}
