import { useState } from 'react'
import { MapPin, QrCode, Monitor, Smartphone, CreditCard, Siren, CheckCircle2, X, LogIn, LogOut } from 'lucide-react'
import { sites, signInLog } from '../data/mockData'

export default function SiteSignIn() {
    const [selSite, setSelSite] = useState<string | null>(null)
    const [muster, setMuster] = useState(false)
    const [checked, setChecked] = useState<string[]>([])
    const onSite = signInLog.filter(s => !s.signOutTime)
    const out = signInLog.filter(s => s.signOutTime)
    const toggle = (id: string) => setChecked(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

    const methods = [
        { icon: QrCode, name: 'QR Code', desc: 'Scan with phone camera' },
        { icon: Monitor, name: 'Kiosk', desc: 'Tablet at site entrance' },
        { icon: CreditCard, name: 'RFID Card', desc: 'Tap card at reader' },
        { icon: Smartphone, name: 'Mobile', desc: 'Geofenced auto check-in' },
    ]
    const mIcn: Record<string, any> = { QR: QrCode, Kiosk: Monitor, RFID: CreditCard, Mobile: Smartphone }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48, maxWidth: 1400 }}>
            <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: 15, color: '#64748B' }}>Real-time site occupancy across all locations</p>
                <button onClick={() => setMuster(!muster)} className={muster ? 'btn btn-danger' : 'btn btn-outline'} style={!muster ? { borderColor: '#FCA5A5', color: '#DC2626' } : {}}>
                    <Siren style={{ width: 16, height: 16 }} />{muster ? 'End Muster' : 'Emergency Muster'}
                </button>
            </div>

            <div className="animate-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                {sites.map(site => {
                    const pct = Math.round((site.currentOccupancy / site.maxCapacity) * 100)
                    const sel = selSite === site.id
                    return (
                        <button key={site.id} onClick={() => setSelSite(sel ? null : site.id)}
                            style={{ textAlign: 'left' as any, padding: 32, borderRadius: 28, border: sel ? '2px solid #FCD34D' : '2px solid #F1F5F9', background: sel ? '#FFFBEB' : 'white', cursor: 'pointer', transition: 'all 0.2s' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
                                <div style={{ width: 48, height: 48, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: sel ? '#FEF3C7' : '#F1F5F9', color: sel ? '#D97706' : '#94A3B8' }}><MapPin style={{ width: 20, height: 20 }} /></div>
                                <div>
                                    <p style={{ fontSize: 16, fontWeight: 700, color: sel ? '#B45309' : '#1E293B' }}>{site.name}</p>
                                    <p style={{ fontSize: 14, color: '#64748B', marginTop: 4 }}>{site.address}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#64748B' }}><span className="animate-pulse" style={{ width: 8, height: 8, borderRadius: 4, background: '#10B981' }} /><span style={{ fontWeight: 700, color: '#1E293B' }}>{site.currentOccupancy}</span> on site</span>
                                <span style={{ fontSize: 13, color: '#94A3B8' }}>of {site.maxCapacity}</span>
                            </div>
                            <div style={{ width: '100%', height: 10, background: '#F1F5F9', borderRadius: 5, overflow: 'hidden' }}>
                                <div style={{ width: `${pct}%`, height: '100%', borderRadius: 5, background: pct > 80 ? '#EF4444' : pct > 50 ? '#F97316' : '#FBBF24', transition: 'width 0.7s' }} />
                            </div>
                        </button>
                    )
                })}
            </div>

            {muster && (
                <div className="card animate-in" style={{ padding: 36, border: '2px solid #FCA5A5' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#B91C1C', display: 'flex', alignItems: 'center', gap: 10 }}><Siren style={{ width: 20, height: 20 }} />🚨 Emergency Muster — Roll Call</h3>
                        <span style={{ fontSize: 16, color: '#64748B' }}><span style={{ color: '#059669', fontWeight: 700 }}>{checked.length}</span> / {onSite.length} accounted</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                        {onSite.map(p => {
                            const chk = checked.includes(p.id); return (
                                <button key={p.id} onClick={() => toggle(p.id)} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 20, borderRadius: 20, border: chk ? '2px solid #6EE7B7' : '2px solid #FECACA', background: chk ? '#ECFDF5' : '#FEF2F2', cursor: 'pointer', transition: 'all 0.2s' }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', background: chk ? '#10B981' : '#FCA5A5', color: chk ? 'white' : '#DC2626' }}>{chk ? <CheckCircle2 style={{ width: 20, height: 20 }} /> : <X style={{ width: 20, height: 20 }} />}</div>
                                    <div style={{ textAlign: 'left' as any }}><p style={{ fontSize: 14, fontWeight: 600, color: chk ? '#047857' : '#B91C1C' }}>{p.name}</p><p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>{p.site}</p></div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 32 }}>
                <div className="card animate-in" style={{ padding: 36 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', marginBottom: 28 }}>Sign-In Methods</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {methods.map(m => {
                            const I = m.icon; return (
                                <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 20, borderRadius: 20, background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 14, background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}><I style={{ width: 20, height: 20 }} /></div>
                                    <div><p style={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>{m.name}</p><p style={{ fontSize: 14, color: '#64748B', marginTop: 4 }}>{m.desc}</p></div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="card animate-in" style={{ padding: 36 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                        <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A' }}>Today's Log</h3>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#059669', fontWeight: 600 }}><span className="animate-pulse" style={{ width: 8, height: 8, borderRadius: 4, background: '#10B981' }} />Live</span>
                    </div>
                    <p style={{ fontSize: 11, color: '#94A3B8', textTransform: 'uppercase' as any, letterSpacing: '0.1em', fontWeight: 700, marginBottom: 16 }}>On Site</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 40 }}>
                        {onSite.map((e, i) => {
                            const MI = mIcn[e.method]; return (
                                <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 0', borderBottom: i < onSite.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                                    <LogIn style={{ width: 16, height: 16, color: '#10B981' }} />
                                    <p style={{ flex: 1, fontSize: 15, fontWeight: 600, color: '#1E293B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as any }}>{e.name}</p>
                                    <span style={{ padding: '4px 14px', borderRadius: 14, fontSize: 11, fontWeight: 700, textTransform: 'capitalize' as any, background: '#FFFBEB', color: '#D97706' }}>{e.type}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#94A3B8' }}><MI style={{ width: 14, height: 14 }} />{e.method}</span>
                                    <span style={{ fontSize: 14, color: '#64748B', fontFamily: 'monospace', fontVariantNumeric: 'tabular-nums' }}>{e.signInTime}</span>
                                </div>
                            )
                        })}
                    </div>
                    <p style={{ fontSize: 11, color: '#94A3B8', textTransform: 'uppercase' as any, letterSpacing: '0.1em', fontWeight: 700, marginBottom: 16 }}>Signed Out</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, opacity: 0.4 }}>
                        {out.map((e, i) => (
                            <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 0', borderBottom: i < out.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                                <LogOut style={{ width: 16, height: 16, color: '#94A3B8' }} />
                                <p style={{ flex: 1, fontSize: 15, color: '#64748B' }}>{e.name}</p>
                                <span style={{ fontSize: 14, color: '#94A3B8', fontFamily: 'monospace', fontVariantNumeric: 'tabular-nums' }}>{e.signInTime}–{e.signOutTime}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
