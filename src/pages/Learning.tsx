import { useState } from 'react'
import {
    Search, Play, FileText, Zap, BookOpen, CheckCircle2, Circle,
    Clock, Shield, Star, ChevronDown, ChevronUp, X, Award,
    AlertTriangle, RotateCw,
} from 'lucide-react'
import {
    learningContent, quizzes as seedQuizzes,
    type LearningContent, type Quiz, type QuizQuestion,
} from '../data/mockData'

/* ─── Type config ─── */
const typeCfg: Record<LearningContent['type'], { icon: any; bg: string; tx: string; label: string }> = {
    'video': { icon: Play, bg: '#FEF2F2', tx: '#DC2626', label: 'Video' },
    'document': { icon: FileText, bg: '#EFF6FF', tx: '#2563EB', label: 'Document' },
    'interactive': { icon: Zap, bg: '#FFFBEB', tx: '#D97706', label: 'Interactive' },
    'sop': { icon: Shield, bg: '#F0FDF4', tx: '#16A34A', label: 'SOP' },
}

const catColors: Record<string, string> = {
    Safety: '#DC2626', Compliance: '#2563EB', Operations: '#059669',
    Development: '#9333EA',
}

/* ─── Category tabs ─── */
const categoryTabs = [
    { key: 'all', label: 'All' },
    { key: 'Safety', label: 'Safety' },
    { key: 'Compliance', label: 'Compliance' },
    { key: 'Operations', label: 'Operations' },
    { key: 'Development', label: 'Development' },
]

