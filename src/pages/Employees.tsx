import { useState } from 'react'
import { Search, Filter, UserPlus, Mail, Phone, MapPin, ChevronRight, MoreVertical } from 'lucide-react'
import { employees } from '../data/mockData'

const statusBg: Record<string, string> = { active: '#ECFDF5', onboarding: '#EFF6FF', offboarding: '#FFF7ED' }
const statusTx: Record<string, string> = { active: '#059669', onboarding: '#2563EB', offboarding: '#EA580C' }

export default function Employees() {
    const [search, setSearch] = useState('')
    const [site, setSite] = useState('all')
    const allSites = [...new Set(employees.map(e => e.site))]
    const filtered = employees.filter(e => {
        const m = e.name.toLowerCase().includes(search.toLowerCase()) || e.role.toLowerCase().includes(search.toLowerCase())
        return m && (site === 'all' || e.site === site)
    })

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40, maxWidth: 1400 }}>
            {/* Header */}
            <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: 15, color: '#64748B' }}>{employees.length} team members across {allSites.length} sites</p>
                <button className="btn btn-amber"><UserPlus style={{ width: 16, height: 16 }} />Add Staff Member</button>
            </div>

            {/* Filters */}
            <div className="animate-in delay-1" style={{ display: 'flex', gap: 16 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search style={{ width: 16, height: 16, color: '#94A3B8', position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)' }} />
                    <input type="text" placeholder="Search by name or role..." value={search} onChange={e => setSearch(e.target.value)} className="input" style={{ paddingLeft: 44 }} />
                </div>
                <div style={{ position: 'relative' }}>
                    <Filter style={{ width: 16, height: 16, color: '#94A3B8', position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)' }} />
                    <select value={site} onChange={e => setSite(e.target.value)} className="input" style={{ paddingLeft: 44, width: 220, cursor: 'pointer', appearance: 'none' as any }}>
                        <option value="all">All Sites</option>
                        {allSites.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {/* Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                {filtered.map((emp, i) => (
                    <div key={emp.id} className="card animate-in" style={{ padding: 32, cursor: 'pointer', animationDelay: `${i * 50}ms` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{ width: 48, height: 48, borderRadius: 16, background: 'linear-gradient(135deg, #FCD34D, #F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14 }}>{emp.avatar}</div>
                                <div>
                                    <p style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>{emp.name}</p>
                                    <p style={{ fontSize: 14, color: '#64748B', marginTop: 4 }}>{emp.role}</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <p style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: '#64748B' }}><MapPin style={{ width: 16, height: 16, color: '#CBD5E1' }} />{emp.site}</p>
                            <p style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: '#64748B' }}><Mail style={{ width: 16, height: 16, color: '#CBD5E1' }} />{emp.email}</p>
                            <p style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: '#64748B' }}><Phone style={{ width: 16, height: 16, color: '#CBD5E1' }} />{emp.phone}</p>
                        </div>

                        <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ padding: '5px 14px', borderRadius: 14, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' as any, background: statusBg[emp.status], color: statusTx[emp.status] }}>{emp.status}</span>
                                <span style={{ fontSize: 13, color: '#94A3B8' }}>{emp.contractType}</span>
                            </div>
                            <ChevronRight style={{ width: 16, height: 16, color: '#CBD5E1' }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
