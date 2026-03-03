import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, FileText, ShieldAlert, MapPin, ClipboardList, ClipboardCheck, BookOpen, Megaphone, DollarSign, Shield, Egg, Bell, ChevronLeft, ChevronDown, Settings, LogOut, User, X, Clock } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const nav = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Staff Management', href: '/employees', icon: Users },
    { name: 'Onboarding', href: '/onboarding', icon: ClipboardList },
    { name: 'Documents', href: '/documents', icon: FileText },
    { name: 'Learning', href: '/learning', icon: BookOpen },
    { name: 'Checklists', href: '/checklists', icon: ClipboardCheck },
    { name: 'Health & Safety', href: '/health-safety', icon: ShieldAlert },
    { name: 'Communications', href: '/communications', icon: Megaphone },
    { name: 'Time & Attendance', href: '/site-sign-in', icon: Clock },
    { name: 'Budgets', href: '/budgets', icon: DollarSign },
    { name: 'Audit', href: '/audit', icon: Shield },
]

const notifications = [
    { id: 'n1', title: 'Liam Chen — Forklift License expires in 7 days', time: '2h ago', type: 'orange' as const, read: false },
    { id: 'n2', title: 'New incident reported at Lichfield Farm', time: '4h ago', type: 'red' as const, read: false },
    { id: 'n3', title: 'Rawiri Manu completed KiwiSaver form', time: '1d ago', type: 'emerald' as const, read: false },
    { id: 'n4', title: 'Tom Henderson — Hazardous Substances cert expired', time: '3d ago', type: 'red' as const, read: true },
    { id: 'n5', title: 'Monthly H&S report ready for review', time: '5d ago', type: 'blue' as const, read: true },
]
const dotClr = { orange: 'bg-orange-500', red: 'bg-red-500', emerald: 'bg-emerald-500', blue: 'bg-blue-500' }

