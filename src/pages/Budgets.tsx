import { useState } from 'react'
import {
    DollarSign, TrendingUp, TrendingDown, Users, Clock,
    BarChart3, AlertTriangle, CheckCircle2, Search,
} from 'lucide-react'
import { budgetEntries, type BudgetEntry } from '../data/mockData'

export default function Budgets() {
    const [search, setSearch] = useState('')

    const totalBudgeted = budgetEntries.reduce((s, b) => s + b.budgetedCost, 0)
    const totalActual = budgetEntries.reduce((s, b) => s + b.actualCost, 0)
    const totalVariance = totalActual - totalBudgeted
    const totalHead = budgetEntries.reduce((s, b) => s + b.headcount, 0)
    const totalExpected = budgetEntries.reduce((s, b) => s + b.expectedHeadcount, 0)

    const filtered = budgetEntries.filter(b => {
        if (!search) return true
        return b.department.toLowerCase().includes(search.toLowerCase())
    })

    const fmt = (n: number) => '$' + n.toLocaleString()

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 1400 }}>
            <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: 15, color: '#64748B' }}>{budgetEntries.length} departments · Q1 2026</p>
            </div>

            {/* Summary cards */}
            <div className="animate-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                {[
                    { label: 'Total Budget', value: fmt(totalBudgeted), icon: DollarSign, bg: '#EFF6FF', tx: '#2563EB' },
                    { label: 'Actual Spend', value: fmt(totalActual), icon: BarChart3, bg: '#FFFBEB', tx: '#D97706' },
                    { label: 'Variance', value: (totalVariance >= 0 ? '+' : '') + fmt(totalVariance), icon: totalVariance > 0 ? TrendingUp : TrendingDown, bg: totalVariance > 0 ? '#FEF2F2' : '#F0FDF4', tx: totalVariance > 0 ? '#DC2626' : '#059669' },
                    { label: 'Headcount', value: `${totalHead} / ${totalExpected}`, icon: Users, bg: '#F1F5F9', tx: '#475569' },
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

            {/* Search */}
            <div className="animate-in" style={{ position: 'relative' }}>
                <Search style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#94A3B8' }} />
                <input type="text" placeholder="Search departments..." className="input" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 44 }} />
            </div>

            {/* Department cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: 20 }}>
                {filtered.map((b, i) => {
                    const costVar = b.actualCost - b.budgetedCost
                    const hrsVar = b.actualHours - b.budgetedHours
                    const costPct = Math.round((b.actualCost / b.budgetedCost) * 100)
                    const isOver = costVar > 0

                    return (
                        <div key={b.id} className={`card animate-in delay-${Math.min(i + 1, 4)}`} style={{ padding: '28px 32px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                                <div>
                                    <p style={{ fontSize: 17, fontWeight: 700, color: '#0F172A' }}>{b.department}</p>
                                    <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>{b.quarter}</p>
                                </div>
                                <span style={{ padding: '4px 14px', borderRadius: 10, fontSize: 11, fontWeight: 700, background: isOver ? '#FEF2F2' : '#F0FDF4', color: isOver ? '#DC2626' : '#059669' }}>
                                    {isOver ? 'Over Budget' : 'Under Budget'}
                                </span>
                            </div>

                            {/* Cost bar */}
                            <div style={{ marginBottom: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>Cost: {fmt(b.actualCost)} / {fmt(b.budgetedCost)}</span>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: isOver ? '#DC2626' : '#059669' }}>{costPct}%</span>
                                </div>
                                <div style={{ width: '100%', height: 10, background: '#F1F5F9', borderRadius: 5, overflow: 'hidden' }}>
                                    <div style={{ width: `${Math.min(costPct, 100)}%`, height: '100%', borderRadius: 5, background: isOver ? '#EF4444' : '#10B981', transition: 'width 0.5s' }} />
                                </div>
                            </div>

                            {/* Stats grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                                <div style={{ padding: 14, borderRadius: 14, background: '#F8FAFC' }}>
                                    <p style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', marginBottom: 4 }}>HOURS</p>
                                    <p style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>{b.actualHours}</p>
                                    <p style={{ fontSize: 11, color: hrsVar > 0 ? '#DC2626' : '#059669' }}>{hrsVar > 0 ? '+' : ''}{hrsVar} vs budget</p>
                                </div>
                                <div style={{ padding: 14, borderRadius: 14, background: '#F8FAFC' }}>
                                    <p style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', marginBottom: 4 }}>HEADCOUNT</p>
                                    <p style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>{b.headcount} / {b.expectedHeadcount}</p>
                                    <p style={{ fontSize: 11, color: b.headcount < b.expectedHeadcount ? '#D97706' : '#059669' }}>{b.headcount < b.expectedHeadcount ? 'Under-staffed' : 'On target'}</p>
                                </div>
                                <div style={{ padding: 14, borderRadius: 14, background: '#F8FAFC' }}>
                                    <p style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', marginBottom: 4 }}>VARIANCE</p>
                                    <p style={{ fontSize: 15, fontWeight: 700, color: isOver ? '#DC2626' : '#059669' }}>{isOver ? '+' : ''}{fmt(costVar)}</p>
                                    <p style={{ fontSize: 11, color: '#94A3B8' }}>{isOver ? 'over' : 'under'}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
