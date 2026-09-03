import { AlertCircle, CheckCircle2, Info } from 'lucide-react'

const icons = {
  error: AlertCircle,
  info: Info,
  success: CheckCircle2,
}

export default function Notice({ children, variant = 'error' }) {
  const Icon = icons[variant] ?? AlertCircle

  return (
    <div className={`notice notice--${variant}`} role="status" aria-live="polite">
      <Icon size={18} />
      <span>{children}</span>
    </div>
  )
}
