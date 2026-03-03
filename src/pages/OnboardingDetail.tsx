import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
    ArrowLeft, Send, CheckCircle2, Circle, Eye, FileSignature,
    ShieldCheck, ShieldAlert, AlertTriangle, Clock, Upload,
    RefreshCw, UserCheck, Ban, ChevronDown, ChevronUp,
} from 'lucide-react'
import { useStaff } from '../context/StaffContext'
import type { OnboardingDocument, HardGates } from '../data/mockData'

/* ─── Document status config ─── */
const docStatusCfg: Record<OnboardingDocument['status'], { icon: any; bg: string; tx: string; label: string }> = {
    'not-sent': { icon: Clock, bg: '#F1F5F9', tx: '#64748B', label: 'Not Sent' },
    'sent': { icon: Send, bg: '#EFF6FF', tx: '#2563EB', label: 'Sent' },
    'viewed': { icon: Eye, bg: '#FFFBEB', tx: '#D97706', label: 'Viewed' },
    'acknowledged': { icon: CheckCircle2, bg: '#F0FDF4', tx: '#16A34A', label: 'Acknowledged' },
    'signed': { icon: FileSignature, bg: '#ECFDF5', tx: '#059669', label: 'Signed' },
}

/* ─── Hard gate labels ─── */
const gateLabels: { key: keyof HardGates; label: string; icon: any }[] = [
    { key: 'regulatoryDocsSigned', label: 'Regulatory documents signed', icon: FileSignature },
    { key: 'mandatoryPoliciesSigned', label: 'Mandatory policies acknowledged', icon: ShieldCheck },
    { key: 'rightToWorkUploaded', label: 'Right to work verified', icon: UserCheck },
    { key: 'firstDayInduction', label: 'Day 1 induction completed', icon: CheckCircle2 },
    { key: 'firstWeekInduction', label: 'Week 1 induction completed', icon: CheckCircle2 },
]

