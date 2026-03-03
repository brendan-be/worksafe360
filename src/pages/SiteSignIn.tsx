import { useState } from 'react'
import {
    Clock, MapPin, User, Search, AlertTriangle, CheckCircle2,
    Smartphone, Tablet, Globe, Plus, Monitor, CreditCard,
} from 'lucide-react'
import { timeEntries, signInLog, type TimeEntry, type SiteSignIn } from '../data/mockData'

/* ─── Config ─── */
const methodCfg: Record<TimeEntry['method'], { icon: any; label: string; bg: string; tx: string }> = {
    tablet: { icon: Tablet, label: 'Tablet', bg: '#EFF6FF', tx: '#2563EB' },
    phone: { icon: Smartphone, label: 'Phone', bg: '#F0FDF4', tx: '#059669' },
    geo: { icon: Globe, label: 'Geo', bg: '#FDF4FF', tx: '#9333EA' },
}

const signMethodCfg: Record<SiteSignIn['method'], { icon: any; bg: string; tx: string }> = {
    QR: { icon: Monitor, bg: '#EFF6FF', tx: '#2563EB' },
    Kiosk: { icon: Tablet, bg: '#FFFBEB', tx: '#D97706' },
    RFID: { icon: CreditCard, bg: '#F0FDF4', tx: '#059669' },
    Mobile: { icon: Smartphone, bg: '#FDF4FF', tx: '#9333EA' },
}

type TabView = 'timesheets' | 'site-log'

