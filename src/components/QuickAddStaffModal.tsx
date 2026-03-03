import { useState } from 'react'
import { X, ChevronRight, ChevronLeft, Check, Send, UserPlus, FileText, ClipboardList } from 'lucide-react'
import { useStaff } from '../context/StaffContext'
import { useNavigate } from 'react-router-dom'

/* ─── Employment types with default document bundles ─── */
const employmentTypes = [
    {
        id: 'perm-ft', name: 'Permanent Full-Time', desc: 'Salary, 90-day trial, KiwiSaver', icon: '📋',
        docs: ['Employment Agreement', 'Job Description', 'IR330 Tax Declaration', 'KS2 KiwiSaver', 'H&S Acknowledgment']
    },
    {
        id: 'perm-pt', name: 'Permanent Part-Time', desc: 'Pro-rata salary, agreed hours', icon: '📄',
        docs: ['Employment Agreement', 'Job Description', 'IR330 Tax Declaration', 'KS2 KiwiSaver', 'H&S Acknowledgment']
    },
    {
        id: 'fixed', name: 'Fixed-Term', desc: 'End date, genuine reason required', icon: '📅',
        docs: ['Fixed-Term Agreement', 'Job Description', 'IR330 Tax Declaration', 'KS2 KiwiSaver', 'H&S Acknowledgment']
    },
    {
        id: 'casual', name: 'Casual', desc: 'No guaranteed hours, casual loading', icon: '🔄',
        docs: ['Casual Agreement', 'IR330 Tax Declaration', 'H&S Acknowledgment']
    },
    {
        id: 'seasonal', name: 'Seasonal / Harvest', desc: 'Season dates, accommodation', icon: '🌾',
        docs: ['Seasonal Agreement', 'IR330 Tax Declaration', 'H&S Acknowledgment', 'Accommodation Agreement']
    },
    {
        id: 'contractor', name: 'Contractor', desc: 'Independent agreement, GST', icon: '🔧',
        docs: ['Contractor Agreement', 'H&S Acknowledgment']
    },
]

const allDocuments = [
    'Employment Agreement', 'Fixed-Term Agreement', 'Casual Agreement', 'Seasonal Agreement',
    'Contractor Agreement', 'Job Description', 'IR330 Tax Declaration', 'KS2 KiwiSaver',
    'H&S Acknowledgment', 'Accommodation Agreement', 'Variation Letter', 'Confidentiality Agreement',
    'Vehicle Use Agreement', 'Drug & Alcohol Policy', 'Social Media Policy',
]

const departments = ['Operations', 'Production', 'HR', 'Maintenance', 'Health & Safety', 'Finance']
const siteOptions = ['Forest Farm', 'Lichfield Farm', 'Masterton Farm', 'Main Office (Lichfield)', 'Sunny Bay Farm']
const managers = ['Luke Benefield', 'James Wiremu', 'Liam Chen', 'Aroha Ngata', 'Tom Henderson']

interface Props {
    open: boolean
    onClose: () => void
}

