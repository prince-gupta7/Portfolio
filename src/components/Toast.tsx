import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl backdrop-blur-xl transition-all duration-300 transform translate-y-0 border ${
              isSuccess
                ? 'bg-slate-900/95 border-cyan-500/40 text-slate-100 shadow-cyan-500/10'
                : isError
                ? 'bg-slate-900/95 border-rose-500/40 text-slate-100 shadow-rose-500/10'
                : 'bg-slate-900/95 border-blue-500/40 text-slate-100 shadow-blue-500/10'
            }`}
            role="alert"
          >
            <div className="mt-0.5 shrink-0">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-cyan-400" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-blue-400" />}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold tracking-wide text-white">{toast.title}</h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
