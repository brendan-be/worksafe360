import { useState, useRef, useEffect } from 'react'
import {
    Egg, CheckCircle2, Circle, Eye, FileSignature,
    Clock, ChevronDown, ChevronUp, Send, X,
} from 'lucide-react'
import { useStaff } from '../context/StaffContext'
import type { OnboardingDocument } from '../data/mockData'

/* ─── Document status config ─── */
const dsCfg: Record<OnboardingDocument['status'], { icon: any; bg: string; tx: string; label: string }> = {
    'not-sent': { icon: Clock, bg: '#F1F5F9', tx: '#64748B', label: 'Pending' },
    'sent': { icon: Send, bg: '#EFF6FF', tx: '#2563EB', label: 'Awaiting' },
    'viewed': { icon: Eye, bg: '#FFFBEB', tx: '#D97706', label: 'Viewed' },
    'acknowledged': { icon: CheckCircle2, bg: '#F0FDF4', tx: '#16A34A', label: 'Done' },
    'signed': { icon: FileSignature, bg: '#ECFDF5', tx: '#059669', label: 'Signed' },
}

/* ─── Signature Pad ─── */
function SignaturePad({ onSign, onCancel }: { onSign: () => void; onCancel: () => void }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [drawing, setDrawing] = useState(false)
    const [hasDrawn, setHasDrawn] = useState(false)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.fillStyle = '#FAFAFA'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.strokeStyle = '#1E293B'
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
    }, [])

    const getPos = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current!
        const rect = canvas.getBoundingClientRect()
        if ('touches' in e) {
            return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
        }
        return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top }
    }

    const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
        setDrawing(true)
        const ctx = canvasRef.current?.getContext('2d')
        if (!ctx) return
        const pos = getPos(e)
        ctx.beginPath()
        ctx.moveTo(pos.x, pos.y)
    }

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!drawing) return
        const ctx = canvasRef.current?.getContext('2d')
        if (!ctx) return
        const pos = getPos(e)
        ctx.lineTo(pos.x, pos.y)
        ctx.stroke()
        setHasDrawn(true)
    }

    const stopDraw = () => setDrawing(false)

    const clearPad = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.fillStyle = '#FAFAFA'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        setHasDrawn(false)
    }

    return (
        <div className="animate-in" style={{ padding: 24, background: 'white', borderRadius: 20, border: '2px solid #FDE68A', marginTop: 12 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#1E293B', marginBottom: 12 }}>Draw your signature below</p>
            <canvas
                ref={canvasRef} width={400} height={120}
                style={{ width: '100%', height: 120, borderRadius: 14, border: '1.5px solid #E2E8F0', cursor: 'crosshair', touchAction: 'none' }}
                onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
                onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw}
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                <button onClick={onSign} disabled={!hasDrawn} className="btn btn-amber" style={{ opacity: hasDrawn ? 1 : 0.5, fontSize: 13 }}>
                    <FileSignature style={{ width: 14, height: 14 }} />Confirm Signature
                </button>
                <button onClick={clearPad} className="btn btn-outline" style={{ fontSize: 13 }}>Clear</button>
                <button onClick={onCancel} className="btn btn-outline" style={{ fontSize: 13 }}><X style={{ width: 14, height: 14 }} />Cancel</button>
            </div>
        </div>
    )
}

