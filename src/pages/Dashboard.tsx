import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, AlertTriangle, ShieldCheck, MapPin, ChevronRight, FileText, UserPlus, TrendingUp, Heart, UserCheck, Bot, Download } from 'lucide-react'
import { dashboardStats, pendingActions, certifications, incidents, sites, onboardingTasks } from '../data/mockData'
import QuickAddStaffModal from '../components/QuickAddStaffModal'

function useCounter(target: number, dur = 1200) {
    const [c, setC] = useState(0)
    useEffect(() => {
        let v = 0; const step = Math.ceil(target / (dur / 16))
        const t = setInterval(() => { v += step; if (v >= target) { setC(target); clearInterval(t) } else setC(v) }, 16)
        return () => clearInterval(t)
    }, [target, dur])
    return c
}

function greeting() { const h = new Date().getHours(); return h < 12 ? 'Kia Ora' : h < 17 ? 'Kia Ora' : 'Kia Ora' }

export default function Dashboard() {
    const obDone = onboardingTasks.filter(t => t.completed).length
    const pendSig = useCounter(2)
    const expCert = useCounter(1)
    const obActive = useCounter(1)
    const [showAdd, setShowAdd] = useState(false)
    const nav = useNavigate()

    const exportReport = () => {
        const today = new Date().toISOString().slice(0, 10)
        const rows: string[][] = [
            ['Better Eggs HRIS — Dashboard Report'],
            [`Generated: ${today}`],
            [],
            ['OVERVIEW'],
            ['Metric', 'Value'],
            ['Total Employees', String(dashboardStats.totalEmployees)],
            ['Active On Site', String(dashboardStats.activeOnSite)],
            ['Open Incidents', String(dashboardStats.openIncidents)],
            ['Expiring Certifications', String(dashboardStats.expiringCerts)],
            ['Pending Contracts', String(dashboardStats.pendingContracts)],
            ['Onboarding In Progress', String(dashboardStats.onboardingInProgress)],
            ['Sites Active', String(dashboardStats.sitesActive)],
            ['Compliance Rate', `${dashboardStats.complianceRate}%`],
            ['Learning Completion', `${dashboardStats.learningCompletion}%`],
            ['Pending Signatures', String(dashboardStats.pendingSignatures)],
            ['Improvement Notes', String(dashboardStats.improvementNotes)],
            ['Recognitions This Month', String(dashboardStats.recognitionsThisMonth)],
            [],
            ['PENDING ACTIONS'],
            ['Title', 'Priority', 'Due Date', 'Description'],
            ...pendingActions.map(a => [a.title, a.priority, a.dueDate, a.description]),
            [],
            ['EXPIRING / EXPIRED CERTIFICATIONS'],
            ['Employee', 'Certification', 'Status', 'Days Remaining'],
            ...certifications.filter(c => c.status !== 'valid').map(c => [c.employeeName, c.type, c.status, String(c.daysRemaining)]),
            [],
            ['RECENT INCIDENTS'],
            ['Title', 'Site', 'Severity', 'Status', 'Reported Date'],
            ...incidents.map(i => [i.title, i.site, i.severity, i.status, i.reportedDate]),
            [],
            ['SITE OCCUPANCY'],
            ['Site', 'Current', 'Max Capacity', 'Utilisation'],
            ...sites.map(s => [s.name, String(s.currentOccupancy), String(s.maxCapacity), `${Math.round((s.currentOccupancy / s.maxCapacity) * 100)}%`]),
        ]
        const csv = rows.map(r => r.map(c => `"${(c || '').replace(/"/g, '""')}"`).join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `better-eggs-report-${today}.csv`
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <>
            <QuickAddStaffModal open={showAdd} onClose={() => setShowAdd(false)} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 48, maxWidth: 1400 }}>

                {/* ─── Welcome ─── */}
                <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#0F172A' }}>{greeting()}, Luke!</h1>
                        <p style={{ fontSize: 15, color: '#64748B', marginTop: 8 }}>Here's what requires your attention today.</p>
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                        <button onClick={exportReport} className="btn btn-outline"><Download style={{ width: 16, height: 16 }} />Export Report</button>
                        <button className="btn btn-amber" onClick={() => setShowAdd(true)}>
                            <UserPlus style={{ width: 16, height: 16 }} />Quick Add Staff
                        </button>
                    </div>
                </div>

                {/* ─── Stat Cards ─── */}
                <div className="animate-in delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
                    <div className="card" style={{ padding: '32px 36px', cursor: 'pointer' }} onClick={() => nav('/contracts')}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ fontSize: 14, color: '#64748B', fontWeight: 500 }}>Pending Signatures</p>
                                <p style={{ fontSize: 48, fontWeight: 700, color: '#0F172A', marginTop: 16, fontVariantNumeric: 'tabular-nums' }}>{pendSig}</p>
                                <p style={{ fontSize: 14, color: '#D97706', fontWeight: 600, marginTop: 16 }}>Requires Admin Check</p>
                            </div>
                            <div style={{ width: 52, height: 52, borderRadius: 18, background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FileText style={{ width: 24, height: 24, color: '#F59E0B' }} />
                            </div>
                        </div>
                    </div>
                    <div className="card" style={{ padding: '32px 36px', cursor: 'pointer' }} onClick={() => nav('/employees')}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ fontSize: 14, color: '#64748B', fontWeight: 500 }}>Expiring Certs</p>
                                <p style={{ fontSize: 48, fontWeight: 700, color: '#0F172A', marginTop: 16, fontVariantNumeric: 'tabular-nums' }}>{expCert}</p>
                                <p style={{ fontSize: 14, color: '#EA580C', fontWeight: 600, marginTop: 16 }}>Due in 30 days</p>
                            </div>
                            <div style={{ width: 52, height: 52, borderRadius: 18, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Heart style={{ width: 24, height: 24, color: '#EF4444' }} />
                            </div>
                        </div>
                    </div>
                    <div className="card" style={{ padding: '32px 36px', cursor: 'pointer' }} onClick={() => nav('/onboarding')}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ fontSize: 14, color: '#64748B', fontWeight: 500 }}>Onboarding Active</p>
                                <p style={{ fontSize: 48, fontWeight: 700, color: '#0F172A', marginTop: 16, fontVariantNumeric: 'tabular-nums' }}>{obActive}</p>
                                <div style={{ width: 140, height: 8, background: '#D1FAE5', borderRadius: 4, marginTop: 20, overflow: 'hidden' }}>
                                    <div style={{ width: `${(obDone / onboardingTasks.length) * 100}%`, height: '100%', borderRadius: 4, background: '#10B981' }} />
                                </div>
                            </div>
                            <div style={{ width: 52, height: 52, borderRadius: 18, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <UserCheck style={{ width: 24, height: 24, color: '#10B981' }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── Activity + AI ─── */}
                <div className="animate-in delay-2" style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 32 }}>
                    <div className="card" style={{ padding: '36px 40px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A' }}>Recent Activity</h3>
                            <span onClick={() => nav('/employees')} style={{ fontSize: 14, color: '#D97706', fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }}>View All</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                            {[
                                { init: 'L', name: 'Liam Chen', desc: 'completed personal details', status: 'IN REVIEW', statusClr: '#64748B', time: '2h ago' },
                                { init: 'T', name: 'Tane Rewi', desc: 'updated First Aid certificate', status: 'VERIFIED', statusClr: '#059669', time: '5h ago' },
                                { init: 'E', name: 'Emma Wilson', desc: 'initiated magic link onboarding', status: 'SENT', statusClr: '#64748B', time: '1d ago' },
                            ].map((item, i) => (
                                <div key={i} onClick={() => nav('/employees')} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '24px 0', borderBottom: i < 2 ? '1px solid #F1F5F9' : 'none', cursor: 'pointer' }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 22, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#64748B', flexShrink: 0 }}>{item.init}</div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: 15, color: '#0F172A' }}><span style={{ fontWeight: 700 }}>{item.name}</span></p>
                                        <p style={{ fontSize: 14, color: '#64748B', marginTop: 4 }}>{item.desc}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' as any, flexShrink: 0 }}>
                                        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', color: item.statusClr }}>{item.status}</p>
                                        <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 6 }}>{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ padding: '36px 32px', borderRadius: 24, background: '#0F172A', color: 'white' }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
                            <Bot style={{ width: 20, height: 20, color: '#FBBF24' }} />AI Compliance Assistant
                        </h3>
                        <div style={{ padding: 24, borderRadius: 20, background: 'rgba(255,255,255,0.08)', marginBottom: 16 }}>
                            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as any, letterSpacing: '0.1em', color: '#FBBF24', marginBottom: 10 }}>Proactive Alert</p>
                            <p style={{ fontSize: 14, color: '#CBD5E1', lineHeight: 1.7 }}>New NZ Employment Relations amendment effective next month. 3 casual contracts may need updating.</p>
                            <span onClick={() => nav('/contracts')} style={{ fontSize: 14, color: '#FBBF24', fontWeight: 700, marginTop: 14, display: 'inline-block', textDecoration: 'none', cursor: 'pointer' }}>Generate Updates →</span>
                        </div>
                        <div style={{ padding: 24, borderRadius: 20, background: 'rgba(255,255,255,0.08)' }}>
                            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as any, letterSpacing: '0.1em', color: '#F97316', marginBottom: 10 }}>Payroll Gap</p>
                            <p style={{ fontSize: 14, color: '#CBD5E1', lineHeight: 1.7 }}>Liam Chen is missing a KiwiSaver deduction form. Auto-reminder sent.</p>
                        </div>
                    </div>
                </div>

                {/* ─── Certs + Incidents ─── */}
                <div className="animate-in delay-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                    <div className="card" style={{ padding: '36px 40px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A' }}>Expiring Certifications</h3>
                            <span onClick={() => nav('/employees')} style={{ fontSize: 14, color: '#D97706', fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }}>View all</span>
                        </div>
                        <div>
                            {certifications.filter(c => c.status !== 'valid').map((c, i, arr) => (
                                <div key={c.id} onClick={() => nav('/employees')} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '20px 0', borderBottom: i < arr.length - 1 ? '1px solid #F1F5F9' : 'none', cursor: 'pointer' }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: c.status === 'expired' ? '#FEF2F2' : '#FFF7ED', color: c.status === 'expired' ? '#EF4444' : '#F97316' }}>
                                        <ShieldCheck style={{ width: 20, height: 20 }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>{c.employeeName}</p>
                                        <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>{c.type}</p>
                                    </div>
                                    <p style={{ fontSize: 14, fontWeight: 700, color: c.status === 'expired' ? '#DC2626' : '#EA580C' }}>
                                        {c.status === 'expired' ? `${Math.abs(c.daysRemaining)}d overdue` : `${c.daysRemaining}d left`}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="card" style={{ padding: '36px 40px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A' }}>Recent Incidents</h3>
                            <span onClick={() => nav('/health-safety')} style={{ fontSize: 14, color: '#D97706', fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }}>View all</span>
                        </div>
                        <div>
                            {incidents.map((inc, i) => {
                                const svBg: Record<string, string> = { low: '#EFF6FF', medium: '#FFF7ED', high: '#FEF2F2', critical: '#FEE2E2' }
                                const svTx: Record<string, string> = { low: '#3B82F6', medium: '#F97316', high: '#EF4444', critical: '#B91C1C' }
                                const stBg: Record<string, string> = { open: '#FEF2F2', investigating: '#FFF7ED', resolved: '#ECFDF5' }
                                const stTx: Record<string, string> = { open: '#DC2626', investigating: '#EA580C', resolved: '#059669' }
                                return (
                                    <div key={inc.id} onClick={() => nav('/health-safety')} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '20px 0', borderBottom: i < incidents.length - 1 ? '1px solid #F1F5F9' : 'none', cursor: 'pointer' }}>
                                        <div style={{ width: 44, height: 44, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: svBg[inc.severity], color: svTx[inc.severity] }}>
                                            <AlertTriangle style={{ width: 20, height: 20 }} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontSize: 15, fontWeight: 600, color: '#1E293B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as any }}>{inc.title}</p>
                                            <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>{inc.site} · {inc.reportedDate}</p>
                                        </div>
                                        <span style={{ padding: '4px 14px', borderRadius: 14, fontSize: 11, fontWeight: 700, textTransform: 'capitalize' as any, background: stBg[inc.status], color: stTx[inc.status] }}>{inc.status}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* ─── Site Occupancy ─── */}
                <div className="card animate-in delay-4" style={{ padding: '36px 40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                        <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A' }}>Site Occupancy</h3>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#059669', fontWeight: 600 }}><span className="animate-pulse" style={{ width: 8, height: 8, borderRadius: 4, background: '#10B981' }} />Live</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${sites.length}, 1fr)`, gap: 32 }}>
                        {sites.map(s => {
                            const pct = Math.round((s.currentOccupancy / s.maxCapacity) * 100)
                            return (
                                <div key={s.id}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                        <p style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>{s.name}</p>
                                        <p style={{ fontSize: 14, color: '#94A3B8' }}><span style={{ fontWeight: 700, color: '#334155' }}>{s.currentOccupancy}</span> / {s.maxCapacity}</p>
                                    </div>
                                    <div style={{ width: '100%', height: 10, background: '#F1F5F9', borderRadius: 5, overflow: 'hidden' }}>
                                        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 5, background: pct > 80 ? '#EF4444' : pct > 50 ? '#F97316' : '#FBBF24', transition: 'width 0.7s' }} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}
