import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-sage-400" />
      </div>
      <h3 className="text-lg font-semibold text-sage-900 mb-2">{title}</h3>
      <p className="text-sage-600 mb-6 max-w-sm mx-auto">{description}</p>
      {actionLabel && (actionHref || onAction) && (
        actionHref ? (
          <Link href={actionHref} className="btn-primary inline-flex">
            {actionLabel}
          </Link>
        ) : (
          <button onClick={onAction} className="btn-primary">
            {actionLabel}
          </button>
        )
      )}
    </div>
  );
}