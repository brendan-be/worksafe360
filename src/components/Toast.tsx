import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { CheckCircle2, X, AlertTriangle, Info } from 'lucide-react'

type ToastType = 'success' | 'warning' | 'info'

interface Toast {
    id: string
    message: string
    type: ToastType
}

interface ToastCtx {
    showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastCtx>({ showToast: () => { } })

export const useToast = () => useContext(ToastContext)

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
        setToasts(prev => [...prev, { id, message, type }])
    }, [])

    const dismiss = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    useEffect(() => {
        if (toasts.length === 0) return
        const timer = setTimeout(() => {
            setToasts(prev => prev.slice(1))
        }, 3500)
        return () => clearTimeout(timer)
    }, [toasts])

    const icons = {
        success: <CheckCircle2 style={{ width: 18, height: 18, color: '#10B981', flexShrink: 0 }} />,
        warning: <AlertTriangle style={{ width: 18, height: 18, color: '#F59E0B', flexShrink: 0 }} />,
        info: <Info style={{ width: 18, height: 18, color: '#3B82F6', flexShrink: 0 }} />,
    }

    const bgColors = { success: '#ECFDF5', warning: '#FFFBEB', info: '#EFF6FF' }
    const borderColors = { success: '#A7F3D0', warning: '#FDE68A', info: '#BFDBFE' }

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast container */}
            <div style={{
                position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
                display: 'flex', flexDirection: 'column', gap: 10,
                pointerEvents: 'none',
            }}>
                {toasts.map((toast, i) => (
                    <div
                        key={toast.id}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '14px 20px', borderRadius: 16,
                            background: bgColors[toast.type],
                            border: `1px solid ${borderColors[toast.type]}`,
                            boxShadow: '0 8px 24px -4px rgba(15,23,42,0.08)',
                            animation: 'slideInRight 0.3s ease-out',
                            pointerEvents: 'auto', minWidth: 280, maxWidth: 420,
                        }}
                    >
                        {icons[toast.type]}
                        <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: '#1E293B' }}>{toast.message}</span>
                        <button onClick={() => dismiss(toast.id)} style={{ padding: 4, border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 8 }}>
                            <X style={{ width: 14, height: 14, color: '#94A3B8' }} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}
