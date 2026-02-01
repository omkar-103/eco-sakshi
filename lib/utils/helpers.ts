import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | undefined | null): string {
  if (!date) return 'N/A';
  
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'N/A';
    
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(d);
  } catch {
    return 'N/A';
  }
}

export function formatDateTime(date: Date | string | undefined | null): string {
  if (!date) return 'N/A';
  
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'N/A';
    
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return 'N/A';
  }
}

export function formatRelativeTime(date: Date | string | undefined | null): string {
  if (!date) return 'N/A';
  
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'N/A';
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }

    if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks}w ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths}mo ago`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears}y ago`;
  } catch {
    return 'N/A';
  }
}

export function generateComplaintId(): string {
  const prefix = 'ECN';
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `${prefix}-${year}-${random}`;
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    'air-pollution': 'Air Pollution',
    'water-pollution': 'Water Pollution',
    'waste-dumping': 'Waste Dumping',
    'noise-pollution': 'Noise Pollution',
    'industrial-violation': 'Industrial Violation',
    'deforestation': 'Deforestation',
    'wildlife': 'Wildlife Issue',
    'other': 'Other',
  };
  return labels[category] || category;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    'pending': 'Pending',
    'verified': 'Verified',
    'under-review': 'Under Review',
    'in-progress': 'In Progress',
    'resolved': 'Resolved',
    'rejected': 'Rejected',
  };
  return labels[status] || status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'pending': 'bg-amber-100 text-amber-700',
    'verified': 'bg-blue-100 text-blue-700',
    'under-review': 'bg-purple-100 text-purple-700',
    'in-progress': 'bg-indigo-100 text-indigo-700',
    'resolved': 'bg-green-100 text-green-700',
    'rejected': 'bg-red-100 text-red-700',
  };
  return colors[status] || 'bg-sage-100 text-sage-700';
}

export function getSeverityColor(severity: string): string {
  const colors: Record<string, string> = {
    'low': 'bg-green-100 text-green-700 border-green-200',
    'medium': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'high': 'bg-orange-100 text-orange-700 border-orange-200',
    'critical': 'bg-red-100 text-red-700 border-red-200',
  };
  return colors[severity] || 'bg-sage-100 text-sage-700 border-sage-200';
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function formatCurrency(amount: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[+]?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function capitalizeFirst(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function slugify(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}