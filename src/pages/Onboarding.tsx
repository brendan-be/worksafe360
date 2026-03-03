import { CheckCircle2, Circle, ClipboardList, Shield, Package, Users } from 'lucide-react'
import { onboardingTasks } from '../data/mockData'

export default function Onboarding() {
    const cats = [...new Set(onboardingTasks.map(t => t.category))]
    const done = onboardingTasks.filter(t => t.completed).length
    const total = onboardingTasks.length
    const pct = Math.round((done / total) * 100)
    const icons: Record<string, any> = { Documents: ClipboardList, Equipment: Package, Safety: Shield, People: Users }
    const r = 54, c = 2 * Math.PI * r, offset = c - (pct / 100) * c

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48, maxWidth: 1000 }}>
            {/* Header */}
            <div className="card animate-in" style={{ padding: 44, boxShadow: '0 20px 40px -8px rgb(226 232 240 / 0.5)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 44 }}>
                    <div style={{ position: 'relative', width: 148, height: 148, flexShrink: 0 }}>
                        <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 128 128">
                            <circle cx="64" cy="64" r={r} fill="none" stroke="#F1F5F9" strokeWidth="10" />
                            <circle cx="64" cy="64" r={r} fill="none" stroke="#F59E0B" strokeWidth="10" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} style={{ transition: 'all 0.7s' }} />
                        </svg>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: 32, fontWeight: 700, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>{pct}%</span>
                            <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500, marginTop: 2 }}>{done}/{total} tasks</span>
                        </div>
                    </div>

                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                            <div style={{ width: 56, height: 56, borderRadius: 18, background: 'linear-gradient(135deg, #FCD34D, #F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 18 }}>RM</div>
                            <div>
                                <h3 style={{ fontSize: 26, fontWeight: 700, color: '#0F172A' }}>Rawiri Manu</h3>
                                <p style={{ fontSize: 15, color: '#64748B', marginTop: 4 }}>Farm Hand · Masterton Farm</p>
                            </div>
                        </div>
                        <p style={{ fontSize: 15, color: '#64748B', marginTop: 16 }}>Start date: <span style={{ fontWeight: 700, color: '#334155' }}>24 Feb 2026</span></p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 20 }}>
                            {cats.map(cat => {
                                const d = onboardingTasks.filter(t => t.category === cat && t.completed).length
                                const tot = onboardingTasks.filter(t => t.category === cat).length
                                return (
                                    <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <span style={{ width: 12, height: 12, borderRadius: 6, background: d === tot ? '#10B981' : '#FBBF24' }} />
                                        <span style={{ fontSize: 14, color: '#64748B', fontWeight: 500 }}>{cat} ({d}/{tot})</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories */}
            {cats.map(cat => {
                const Icon = icons[cat] || ClipboardList
                const tasks = onboardingTasks.filter(t => t.category === cat)
                const catDone = tasks.filter(t => t.completed).length
                const catPct = Math.round((catDone / tasks.length) * 100)

                return (
                    <div key={cat} className="card animate-in" style={{ padding: 36 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 12 }}>
                                <Icon style={{ width: 20, height: 20, color: '#F59E0B' }} />{cat}
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{ width: 120, height: 10, background: '#F1F5F9', borderRadius: 5, overflow: 'hidden' }}>
                                    <div style={{ width: `${catPct}%`, height: '100%', borderRadius: 5, background: '#FBBF24', transition: 'all 0.5s' }} />
                                </div>
                                <span style={{ fontSize: 14, fontWeight: 700, color: '#64748B', fontVariantNumeric: 'tabular-nums' }}>{catDone}/{tasks.length}</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {tasks.map(task => (
                                <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: 20, borderRadius: 20, background: task.completed ? 'rgba(236,253,245,0.4)' : 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
                                    {task.completed
                                        ? <CheckCircle2 style={{ width: 22, height: 22, color: '#10B981', flexShrink: 0 }} />
                                        : <Circle style={{ width: 22, height: 22, color: '#CBD5E1', flexShrink: 0 }} />
                                    }
                                    <p style={{ fontSize: 15, flex: 1, color: task.completed ? '#94A3B8' : '#1E293B', fontWeight: task.completed ? 400 : 500, textDecoration: task.completed ? 'line-through' : 'none' }}>{task.task}</p>
                                    <span style={{ fontSize: 14, color: '#94A3B8' }}>Due {task.dueDate}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