export default function Layout() {
    const location = useLocation()
    const [collapsed, setCollapsed] = useState(false)
    const [notifOpen, setNotifOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const notifRef = useRef<HTMLDivElement>(null)
    const profileRef = useRef<HTMLDivElement>(null)
    const page = nav.find(n => n.href === location.pathname)?.name
        || (location.pathname.startsWith('/onboarding') ? 'Onboarding' : 'Dashboard')
    const unread = notifications.filter(n => !n.read).length

    useEffect(() => {
        function handler(e: MouseEvent) {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    return (
        <div className="flex h-screen overflow-hidden" style={{ background: '#F8FAFC' }}>
            {/* ─── Sidebar ─── */}
            <aside className={`${collapsed ? 'w-20' : 'w-64'} flex flex-col bg-white transition-all duration-300 flex-shrink-0`} style={{ borderRight: '1px solid #E2E8F0' }}>
                {/* Logo */}
                <div className="flex items-center gap-4 h-24" style={{ padding: '0 28px', borderBottom: '1px solid #F1F5F9' }}>
                    <div className="w-11 h-11 flex items-center justify-center flex-shrink-0" style={{ borderRadius: 16, background: 'linear-gradient(135deg, #FBBF24, #D97706)' }}>
                        <Egg className="w-5 h-5 text-white" />
                    </div>
                    {!collapsed && <p style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>Better Eggs</p>}
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto" style={{ padding: '32px 16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {nav.map((item) => {
                            const Icon = item.icon
                            const active = item.href === '/'
                                ? location.pathname === '/'
                                : location.pathname.startsWith(item.href)
                            return (
                                <NavLink key={item.name} to={item.href} title={collapsed ? item.name : undefined}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 14,
                                        padding: collapsed ? '14px' : '14px 20px',
                                        borderRadius: 16, fontSize: 14,
                                        fontWeight: active ? 600 : 500,
                                        color: active ? '#B45309' : '#64748B',
                                        background: active ? '#FFFBEB' : 'transparent',
                                        transition: 'all 0.2s',
                                        textDecoration: 'none',
                                    }}
                                    onMouseEnter={e => { if (!active) { (e.target as HTMLElement).style.background = '#F8FAFC'; (e.target as HTMLElement).style.color = '#334155' } }}
                                    onMouseLeave={e => { if (!active) { (e.target as HTMLElement).style.background = 'transparent'; (e.target as HTMLElement).style.color = '#64748B' } }}
                                >
                                    <Icon style={{ width: 20, height: 20, flexShrink: 0, color: active ? '#D97706' : '#94A3B8' }} />
                                    {!collapsed && <span>{item.name}</span>}
                                </NavLink>
                            )
                        })}
                    </div>
                </nav>

                {/* Footer */}
                <div style={{ padding: '24px 16px', borderTop: '1px solid #F1F5F9' }}>
                    {!collapsed && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', marginBottom: 12, borderRadius: 16, background: '#F8FAFC' }}>
                            <div style={{ width: 36, height: 36, borderRadius: 12, background: 'linear-gradient(135deg, #FBBF24, #D97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700 }}>LB</div>
                            <div>
                                <p style={{ fontSize: 13, color: '#64748B' }}>Signed in as</p>
                                <p style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>HR Admin</p>
                            </div>
                        </div>
                    )}
                    <button onClick={() => setCollapsed(!collapsed)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 16px', borderRadius: 16, color: '#94A3B8', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, transition: 'all 0.2s' }}>
                        <ChevronLeft style={{ width: 16, height: 16, transition: 'transform 0.3s', transform: collapsed ? 'rotate(180deg)' : 'none' }} />
                        {!collapsed && <span>Collapse</span>}
                    </button>
                </div>
            </aside>

            {/* ─── Main ─── */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header style={{ height: 80, borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 56px', flexShrink: 0, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 30 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A' }}>{page}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        {/* Notifications */}
                        <div className="relative" ref={notifRef}>
                            <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false) }} style={{ position: 'relative', padding: 12, borderRadius: 16, border: 'none', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
                                <Bell style={{ width: 20, height: 20, color: '#94A3B8' }} />
                                {unread > 0 && <span style={{ position: 'absolute', top: 6, right: 6, width: 16, height: 16, background: '#EF4444', borderRadius: 8, fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>{unread}</span>}
                            </button>
                            {notifOpen && (
                                <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 12, width: 420, background: 'white', borderRadius: 24, border: '1px solid #F1F5F9', boxShadow: '0 20px 40px -8px rgb(15 23 42 / 0.1)', zIndex: 50, overflow: 'hidden' }} className="animate-pop">
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px', borderBottom: '1px solid #F1F5F9' }}>
                                        <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Notifications</h4>
                                        <button onClick={() => setNotifOpen(false)} style={{ padding: 6, borderRadius: 12, border: 'none', background: 'transparent', cursor: 'pointer' }}><X style={{ width: 16, height: 16, color: '#94A3B8' }} /></button>
                                    </div>
                                    <div style={{ maxHeight: 400, overflow: 'auto' }}>
                                        {notifications.map(n => (
                                            <div key={n.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '20px 28px', borderBottom: '1px solid #FAFAFA', background: !n.read ? 'rgba(255,251,235,0.3)' : 'transparent', cursor: 'pointer', transition: 'background 0.2s' }}>
                                                <div className={dotClr[n.type]} style={{ width: 10, height: 10, borderRadius: 5, marginTop: 6, flexShrink: 0 }} />
                                                <div>
                                                    <p style={{ fontSize: 13, lineHeight: 1.6, fontWeight: !n.read ? 600 : 400, color: !n.read ? '#0F172A' : '#64748B' }}>{n.title}</p>
                                                    <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 6 }}>{n.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <a href="#" style={{ display: 'block', textAlign: 'center', padding: '16px 28px', fontSize: 13, fontWeight: 600, color: '#D97706', borderTop: '1px solid #F1F5F9', textDecoration: 'none', transition: 'background 0.2s' }}>View all notifications</a>
                                </div>
                            )}
                        </div>

                        {/* Profile */}
                        <div className="relative" ref={profileRef}>
                            <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false) }} style={{ width: 40, height: 40, borderRadius: 20, background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', fontSize: 14, fontWeight: 700, color: '#64748B', transition: 'all 0.2s' }}>LB</button>
                            {profileOpen && (
                                <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 12, width: 260, background: 'white', borderRadius: 24, border: '1px solid #F1F5F9', boxShadow: '0 20px 40px -8px rgb(15 23 42 / 0.1)', zIndex: 50, overflow: 'hidden' }} className="animate-pop">
                                    <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9' }}>
                                        <p style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Luke Benefield</p>
                                        <p style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>luke.b@bettereggs.co.nz</p>
                                    </div>
                                    {[{ icon: User, label: 'My Profile' }, { icon: Settings, label: 'Settings' }].map(item => (
                                        <button key={item.label} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '16px 24px', fontSize: 14, color: '#475569', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}>
                                            <item.icon style={{ width: 16, height: 16, color: '#94A3B8' }} />{item.label}
                                        </button>
                                    ))}
                                    <div style={{ borderTop: '1px solid #F1F5F9' }}>
                                        <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '16px 24px', fontSize: 14, color: '#DC2626', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}>
                                            <LogOut style={{ width: 16, height: 16 }} />Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content — VERY generous padding */}
                <main className="flex-1 overflow-y-auto" style={{ padding: '48px 56px' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