export default function QuickAddStaffModal({ open, onClose }: Props) {
    const { addHire } = useStaff()
    const navigate = useNavigate()
    const [step, setStep] = useState(1)
    const [selectedType, setSelectedType] = useState<string | null>(null)
    const [selectedDocs, setSelectedDocs] = useState<string[]>([])
    const [trial, setTrial] = useState(true)
    const [form, setForm] = useState({ name: '', email: '', role: '', salary: '', department: departments[0], site: siteOptions[0], startDate: '', manager: managers[0] })
    const [success, setSuccess] = useState(false)

    if (!open) return null

    const typeObj = employmentTypes.find(t => t.id === selectedType)

    const selectType = (id: string) => {
        setSelectedType(id)
        const t = employmentTypes.find(x => x.id === id)
        if (t) setSelectedDocs([...t.docs])
    }

    const toggleDoc = (doc: string) => {
        setSelectedDocs(prev => prev.includes(doc) ? prev.filter(d => d !== doc) : [...prev, doc])
    }

    const handleSubmit = () => {
        addHire({
            name: form.name,
            email: form.email,
            role: form.role,
            salary: form.salary,
            department: form.department,
            site: form.site,
            startDate: form.startDate,
            manager: form.manager,
            employmentType: typeObj?.name || '',
            trialPeriod: trial,
            selectedDocs,
        })
        setSuccess(true)
        setTimeout(() => {
            onClose()
            setStep(1)
            setSelectedType(null)
            setSelectedDocs([])
            setForm({ name: '', email: '', role: '', salary: '', department: departments[0], site: siteOptions[0], startDate: '', manager: managers[0] })
            setSuccess(false)
            navigate('/contracts')
        }, 1500)
    }

    const canProceedStep2 = form.name && form.email && form.role
    const canProceedStep1 = selectedType !== null

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Backdrop */}
            <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)' }} />

            {/* Modal */}
            <div className="animate-pop" style={{ position: 'relative', width: '100%', maxWidth: 720, maxHeight: '90vh', overflow: 'auto', background: 'white', borderRadius: 28, boxShadow: '0 32px 64px -16px rgba(15,23,42,0.2)', zIndex: 101 }}>
                {/* Header */}
                <div style={{ position: 'sticky', top: 0, background: 'white', borderBottom: '1px solid #F1F5F9', padding: '24px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 5, borderRadius: '28px 28px 0 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <UserPlus style={{ width: 20, height: 20, color: '#F59E0B' }} />
                        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A' }}>Quick Add Staff</h2>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        {/* Steps indicator */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {[1, 2, 3].map(s => (
                                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{
                                        width: 28, height: 28, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 12, fontWeight: 700,
                                        background: step >= s ? '#F59E0B' : '#F1F5F9',
                                        color: step >= s ? 'white' : '#94A3B8',
                                        transition: 'all 0.3s',
                                    }}>{step > s ? <Check style={{ width: 14, height: 14 }} /> : s}</div>
                                    {s < 3 && <div style={{ width: 20, height: 2, background: step > s ? '#F59E0B' : '#E2E8F0', borderRadius: 1, transition: 'all 0.3s' }} />}
                                </div>
                            ))}
                        </div>
                        <button onClick={onClose} style={{ padding: 8, borderRadius: 12, border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8', transition: 'all 0.2s' }}>
                            <X style={{ width: 20, height: 20 }} />
                        </button>
                    </div>
                </div>

                {/* Success overlay */}
                {success && (
                    <div style={{ padding: '80px 36px', textAlign: 'center' }} className="animate-in">
                        <div style={{ width: 64, height: 64, borderRadius: 32, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <Check style={{ width: 32, height: 32, color: '#10B981' }} />
                        </div>
                        <h3 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A' }}>Staff Member Added!</h3>
                        <p style={{ fontSize: 15, color: '#64748B', marginTop: 8 }}>Redirecting to Smart Contracts…</p>
                    </div>
                )}

                {/* Step 1: Employment Type */}
                {!success && step === 1 && (
                    <div style={{ padding: 36 }}>
                        <p style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>What type of employment?</p>
                        <p style={{ fontSize: 14, color: '#64748B', marginBottom: 28 }}>This determines which contracts and documents are generated.</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                            {employmentTypes.map(t => (
                                <button key={t.id} onClick={() => selectType(t.id)}
                                    style={{
                                        textAlign: 'left' as any, padding: 24, borderRadius: 20,
                                        border: selectedType === t.id ? '2px solid #FCD34D' : '2px solid #F1F5F9',
                                        background: selectedType === t.id ? '#FFFBEB' : 'white',
                                        cursor: 'pointer', transition: 'all 0.2s',
                                    }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                                        <span style={{ fontSize: 24 }}>{t.icon}</span>
                                        <span style={{ fontSize: 15, fontWeight: 600, color: selectedType === t.id ? '#B45309' : '#1E293B' }}>{t.name}</span>
                                    </div>
                                    <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>{t.desc}</p>
                                    {selectedType === t.id && (
                                        <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap' as any, gap: 6 }}>
                                            {t.docs.map(d => (
                                                <span key={d} style={{ padding: '3px 10px', borderRadius: 10, background: '#FEF3C7', fontSize: 10, fontWeight: 600, color: '#92400E' }}>{d}</span>
                                            ))}
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Employee Details */}
                {!success && step === 2 && (
                    <div style={{ padding: 36 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
                            <span style={{ fontSize: 20 }}>{typeObj?.icon}</span>
                            <div>
                                <p style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>Employee Details</p>
                                <p style={{ fontSize: 13, color: '#64748B' }}>{typeObj?.name} · {typeObj?.desc}</p>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                            {[
                                { label: 'Full Name *', key: 'name', placeholder: 'e.g. Rawiri Manu', type: 'text' },
                                { label: 'Email *', key: 'email', placeholder: 'rawiri@email.com', type: 'email' },
                                { label: 'Role / Position *', key: 'role', placeholder: 'e.g. Farm Hand', type: 'text' },
                                { label: 'Salary / Rate', key: 'salary', placeholder: 'e.g. $55,000', type: 'text' },
                            ].map(f => (
                                <div key={f.key}>
                                    <label style={{ fontSize: 13, fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 8 }}>{f.label}</label>
                                    <input type={f.type} placeholder={f.placeholder} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="input" />
                                </div>
                            ))}
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 8 }}>Department</label>
                                <select value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} className="input" style={{ cursor: 'pointer' }}>
                                    {departments.map(d => <option key={d}>{d}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 8 }}>Site</label>
                                <select value={form.site} onChange={e => setForm(p => ({ ...p, site: e.target.value }))} className="input" style={{ cursor: 'pointer' }}>
                                    {siteOptions.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 8 }}>Start Date</label>
                                <input type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} className="input" />
                            </div>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 8 }}>Reporting Manager</label>
                                <select value={form.manager} onChange={e => setForm(p => ({ ...p, manager: e.target.value }))} className="input" style={{ cursor: 'pointer' }}>
                                    {managers.map(m => <option key={m}>{m}</option>)}
                                </select>
                            </div>
                        </div>
                        {(selectedType === 'perm-ft' || selectedType === 'perm-pt' || selectedType === 'fixed') && (
                            <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 24, fontSize: 14, color: '#475569', cursor: 'pointer' }}>
                                <input type="checkbox" checked={trial} onChange={e => setTrial(e.target.checked)} style={{ accentColor: '#F59E0B', width: 18, height: 18 }} />
                                Include 90-day trial period
                            </label>
                        )}
                    </div>
                )}

                {/* Step 3: Document Checklist */}
                {!success && step === 3 && (
                    <div style={{ padding: 36 }}>
                        <div style={{ marginBottom: 28 }}>
                            <p style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>Select Documents</p>
                            <p style={{ fontSize: 14, color: '#64748B', marginTop: 4 }}>
                                Pre-selected based on <span style={{ fontWeight: 600, color: '#B45309' }}>{typeObj?.name}</span>. Add or remove as needed.
                            </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderRadius: 16, background: '#FFFBEB', border: '1px solid #FEF3C7', marginBottom: 24 }}>
                            <ClipboardList style={{ width: 18, height: 18, color: '#D97706' }} />
                            <p style={{ fontSize: 13, color: '#92400E' }}><span style={{ fontWeight: 700 }}>{selectedDocs.length}</span> documents selected for <span style={{ fontWeight: 700 }}>{form.name || 'new employee'}</span></p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                            {allDocuments.map(doc => {
                                const checked = selectedDocs.includes(doc)
                                const isDefault = typeObj?.docs.includes(doc)
                                return (
                                    <button key={doc} onClick={() => toggleDoc(doc)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 12, padding: '16px 18px', borderRadius: 16,
                                            border: checked ? '2px solid #FCD34D' : '2px solid #F1F5F9',
                                            background: checked ? '#FFFBEB' : 'white',
                                            cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left' as any,
                                        }}>
                                        <div style={{
                                            width: 22, height: 22, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                            background: checked ? '#F59E0B' : '#F1F5F9',
                                            color: checked ? 'white' : '#CBD5E1',
                                            transition: 'all 0.15s',
                                        }}>
                                            {checked && <Check style={{ width: 14, height: 14 }} />}
                                        </div>
                                        <div>
                                            <p style={{ fontSize: 13, fontWeight: 600, color: checked ? '#92400E' : '#475569' }}>{doc}</p>
                                            {isDefault && <p style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>Included by default</p>}
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Footer */}
                {!success && (
                    <div style={{ position: 'sticky', bottom: 0, background: 'white', borderTop: '1px solid #F1F5F9', padding: '20px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '0 0 28px 28px' }}>
                        <div>
                            {step > 1 && (
                                <button onClick={() => setStep(s => s - 1)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 14, border: '1.5px solid #E2E8F0', background: 'white', color: '#475569', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                                    <ChevronLeft style={{ width: 16, height: 16 }} />Back
                                </button>
                            )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: 14, border: '1.5px solid #E2E8F0', background: 'white', color: '#64748B', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>Cancel</button>
                            {step === 1 && (
                                <button onClick={() => canProceedStep1 && setStep(2)} disabled={!canProceedStep1}
                                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 14, border: 'none', background: canProceedStep1 ? '#F59E0B' : '#E2E8F0', color: canProceedStep1 ? 'white' : '#94A3B8', fontSize: 14, fontWeight: 600, cursor: canProceedStep1 ? 'pointer' : 'default', transition: 'all 0.2s', boxShadow: canProceedStep1 ? '0 1px 2px rgba(245,158,11,0.3)' : 'none' }}>
                                    Continue<ChevronRight style={{ width: 16, height: 16 }} />
                                </button>
                            )}
                            {step === 2 && (
                                <button onClick={() => canProceedStep2 && setStep(3)} disabled={!canProceedStep2}
                                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 14, border: 'none', background: canProceedStep2 ? '#F59E0B' : '#E2E8F0', color: canProceedStep2 ? 'white' : '#94A3B8', fontSize: 14, fontWeight: 600, cursor: canProceedStep2 ? 'pointer' : 'default', transition: 'all 0.2s', boxShadow: canProceedStep2 ? '0 1px 2px rgba(245,158,11,0.3)' : 'none' }}>
                                    Continue<ChevronRight style={{ width: 16, height: 16 }} />
                                </button>
                            )}
                            {step === 3 && (
                                <button onClick={handleSubmit}
                                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 14, border: 'none', background: '#F59E0B', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(245,158,11,0.3)' }}>
                                    <Send style={{ width: 16, height: 16 }} />Add to Contracts
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