export default function CandidatePortal() {
    const { candidates, updateDocument } = useStaff()
    const [signingDocId, setSigningDocId] = useState<string | null>(null)
    const [expandedDoc, setExpandedDoc] = useState<string | null>(null)

    // In production, `token` from URL params would resolve to a candidate.
    // For this prototype, we use the first candidate (Rawiri Manu).
    const candidate = candidates[0]
    if (!candidate) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
                <p style={{ fontSize: 16, color: '#94A3B8' }}>This link has expired or is invalid.</p>
            </div>
        )
    }

    const c = candidate
    const totalDocs = c.documents.length
    const completedDocs = c.documents.filter(d => d.status === 'signed' || d.status === 'acknowledged').length
    const pct = totalDocs > 0 ? Math.round((completedDocs / totalDocs) * 100) : 0

    /* Offer expiry */
    const expiryDate = new Date(c.offerExpiresAt)
    const now = new Date()
    const daysRemaining = Math.max(0, Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

    const handleSign = (docId: string) => {
        updateDocument(c.id, docId, { status: 'signed', signedAt: new Date().toISOString() })
        setSigningDocId(null)
    }

    const handleAcknowledge = (docId: string) => {
        updateDocument(c.id, docId, { status: 'acknowledged' })
    }

    const handleView = (docId: string, doc: OnboardingDocument) => {
        if (doc.status === 'sent' || doc.status === 'not-sent') {
            updateDocument(c.id, docId, { status: 'viewed', viewedAt: new Date().toISOString() })
        }
        setExpandedDoc(expandedDoc === docId ? null : docId)
    }

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
            {/* ─── Branded header ─── */}
            <header style={{
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #B45309 100%)',
                padding: '36px 0 64px', position: 'relative', overflow: 'hidden',
            }}>
                {/* Decorative circles */}
                <div style={{ position: 'absolute', top: -80, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                <div style={{ position: 'absolute', bottom: -60, left: -20, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

                <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 14, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
                            <Egg style={{ width: 20, height: 20, color: 'white' }} />
                        </div>
                        <span style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>Better Eggs</span>
                    </div>
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: 'white', marginBottom: 8 }}>
                        Kia ora, {c.name.split(' ')[0]}! 👋
                    </h1>
                    <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
                        Welcome to the team. Please review and complete the documents below to get started as <strong>{c.role}</strong> at <strong>{c.site}</strong>.
                    </p>
                </div>
            </header>

            {/* ─── Main content ─── */}
            <div style={{ maxWidth: 720, margin: '-40px auto 60px', padding: '0 24px', position: 'relative', zIndex: 2 }}>

                {/* Progress + Expiry card */}
                <div style={{
                    background: 'white', borderRadius: 24, padding: 28,
                    boxShadow: '0 20px 40px -8px rgba(15,23,42,0.08)',
                    border: '1px solid #F1F5F9', marginBottom: 28,
                    display: 'flex', alignItems: 'center', gap: 28,
                }}>
                    {/* Progress bar */}
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>Your progress</span>
                            <span style={{ fontSize: 14, fontWeight: 700, color: pct === 100 ? '#059669' : '#D97706', fontVariantNumeric: 'tabular-nums' }}>{pct}%</span>
                        </div>
                        <div style={{ width: '100%', height: 12, background: '#F1F5F9', borderRadius: 6, overflow: 'hidden' }}>
                            <div style={{
                                width: `${pct}%`, height: '100%', borderRadius: 6,
                                background: pct === 100 ? 'linear-gradient(90deg, #10B981, #059669)' : 'linear-gradient(90deg, #FCD34D, #F59E0B)',
                                transition: 'width 0.5s ease',
                            }} />
                        </div>
                        <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 8 }}>{completedDocs} of {totalDocs} documents completed</p>
                    </div>

                    {/* Expiry */}
                    <div style={{ padding: '14px 20px', borderRadius: 16, background: daysRemaining <= 3 ? '#FEF2F2' : '#FFFBEB', border: `1px solid ${daysRemaining <= 3 ? '#FECACA' : '#FDE68A'}`, textAlign: 'center', flexShrink: 0 }}>
                        <Clock style={{ width: 18, height: 18, color: daysRemaining <= 3 ? '#DC2626' : '#D97706', margin: '0 auto 6px' }} />
                        <p style={{ fontSize: 22, fontWeight: 700, color: daysRemaining <= 3 ? '#991B1B' : '#92400E', fontVariantNumeric: 'tabular-nums' }}>{daysRemaining}</p>
                        <p style={{ fontSize: 11, fontWeight: 500, color: daysRemaining <= 3 ? '#B91C1C' : '#B45309' }}>days left</p>
                    </div>
                </div>

                {/* ─── Document list ─── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {c.documents.map((doc, i) => {
                        const cfg = dsCfg[doc.status]
                        const Icon = cfg.icon
                        const isDone = doc.status === 'signed' || doc.status === 'acknowledged'
                        const isExpanded = expandedDoc === doc.id

                        return (
                            <div key={doc.id} className="animate-in" style={{ animationDelay: `${i * 60}ms` }}>
                                <div style={{
                                    background: 'white', borderRadius: 20, padding: '20px 24px',
                                    border: isDone ? '1px solid #D1FAE5' : '1px solid #F1F5F9',
                                    boxShadow: '0 1px 3px rgba(15,23,42,0.03)',
                                    transition: 'all 0.2s',
                                }}>
                                    {/* Row */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                        {isDone
                                            ? <CheckCircle2 style={{ width: 22, height: 22, color: '#10B981', flexShrink: 0 }} />
                                            : <Circle style={{ width: 22, height: 22, color: '#CBD5E1', flexShrink: 0 }} />
                                        }
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontSize: 15, fontWeight: isDone ? 500 : 600, color: isDone ? '#94A3B8' : '#1E293B', textDecoration: isDone ? 'line-through' : 'none' }}>
                                                {doc.name}
                                            </p>
                                            <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>
                                                {doc.category} · {doc.mandatory ? 'Required' : 'Optional'}
                                            </p>
                                        </div>

                                        {/* Status badge */}
                                        <span style={{ padding: '4px 12px', borderRadius: 10, fontSize: 11, fontWeight: 600, background: cfg.bg, color: cfg.tx }}>
                                            {cfg.label}
                                        </span>

                                        {/* Action button */}
                                        {!isDone && (
                                            <>
                                                {doc.interactionMode === 'view-only' && (
                                                    <button onClick={() => handleView(doc.id, doc)} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: 12 }}>
                                                        <Eye style={{ width: 14, height: 14 }} />{isExpanded ? 'Close' : 'View'}
                                                    </button>
                                                )}
                                                {doc.interactionMode === 'acknowledge' && (
                                                    <button onClick={() => handleAcknowledge(doc.id)} className="btn btn-amber" style={{ padding: '8px 16px', fontSize: 12 }}>
                                                        <CheckCircle2 style={{ width: 14, height: 14 }} />Acknowledge
                                                    </button>
                                                )}
                                                {doc.interactionMode === 'sign' && (
                                                    <button onClick={() => setSigningDocId(signingDocId === doc.id ? null : doc.id)} className="btn btn-amber" style={{ padding: '8px 16px', fontSize: 12 }}>
                                                        <FileSignature style={{ width: 14, height: 14 }} />{signingDocId === doc.id ? 'Cancel' : 'Sign'}
                                                    </button>
                                                )}
                                            </>
                                        )}

                                        {!isDone && (
                                            <button onClick={() => setExpandedDoc(isExpanded ? null : doc.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                                                {isExpanded ? <ChevronUp style={{ width: 16, height: 16, color: '#94A3B8' }} /> : <ChevronDown style={{ width: 16, height: 16, color: '#94A3B8' }} />}
                                            </button>
                                        )}
                                    </div>

                                    {/* Expanded preview */}
                                    {isExpanded && !isDone && (
                                        <div className="animate-in" style={{ marginTop: 16, padding: 20, background: '#FAFAFA', borderRadius: 14, border: '1px solid #F1F5F9' }}>
                                            <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7 }}>
                                                {doc.category === 'Contract' && `This is the ${doc.name} for your role as ${c.role} at ${c.site}. Please review all terms carefully before ${doc.interactionMode === 'sign' ? 'signing' : 'acknowledging'}.`}
                                                {doc.category === 'Policy' && `This policy outlines Better Eggs' requirements and your obligations. By acknowledging, you confirm you have read and understood the policy.`}
                                                {doc.category === 'Compliance' && `This is a required compliance document. Please complete all fields accurately and ${doc.interactionMode === 'sign' ? 'sign' : 'submit'}.`}
                                                {doc.category === 'Job Description' && `This document describes your role, responsibilities, and key performance indicators as ${c.role}.`}
                                            </p>
                                        </div>
                                    )}

                                    {/* Signature pad */}
                                    {signingDocId === doc.id && !isDone && (
                                        <SignaturePad
                                            onSign={() => handleSign(doc.id)}
                                            onCancel={() => setSigningDocId(null)}
                                        />
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Completion message */}
                {pct === 100 && (
                    <div className="animate-in" style={{
                        marginTop: 32, padding: 36, background: 'white', borderRadius: 24,
                        border: '2px solid #D1FAE5', textAlign: 'center',
                        boxShadow: '0 20px 40px -8px rgba(16, 185, 129, 0.1)',
                    }}>
                        <CheckCircle2 style={{ width: 40, height: 40, color: '#10B981', margin: '0 auto 16px' }} />
                        <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>All done! 🎉</h3>
                        <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6 }}>
                            You've completed all your documents. Your manager <strong>{c.managerName}</strong> will be in touch about your start date.
                        </p>
                    </div>
                )}

                {/* Footer */}
                <div style={{ textAlign: 'center', marginTop: 48, paddingBottom: 32 }}>
                    <p style={{ fontSize: 12, color: '#CBD5E1' }}>
                        Better Eggs People Platform · Secure document portal
                    </p>
                </div>
            </div>
        </div>
    )
}