/* ═══ Quiz Modal ═══ */
function QuizModal({ quiz: initQuiz, onClose }: { quiz: Quiz; onClose: (q: Quiz) => void }) {
    const [quiz, setQuiz] = useState<Quiz>({ ...initQuiz })
    const [currentQ, setCurrentQ] = useState(0)
    const [answers, setAnswers] = useState<(number | null)[]>(new Array(quiz.questions.length).fill(null))
    const [submitted, setSubmitted] = useState(false)

    const q = quiz.questions[currentQ]
    const totalQs = quiz.questions.length
    const answered = answers.filter(a => a !== null).length

    const handleAnswer = (optIdx: number) => {
        if (submitted) return
        const next = [...answers]
        next[currentQ] = optIdx
        setAnswers(next)
    }

    const handleSubmit = () => {
        const correct = answers.reduce<number>((acc, a, i) => a === quiz.questions[i].correctIndex ? acc + 1 : acc, 0)
        const score = Math.round((correct / totalQs) * 100)
        const passed = score >= quiz.passMarkPercent
        setQuiz(prev => ({ ...prev, attemptsUsed: prev.attemptsUsed + 1, passed }))
        setSubmitted(true)
    }

    const score = submitted
        ? Math.round((answers.reduce<number>((acc, a, i) => a === quiz.questions[i].correctIndex ? acc + 1 : acc, 0) / totalQs) * 100)
        : 0

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)' }} onClick={() => onClose(quiz)} />
            <div className="animate-pop" style={{ position: 'relative', width: 640, maxHeight: '85vh', overflow: 'auto', background: 'white', borderRadius: 28, padding: 40, boxShadow: '0 24px 48px -12px rgba(15,23,42,0.15)' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A' }}>{quiz.title}</h3>
                        <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>Pass mark: {quiz.passMarkPercent}% · Attempts: {quiz.attemptsUsed}/{quiz.maxAttempts}</p>
                    </div>
                    <button onClick={() => onClose(quiz)} style={{ padding: 6, borderRadius: 12, border: 'none', background: 'transparent', cursor: 'pointer' }}><X style={{ width: 18, height: 18, color: '#94A3B8' }} /></button>
                </div>

                {!submitted ? (
                    <>
                        {/* Progress */}
                        <div style={{ display: 'flex', gap: 4, marginBottom: 28 }}>
                            {quiz.questions.map((_, i) => (
                                <button key={i} onClick={() => setCurrentQ(i)} style={{
                                    flex: 1, height: 6, borderRadius: 3, border: 'none', cursor: 'pointer',
                                    background: i === currentQ ? '#F59E0B' : answers[i] !== null ? '#10B981' : '#E2E8F0',
                                    transition: 'all 0.2s',
                                }} />
                            ))}
                        </div>

                        {/* Question */}
                        <div style={{ marginBottom: 28 }}>
                            <p style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' as any, letterSpacing: '0.05em', marginBottom: 10 }}>Question {currentQ + 1} of {totalQs}</p>
                            <p style={{ fontSize: 16, fontWeight: 600, color: '#0F172A', lineHeight: 1.5 }}>{q.question}</p>
                        </div>

                        {/* Options */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
                            {q.options.map((opt, i) => {
                                const selected = answers[currentQ] === i
                                return (
                                    <button key={i} onClick={() => handleAnswer(i)} style={{
                                        display: 'flex', alignItems: 'center', gap: 14,
                                        padding: '16px 20px', borderRadius: 16, border: 'none',
                                        background: selected ? '#FFFBEB' : '#F8FAFC',
                                        boxShadow: selected ? '0 0 0 2px #F59E0B' : 'none',
                                        cursor: 'pointer', textAlign: 'left' as any, transition: 'all 0.15s', width: '100%',
                                    }}>
                                        {selected
                                            ? <CheckCircle2 style={{ width: 20, height: 20, color: '#F59E0B', flexShrink: 0 }} />
                                            : <Circle style={{ width: 20, height: 20, color: '#CBD5E1', flexShrink: 0 }} />
                                        }
                                        <span style={{ fontSize: 14, color: selected ? '#92400E' : '#334155', fontWeight: selected ? 600 : 400 }}>{opt}</span>
                                    </button>
                                )
                            })}
                        </div>

                        {/* Nav */}
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} className="btn btn-outline" disabled={currentQ === 0} style={{ opacity: currentQ === 0 ? 0.5 : 1 }}>Previous</button>
                            {currentQ < totalQs - 1
                                ? <button onClick={() => setCurrentQ(currentQ + 1)} className="btn btn-amber">Next</button>
                                : <button onClick={handleSubmit} className="btn btn-amber" disabled={answered < totalQs} style={{ opacity: answered < totalQs ? 0.6 : 1 }}>
                                    <Award style={{ width: 14, height: 14 }} />Submit Quiz
                                </button>
                            }
                        </div>
                    </>
                ) : (
                    /* ─── Results ─── */
                    <div className="animate-in" style={{ textAlign: 'center', padding: '20px 0' }}>
                        <div style={{
                            width: 100, height: 100, borderRadius: '50%', margin: '0 auto 24px',
                            background: quiz.passed ? '#ECFDF5' : '#FEF2F2',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            {quiz.passed
                                ? <CheckCircle2 style={{ width: 48, height: 48, color: '#10B981' }} />
                                : <AlertTriangle style={{ width: 48, height: 48, color: '#DC2626' }} />
                            }
                        </div>
                        <h3 style={{ fontSize: 24, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>
                            {quiz.passed ? 'Congratulations! 🎉' : 'Not quite...'}
                        </h3>
                        <p style={{ fontSize: 40, fontWeight: 700, color: quiz.passed ? '#059669' : '#DC2626', marginBottom: 8 }}>{score}%</p>
                        <p style={{ fontSize: 14, color: '#64748B', marginBottom: 32 }}>
                            {quiz.passed
                                ? `You passed with ${score}% (pass mark: ${quiz.passMarkPercent}%)`
                                : `You scored ${score}% — pass mark is ${quiz.passMarkPercent}%. ${quiz.attemptsUsed < quiz.maxAttempts ? 'You can try again.' : 'No attempts remaining.'}`
                            }
                        </p>

                        {/* Answer review */}
                        <div style={{ textAlign: 'left', marginBottom: 28 }}>
                            {quiz.questions.map((qq, i) => {
                                const correct = answers[i] === qq.correctIndex
                                return (
                                    <div key={qq.id} style={{ padding: '14px 18px', borderRadius: 14, background: correct ? 'rgba(236,253,245,0.4)' : 'rgba(254,242,242,0.4)', marginBottom: 8, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                        {correct ? <CheckCircle2 style={{ width: 16, height: 16, color: '#10B981', marginTop: 2, flexShrink: 0 }} /> : <X style={{ width: 16, height: 16, color: '#DC2626', marginTop: 2, flexShrink: 0 }} />}
                                        <div>
                                            <p style={{ fontSize: 13, fontWeight: 500, color: '#1E293B' }}>{qq.question}</p>
                                            {!correct && <p style={{ fontSize: 12, color: '#059669', marginTop: 4 }}>Correct: {qq.options[qq.correctIndex]}</p>}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <button onClick={() => onClose(quiz)} className="btn btn-amber">Done</button>
                    </div>
                )}
            </div>
        </div>
    )
}

/* ═══ Main Page ═══ */
export default function Learning() {
    const [activeTab, setActiveTab] = useState('all')
    const [search, setSearch] = useState('')
    const [mandatoryOnly, setMandatoryOnly] = useState(false)
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [quizState, setQuizState] = useState<Quiz[]>(seedQuizzes.map(q => ({ ...q })))
    const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null)

    /* Stats */
    const avgProgress = Math.round(learningContent.reduce((acc, lc) => acc + (lc.progress || 0), 0) / learningContent.length)
    const mandatory = learningContent.filter(lc => lc.mandatory)
    const mandatoryComplete = mandatory.filter(lc => (lc.progress || 0) >= 100).length

    /* Filter */
    const filtered = learningContent.filter(lc => {
        if (activeTab !== 'all' && lc.category !== activeTab) return false
        if (mandatoryOnly && !lc.mandatory) return false
        if (search) {
            const q = search.toLowerCase()
            return lc.title.toLowerCase().includes(q) || lc.description.toLowerCase().includes(q)
        }
        return true
    })

    const openQuiz = (quizId: string) => {
        const q = quizState.find(qz => qz.id === quizId)
        if (q && !q.locked && q.attemptsUsed < q.maxAttempts) setActiveQuiz(q)
    }

    const closeQuiz = (updatedQuiz: Quiz) => {
        setQuizState(prev => prev.map(q => q.id === updatedQuiz.id ? updatedQuiz : q))
        setActiveQuiz(null)
    }

    return (
        <>
            {activeQuiz && <QuizModal quiz={activeQuiz} onClose={closeQuiz} />}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 1400 }}>

                {/* Header */}
                <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: 15, color: '#64748B' }}>
                        {learningContent.length} courses · {mandatoryComplete}/{mandatory.length} mandatory complete
                    </p>
                </div>

                {/* Stats cards */}
                <div className="animate-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                    {/* Overall progress */}
                    <div className="card" style={{ padding: 28, display: 'flex', alignItems: 'center', gap: 20 }}>
                        <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
                            <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 80 80">
                                <circle cx="40" cy="40" r="32" fill="none" stroke="#F1F5F9" strokeWidth="7" />
                                <circle cx="40" cy="40" r="32" fill="none" stroke="#F59E0B" strokeWidth="7" strokeLinecap="round"
                                    strokeDasharray={2 * Math.PI * 32} strokeDashoffset={2 * Math.PI * 32 * (1 - avgProgress / 100)} style={{ transition: 'all 0.7s' }} />
                            </svg>
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>{avgProgress}%</span>
                            </div>
                        </div>
                        <div>
                            <p style={{ fontSize: 13, fontWeight: 600, color: '#64748B' }}>Overall Progress</p>
                            <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>{learningContent.filter(lc => (lc.progress || 0) >= 100).length} of {learningContent.length} complete</p>
                        </div>
                    </div>

                    {/* Mandatory compliance */}
                    <div className="card" style={{ padding: 28, display: 'flex', alignItems: 'center', gap: 20 }}>
                        <div style={{ width: 56, height: 56, borderRadius: 18, background: mandatoryComplete === mandatory.length ? '#ECFDF5' : '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Shield style={{ width: 24, height: 24, color: mandatoryComplete === mandatory.length ? '#10B981' : '#D97706' }} />
                        </div>
                        <div>
                            <p style={{ fontSize: 24, fontWeight: 700, color: '#0F172A' }}>{mandatoryComplete}/{mandatory.length}</p>
                            <p style={{ fontSize: 13, fontWeight: 500, color: '#64748B' }}>Mandatory Complete</p>
                        </div>
                    </div>

                    {/* Quizzes */}
                    <div className="card" style={{ padding: 28, display: 'flex', alignItems: 'center', gap: 20 }}>
                        <div style={{ width: 56, height: 56, borderRadius: 18, background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Award style={{ width: 24, height: 24, color: '#16A34A' }} />
                        </div>
                        <div>
                            <p style={{ fontSize: 24, fontWeight: 700, color: '#0F172A' }}>{quizState.filter(q => q.passed).length}/{quizState.length}</p>
                            <p style={{ fontSize: 13, fontWeight: 500, color: '#64748B' }}>Quizzes Passed</p>
                        </div>
                    </div>
                </div>

                {/* Category tabs */}
                <div className="animate-in" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                    {categoryTabs.map(cat => {
                        const isActive = activeTab === cat.key
                        const count = cat.key === 'all' ? learningContent.length : learningContent.filter(lc => lc.category === cat.key).length
                        return (
                            <button key={cat.key} onClick={() => setActiveTab(cat.key)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    padding: '10px 20px', borderRadius: 14, border: 'none',
                                    fontSize: 13, fontWeight: isActive ? 600 : 500, cursor: 'pointer',
                                    background: isActive ? '#FFFBEB' : 'white',
                                    color: isActive ? '#B45309' : '#64748B',
                                    boxShadow: isActive ? '0 1px 3px rgba(245,158,11,0.15)' : '0 1px 2px rgba(15,23,42,0.04)',
                                    transition: 'all 0.2s',
                                }}>
                                {cat.label}
                                <span style={{ padding: '1px 8px', borderRadius: 8, fontSize: 11, fontWeight: 700, background: isActive ? '#FDE68A' : '#F1F5F9', color: isActive ? '#92400E' : '#94A3B8' }}>{count}</span>
                            </button>
                        )
                    })}
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#64748B' }}>
                            <input type="checkbox" checked={mandatoryOnly} onChange={e => setMandatoryOnly(e.target.checked)} style={{ accentColor: '#F59E0B' }} />
                            Mandatory only
                        </label>
                    </div>
                </div>

                {/* Search */}
                <div className="animate-in" style={{ position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#94A3B8' }} />
                    <input type="text" placeholder="Search courses..." className="input" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 44 }} />
                </div>

                {/* Content list */}
                {filtered.length === 0 ? (
                    <div className="card animate-in" style={{ padding: 48, textAlign: 'center' }}>
                        <BookOpen style={{ width: 32, height: 32, color: '#CBD5E1', margin: '0 auto 16px' }} />
                        <p style={{ fontSize: 15, color: '#94A3B8' }}>No courses match your criteria</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {filtered.map((lc, i) => {
                            const cfg = typeCfg[lc.type]
                            const Icon = cfg.icon
                            const catCol = catColors[lc.category] || '#64748B'
                            const prog = lc.progress || 0
                            const isExp = expandedId === lc.id
                            const quiz = lc.quizId ? quizState.find(q => q.id === lc.quizId) : null

                            return (
                                <div key={lc.id} className={`card animate-in delay-${Math.min(i + 1, 4)}`} style={{ overflow: 'hidden' }}>
                                    <div style={{ padding: '24px 28px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                            {/* Type icon */}
                                            <div style={{ width: 48, height: 48, borderRadius: 16, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <Icon style={{ width: 20, height: 20, color: cfg.tx }} />
                                            </div>

                                            {/* Title + meta */}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <p style={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>{lc.title}</p>
                                                    {lc.isDevelopmentSignal && <Star style={{ width: 14, height: 14, color: '#F59E0B', fill: '#F59E0B' }} />}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                                                    <span style={{ padding: '2px 10px', borderRadius: 8, fontSize: 10, fontWeight: 600, background: `${catCol}10`, color: catCol }}>{lc.category}</span>
                                                    <span style={{ fontSize: 12, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4 }}><Clock style={{ width: 11, height: 11 }} />{lc.duration}</span>
                                                    <span style={{ fontSize: 12, color: '#94A3B8' }}>{lc.timeSequence}</span>
                                                    {lc.mandatory && <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, background: '#FEF2F2', color: '#DC2626' }}>Required</span>}
                                                </div>
                                            </div>

                                            {/* Progress */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 140 }}>
                                                <div style={{ flex: 1, height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                                                    <div style={{ width: `${prog}%`, height: '100%', borderRadius: 4, background: prog >= 100 ? '#10B981' : '#FBBF24', transition: 'width 0.5s' }} />
                                                </div>
                                                <span style={{ fontSize: 12, fontWeight: 700, color: prog >= 100 ? '#059669' : '#64748B', fontVariantNumeric: 'tabular-nums', minWidth: 30, textAlign: 'right' as any }}>{prog}%</span>
                                            </div>

                                            {/* Quiz badge */}
                                            {quiz && (
                                                <button onClick={() => openQuiz(quiz.id)} disabled={quiz.locked || quiz.attemptsUsed >= quiz.maxAttempts}
                                                    style={{
                                                        padding: '6px 16px', borderRadius: 12, border: 'none', cursor: quiz.locked ? 'not-allowed' : 'pointer',
                                                        fontSize: 12, fontWeight: 600,
                                                        background: quiz.passed ? '#ECFDF5' : '#FFFBEB',
                                                        color: quiz.passed ? '#059669' : '#D97706',
                                                        opacity: quiz.locked || quiz.attemptsUsed >= quiz.maxAttempts ? 0.5 : 1,
                                                        display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s',
                                                    }}>
                                                    {quiz.passed ? <CheckCircle2 style={{ width: 12, height: 12 }} /> : <Award style={{ width: 12, height: 12 }} />}
                                                    {quiz.passed ? 'Passed' : 'Take Quiz'}
                                                </button>
                                            )}

                                            {/* Expand */}
                                            <button onClick={() => setExpandedId(isExp ? null : lc.id)} style={{ padding: 6, border: 'none', background: 'none', cursor: 'pointer' }}>
                                                {isExp ? <ChevronUp style={{ width: 16, height: 16, color: '#94A3B8' }} /> : <ChevronDown style={{ width: 16, height: 16, color: '#94A3B8' }} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Expanded detail */}
                                    {isExp && (
                                        <div className="animate-in" style={{ padding: '0 28px 24px' }}>
                                            <div style={{ padding: 20, background: '#FAFAFA', borderRadius: 16, border: '1px solid #F1F5F9' }}>
                                                <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, marginBottom: 12 }}>{lc.description}</p>
                                                <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#94A3B8' }}>
                                                    <span><strong>Roles:</strong> {lc.roles.join(', ')}</span>
                                                    <span><strong>Type:</strong> {cfg.label}</span>
                                                </div>
                                                {quiz && (
                                                    <div style={{ marginTop: 16, padding: '14px 18px', borderRadius: 14, background: quiz.passed ? 'rgba(236,253,245,0.5)' : 'white', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 14 }}>
                                                        <Award style={{ width: 18, height: 18, color: quiz.passed ? '#10B981' : '#D97706' }} />
                                                        <div style={{ flex: 1 }}>
                                                            <p style={{ fontSize: 13, fontWeight: 600, color: '#1E293B' }}>{quiz.title}</p>
                                                            <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>
                                                                Pass mark: {quiz.passMarkPercent}% · Attempts: {quiz.attemptsUsed}/{quiz.maxAttempts}
                                                                {quiz.passed && ' · ✅ Passed'}
                                                            </p>
                                                        </div>
                                                        {!quiz.passed && quiz.attemptsUsed < quiz.maxAttempts && (
                                                            <button onClick={() => openQuiz(quiz.id)} className="btn btn-amber" style={{ fontSize: 12, padding: '8px 16px' }}>
                                                                <RotateCw style={{ width: 12, height: 12 }} />{quiz.attemptsUsed > 0 ? 'Retry' : 'Start'}
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </>
    )
}
