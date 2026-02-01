'use client';

import { AlertTriangle, Loader2 } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'default';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: 'bg-red-100',
      iconColor: 'text-red-600',
      button: 'bg-red-600 hover:bg-red-700',
    },
    warning: {
      icon: 'bg-amber-100',
      iconColor: 'text-amber-600',
      button: 'bg-amber-600 hover:bg-amber-700',
    },
    default: {
      icon: 'bg-forest-100',
      iconColor: 'text-forest-600',
      button: 'bg-forest-600 hover:bg-forest-700',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-scale-in">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 rounded-full ${styles.icon} flex items-center justify-center`}>
            <AlertTriangle className={`w-6 h-6 ${styles.iconColor}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-sage-900">{title}</h3>
          </div>
        </div>

        <p className="text-sage-700 mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-3 rounded-xl border-2 border-sage-200 text-sage-700 font-medium hover:bg-sage-50 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-3 rounded-xl text-white font-medium ${styles.button} disabled:opacity-50`}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}