export default function OnboardingDetail() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { candidates, updateDocument, toggleHardGate, applyOverride, sendReminder, updateCandidateStatus } = useStaff()
    const [showOverrideConfirm, setShowOverrideConfirm] = useState(false)
    const [rtwExpanded, setRtwExpanded] = useState(false)
    const [reminderSent, setReminderSent] = useState(false)

    const candidate = candidates.find(c => c.id === id)
    if (!candidate) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 80 }}>
                <AlertTriangle style={{ width: 40, height: 40, color: '#CBD5E1' }} />
                <p style={{ fontSize: 16, color: '#94A3B8' }}>Candidate not found</p>
                <button onClick={() => navigate('/onboarding')} className="btn btn-outline"><ArrowLeft style={{ width: 16, height: 16 }} />Back to pipeline</button>
            </div>
        )
    }

    const c = candidate
    const initials = c.name.split(' ').map(n => n[0]).join('').slice(0, 2)
    const totalDocs = c.documents.length
    const completedDocs = c.documents.filter(d => d.status === 'signed' || d.status === 'acknowledged').length
    const docPct = totalDocs > 0 ? Math.round((completedDocs / totalDocs) * 100) : 0
    const r = 54, circ = 2 * Math.PI * r, offset = circ - (docPct / 100) * circ

    /* Hard gate progress */
    const boolGates = gateLabels.map(g => ({ ...g, done: !!c.hardGates[g.key] }))
    const gatesDone = boolGates.filter(g => g.done).length
    const allGatesPassed = gatesDone === gateLabels.length

    /* Group documents by category */
    const docCategories = [...new Set(c.documents.map(d => d.category))]

    const handleSendReminder = () => {
        sendReminder(c.id)
        setReminderSent(true)
        setTimeout(() => setReminderSent(false), 3000)
    }

    const handleOverride = () => {
        applyOverride(c.id, 'Luke Benefield')
        setShowOverrideConfirm(false)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36, maxWidth: 1100 }}>
            {/* Back + actions */}
            <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={() => navigate('/onboarding')} className="btn btn-outline" style={{ gap: 8 }}>
                    <ArrowLeft style={{ width: 16, height: 16 }} />Back to pipeline
                </button>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={handleSendReminder} className="btn btn-outline" disabled={reminderSent} style={{ opacity: reminderSent ? 0.6 : 1 }}>
                        <RefreshCw style={{ width: 14, height: 14 }} />{reminderSent ? 'Reminder sent!' : 'Send Reminder'}
                    </button>
                    <button onClick={() => updateCandidateStatus(c.id, 'sent')} className="btn btn-amber">
                        <Send style={{ width: 14, height: 14 }} />Resend Offer
                    </button>
                </div>
            </div>

            {/* ═══ Header card ═══ */}
            <div className="card animate-in" style={{ padding: 40, boxShadow: '0 20px 40px -8px rgb(226 232 240 / 0.5)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
                    {/* Progress ring */}
                    <div style={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
                        <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 128 128">
                            <circle cx="64" cy="64" r={r} fill="none" stroke="#F1F5F9" strokeWidth="10" />
                            <circle cx="64" cy="64" r={r} fill="none" stroke={docPct === 100 ? '#10B981' : '#F59E0B'} strokeWidth="10" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} style={{ transition: 'all 0.7s' }} />
                        </svg>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: 28, fontWeight: 700, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>{docPct}%</span>
                            <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500, marginTop: 2 }}>{completedDocs}/{totalDocs} docs</span>
                        </div>
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10 }}>
                            <div style={{ width: 52, height: 52, borderRadius: 18, background: 'linear-gradient(135deg, #FCD34D, #F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 17 }}>{initials}</div>
                            <div>
                                <h3 style={{ fontSize: 24, fontWeight: 700, color: '#0F172A' }}>{c.name}</h3>
                                <p style={{ fontSize: 14, color: '#64748B', marginTop: 3 }}>{c.role} · {c.site}</p>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginTop: 20 }}>
                            {[
                                ['Contract', c.contractType],
                                ['Start Date', c.startDate],
                                ['Salary', c.salary],
                                ['Manager', c.managerName],
                            ].map(([label, val]) => (
                                <div key={label}>
                                    <p style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' as any, letterSpacing: '0.05em' }}>{label}</p>
                                    <p style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', marginTop: 4 }}>{val}</p>
                                </div>
                            ))}
                        </div>
                        {c.trialPeriod && (
                            <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 14px', borderRadius: 12, background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                                <Clock style={{ width: 12, height: 12, color: '#D97706' }} />
                                <span style={{ fontSize: 12, fontWeight: 600, color: '#92400E' }}>90-day trial period</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ═══ Two column: Documents + Hard Gates ═══ */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 28 }}>

                {/* ─── Documents ─── */}
                <div className="card animate-in" style={{ padding: 36 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                        <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A' }}>Documents</h3>
                        <span style={{ fontSize: 13, color: '#64748B', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{completedDocs}/{totalDocs} complete</span>
                    </div>

                    {docCategories.map(cat => {
                        const docs = c.documents.filter(d => d.category === cat)
                        return (
                            <div key={cat} style={{ marginBottom: 28 }}>
                                <p style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' as any, letterSpacing: '0.06em', marginBottom: 12 }}>{cat}</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    {docs.map(doc => {
                                        const cfg = docStatusCfg[doc.status]
                                        const Icon = cfg.icon
                                        return (
                                            <div key={doc.id} style={{
                                                display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
                                                borderRadius: 16, background: doc.status === 'signed' || doc.status === 'acknowledged' ? 'rgba(236,253,245,0.3)' : '#FAFAFA',
                                                transition: 'all 0.2s',
                                            }}>
                                                <Icon style={{ width: 16, height: 16, color: cfg.tx, flexShrink: 0 }} />
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{ fontSize: 14, fontWeight: 500, color: '#1E293B' }}>{doc.name}</p>
                                                    {doc.signedAt && <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>Signed {new Date(doc.signedAt).toLocaleDateString()}</p>}
                                                </div>
                                                {doc.mandatory && (
                                                    <span style={{ padding: '2px 10px', borderRadius: 8, fontSize: 10, fontWeight: 700, background: '#FEF2F2', color: '#DC2626' }}>Required</span>
                                                )}
                                                <span style={{
                                                    padding: '4px 12px', borderRadius: 10, fontSize: 11, fontWeight: 600,
                                                    background: cfg.bg, color: cfg.tx,
                                                }}>
                                                    {cfg.label}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* ─── Right column: Hard Gates + Right to Work ─── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {/* Hard Gates */}
                    <div className="card animate-in" style={{ padding: 32 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                            <ShieldCheck style={{ width: 20, height: 20, color: allGatesPassed ? '#10B981' : '#F59E0B' }} />
                            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A' }}>Hard Gates</h3>
                            <span style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 700, color: allGatesPassed ? '#059669' : '#D97706', fontVariantNumeric: 'tabular-nums' }}>
                                {gatesDone}/{gateLabels.length}
                            </span>
                        </div>

                        {!allGatesPassed && (
                            <div style={{ padding: '12px 16px', borderRadius: 14, background: '#FFFBEB', border: '1px solid #FDE68A', marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                <AlertTriangle style={{ width: 14, height: 14, color: '#D97706', marginTop: 2, flexShrink: 0 }} />
                                <p style={{ fontSize: 12, color: '#92400E', lineHeight: 1.5 }}>
                                    Employee <strong>cannot start work</strong> until all hard gates are passed.
                                </p>
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {boolGates.map(g => {
                                const GIcon = g.icon
                                return (
                                    <button key={g.key} onClick={() => toggleHardGate(c.id, g.key)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                                            borderRadius: 14, border: 'none', cursor: 'pointer', width: '100%',
                                            background: g.done ? 'rgba(236,253,245,0.4)' : '#F8FAFC',
                                            transition: 'all 0.2s', textAlign: 'left' as any,
                                        }}>
                                        {g.done
                                            ? <CheckCircle2 style={{ width: 18, height: 18, color: '#10B981', flexShrink: 0 }} />
                                            : <Circle style={{ width: 18, height: 18, color: '#CBD5E1', flexShrink: 0 }} />
                                        }
                                        <span style={{ fontSize: 13, fontWeight: g.done ? 500 : 500, color: g.done ? '#94A3B8' : '#1E293B', textDecoration: g.done ? 'line-through' : 'none' }}>
                                            {g.label}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>

                        {/* Override */}
                        {!allGatesPassed && !c.hardGates.overrideApplied && (
                            <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #F1F5F9' }}>
                                {!showOverrideConfirm ? (
                                    <button onClick={() => setShowOverrideConfirm(true)} style={{
                                        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px',
                                        borderRadius: 14, border: '1.5px solid #FECACA', background: 'white',
                                        color: '#DC2626', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                                    }}>
                                        <Ban style={{ width: 14, height: 14 }} />Admin Override
                                    </button>
                                ) : (
                                    <div className="animate-in" style={{ padding: 16, borderRadius: 14, background: '#FEF2F2', border: '1px solid #FECACA' }}>
                                        <p style={{ fontSize: 12, fontWeight: 600, color: '#991B1B', marginBottom: 12 }}>
                                            ⚠️ This will bypass all remaining hard gates. This action is logged in the audit trail.
                                        </p>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button onClick={handleOverride} className="btn btn-danger" style={{ fontSize: 12, padding: '8px 16px' }}>
                                                Confirm Override
                                            </button>
                                            <button onClick={() => setShowOverrideConfirm(false)} className="btn btn-outline" style={{ fontSize: 12, padding: '8px 16px' }}>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {c.hardGates.overrideApplied && (
                            <div style={{ marginTop: 20, padding: '12px 16px', borderRadius: 14, background: '#FEF2F2', border: '1px solid #FECACA', display: 'flex', alignItems: 'center', gap: 10 }}>
                                <AlertTriangle style={{ width: 14, height: 14, color: '#DC2626', flexShrink: 0 }} />
                                <span style={{ fontSize: 12, color: '#991B1B', fontWeight: 600 }}>
                                    Override applied by {c.hardGates.overrideBy}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Right to Work */}
                    <div className="card animate-in" style={{ padding: 32 }}>
                        <button onClick={() => setRtwExpanded(!rtwExpanded)} style={{
                            display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                        }}>
                            <UserCheck style={{ width: 20, height: 20, color: c.rightToWork?.isNZAU ? '#10B981' : '#D97706' }} />
                            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', flex: 1, textAlign: 'left' as any }}>Right to Work</h3>
                            {rtwExpanded ? <ChevronUp style={{ width: 16, height: 16, color: '#94A3B8' }} /> : <ChevronDown style={{ width: 16, height: 16, color: '#94A3B8' }} />}
                        </button>

                        {rtwExpanded && c.rightToWork && (
                            <div className="animate-in" style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <div style={{ padding: '12px 16px', borderRadius: 14, background: '#F8FAFC', display: 'flex', alignItems: 'center', gap: 10 }}>
                                    {c.rightToWork.isNZAU === true && <CheckCircle2 style={{ width: 16, height: 16, color: '#10B981' }} />}
                                    {c.rightToWork.isNZAU === false && <AlertTriangle style={{ width: 16, height: 16, color: '#D97706' }} />}
                                    {c.rightToWork.isNZAU === null && <Circle style={{ width: 16, height: 16, color: '#CBD5E1' }} />}
                                    <span style={{ fontSize: 13, color: '#1E293B' }}>
                                        {c.rightToWork.isNZAU === true ? 'NZ/AU citizen or resident' : c.rightToWork.isNZAU === false ? 'Requires visa — see below' : 'Not yet confirmed'}
                                    </span>
                                </div>

                                {[
                                    ['Passport uploaded', c.rightToWork.passportUploaded],
                                    ['Birth certificate uploaded', c.rightToWork.birthCertUploaded],
                                ].map(([label, val]) => (
                                    <div key={label as string} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 14, background: '#FAFAFA' }}>
                                        {val ? <CheckCircle2 style={{ width: 14, height: 14, color: '#10B981' }} /> : <Circle style={{ width: 14, height: 14, color: '#CBD5E1' }} />}
                                        <span style={{ fontSize: 13, color: val ? '#94A3B8' : '#1E293B', textDecoration: val ? 'line-through' : 'none' }}>{label as string}</span>
                                    </div>
                                ))}

                                {c.rightToWork.isNZAU === false && (
                                    <div style={{ marginTop: 8, padding: 16, borderRadius: 14, background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                                        <p style={{ fontSize: 12, fontWeight: 600, color: '#92400E', marginBottom: 8 }}>Visa Details Required</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            {c.rightToWork.visaUploaded
                                                ? <CheckCircle2 style={{ width: 14, height: 14, color: '#10B981' }} />
                                                : <Upload style={{ width: 14, height: 14, color: '#D97706' }} />
                                            }
                                            <span style={{ fontSize: 13, color: '#451A03' }}>{c.rightToWork.visaUploaded ? 'Visa uploaded' : 'Visa not yet uploaded'}</span>
                                        </div>
                                        {c.rightToWork.visaType && <p style={{ fontSize: 12, color: '#64748B', marginTop: 8 }}>Type: {c.rightToWork.visaType} · Expires: {c.rightToWork.visaExpiry}</p>}
                                    </div>
                                )}
                            </div>
                        )}

                        {rtwExpanded && !c.rightToWork && (
                            <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 16 }}>No right-to-work information recorded yet.</p>
                        )}
                    </div>

                    {/* Working Hours card */}
                    <div className="card animate-in" style={{ padding: 32 }}>
                        <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', marginBottom: 16 }}>Working Hours</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {[
                                ['Days', c.workingHours.days],
                                ['Start', c.workingHours.start],
                                ['Finish', c.workingHours.finish],
                                ...(c.workingHours.minHours ? [['Min Hours', `${c.workingHours.minHours}h/week`]] : []),
                            ].map(([label, val]) => (
                                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F8FAFC' }}>
                                    <span style={{ fontSize: 13, color: '#64748B' }}>{label}</span>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: '#1E293B' }}>{val}</span>
                                </div>
                            ))}
                        </div>
                        {c.additionalObligations.length > 0 && (
                            <div style={{ marginTop: 16 }}>
                                <p style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' as any, letterSpacing: '0.05em', marginBottom: 8 }}>Additional</p>
                                {c.additionalObligations.map(o => (
                                    <span key={o} style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 10, background: '#FFFBEB', border: '1px solid #FDE68A', fontSize: 12, fontWeight: 600, color: '#92400E', marginRight: 8 }}>{o}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