export default function TimeAttendance() {
    const [tab, setTab] = useState<TabView>('timesheets')
    const [search, setSearch] = useState('')

    const totalHrs = timeEntries.reduce((s, t) => s + t.actual, 0)
    const exceptions = timeEntries.filter(t => t.exception).length
    const onSite = signInLog.filter(s => !s.signOutTime).length

    const filteredTime = timeEntries.filter(t => {
        if (!search) return true
        const q = search.toLowerCase()
        return t.employeeName.toLowerCase().includes(q) || t.site.toLowerCase().includes(q)
    })

    const filteredSign = signInLog.filter(s => {
        if (!search) return true
        const q = search.toLowerCase()
        return s.name.toLowerCase().includes(q) || s.site.toLowerCase().includes(q)
    })

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 1400 }}>
            {/* Header */}
            <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: 15, color: '#64748B' }}>{timeEntries.length} time entries · {signInLog.length} site log entries</p>
            </div>

            {/* Summary */}
            <div className="animate-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                {[
                    { label: 'Total Hours Today', value: totalHrs.toFixed(1), icon: Clock, bg: '#EFF6FF', tx: '#2563EB' },
                    { label: 'Exceptions', value: exceptions, icon: AlertTriangle, bg: '#FFFBEB', tx: '#D97706' },
                    { label: 'Currently On-Site', value: onSite, icon: MapPin, bg: '#F0FDF4', tx: '#059669' },
                    { label: 'Time Entries', value: timeEntries.length, icon: User, bg: '#F1F5F9', tx: '#475569' },
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
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Tabs */}
            <div className="animate-in" style={{ display: 'flex', gap: 4, background: 'white', borderRadius: 16, padding: 4, boxShadow: '0 1px 3px rgba(15,23,42,0.04)', width: 'fit-content' }}>
                {([{ key: 'timesheets' as TabView, label: `Timesheets (${timeEntries.length})` }, { key: 'site-log' as TabView, label: `Site Log (${signInLog.length})` }]).map(t => (
                    <button key={t.key} onClick={() => { setTab(t.key); setSearch('') }}
                        style={{ padding: '10px 24px', borderRadius: 12, border: 'none', fontSize: 13, fontWeight: tab === t.key ? 600 : 500, cursor: 'pointer', background: tab === t.key ? '#FFFBEB' : 'transparent', color: tab === t.key ? '#B45309' : '#64748B', transition: 'all 0.2s' }}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="animate-in" style={{ position: 'relative' }}>
                <Search style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#94A3B8' }} />
                <input type="text" placeholder={`Search ${tab === 'timesheets' ? 'timesheets' : 'site log'}...`} className="input" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 44 }} />
            </div>

            {/* ─── TIMESHEETS ─── */}
            {tab === 'timesheets' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {filteredTime.map((te, i) => {
                        const mc = methodCfg[te.method]
                        const MIcon = mc.icon
                        const variance = te.actual - te.contracted
                        return (
                            <div key={te.id} className={`card animate-in delay-${Math.min(i + 1, 4)}`} style={{ padding: '24px 28px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 14, background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14, fontWeight: 700, color: '#64748B' }}>
                                        {te.employeeName.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>{te.employeeName}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 4 }}>
                                            <span style={{ fontSize: 12, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4 }}><MapPin style={{ width: 11, height: 11 }} />{te.site}</span>
                                            <span style={{ fontSize: 12, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4 }}><Clock style={{ width: 11, height: 11 }} />{te.clockIn} – {te.clockOut || 'on site'}</span>
                                        </div>
                                    </div>

                                    {/* Hours */}
                                    <div style={{ textAlign: 'right', marginRight: 12 }}>
                                        <p style={{ fontSize: 18, fontWeight: 700, color: '#0F172A' }}>{te.actual}h</p>
                                        <p style={{ fontSize: 11, color: variance > 0 ? '#DC2626' : '#059669' }}>
                                            {variance > 0 ? '+' : ''}{variance.toFixed(1)}h vs contracted
                                        </p>
                                    </div>

                                    {/* Method */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 10, background: mc.bg }}>
                                        <MIcon style={{ width: 12, height: 12, color: mc.tx }} />
                                        <span style={{ fontSize: 11, fontWeight: 600, color: mc.tx }}>{mc.label}</span>
                                    </div>

                                    {te.exception && (
                                        <span style={{ padding: '4px 14px', borderRadius: 10, fontSize: 11, fontWeight: 600, background: '#FFFBEB', color: '#D97706' }}>{te.exception}</span>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* ─── SITE LOG ─── */}
            {tab === 'site-log' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {filteredSign.map((si, i) => {
                        const sm = signMethodCfg[si.method]
                        const SMIcon = sm.icon
                        const isOnSite = !si.signOutTime
                        return (
                            <div key={si.id} className={`card animate-in delay-${Math.min(i + 1, 4)}`} style={{ padding: '20px 28px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: isOnSite ? '#10B981' : '#CBD5E1', boxShadow: isOnSite ? '0 0 0 3px rgba(16,185,129,0.2)' : 'none', flexShrink: 0 }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>{si.name}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                                            <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, background: si.type === 'employee' ? '#EFF6FF' : si.type === 'contractor' ? '#FFFBEB' : '#FDF4FF', color: si.type === 'employee' ? '#2563EB' : si.type === 'contractor' ? '#D97706' : '#9333EA', textTransform: 'capitalize' }}>{si.type}</span>
                                            <span style={{ fontSize: 12, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4 }}><MapPin style={{ width: 11, height: 11 }} />{si.site}</span>
                                            <span style={{ fontSize: 12, color: '#94A3B8' }}>In: {si.signInTime}{si.signOutTime ? ` · Out: ${si.signOutTime}` : ''}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 10, background: sm.bg }}>
                                        <SMIcon style={{ width: 12, height: 12, color: sm.tx }} />
                                        <span style={{ fontSize: 11, fontWeight: 600, color: sm.tx }}>{si.method}</span>
                                    </div>
                                    <span style={{ padding: '4px 14px', borderRadius: 10, fontSize: 11, fontWeight: 600, background: isOnSite ? '#ECFDF5' : '#F1F5F9', color: isOnSite ? '#059669' : '#64748B' }}>{isOnSite ? 'On-Site' : 'Signed Out'}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
