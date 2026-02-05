import { X, Check } from 'lucide-react'
import type { INotification } from '../types'

interface NotificationProps {
  notification: INotification
  closeNotification: VoidFunction
}

export function Notification({ notification, closeNotification }: NotificationProps) {
  return (
    <div
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-slide-down"
    >
      <div className="flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl min-w-[320px] bg-gray-900/95 border border-white/15">
        <div className="shrink-0">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-400/15">
            <Check className="w-5 h-5 text-green-400" />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-white text-sm font-medium">{notification.message}</p>
        </div>
        <button
          onClick={closeNotification}
          className="shrink-0 text-gray-400 hover:text-white transition-colors p-1"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
