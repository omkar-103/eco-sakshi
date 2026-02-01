import { useState, useCallback } from 'react';
import { Report, PaginatedResponse } from '@/types';
import toast from 'react-hot-toast';

interface UseReportsOptions {
  initialPage?: number;
  limit?: number;
}

interface ReportFilters {
  status?: string;
  category?: string;
  severity?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function useReports(options: UseReportsOptions = {}) {
  const { initialPage = 1, limit = 10 } = options;

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: initialPage,
    limit,
    totalPages: 0,
    hasMore: false,
  });

  const fetchReports = useCallback(
    async (page: number = 1, filters: ReportFilters = {}) => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        if (filters.status) params.append('status', filters.status);
        if (filters.category) params.append('category', filters.category);
        if (filters.severity) params.append('severity', filters.severity);
        if (filters.search) params.append('search', filters.search);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

        const response = await fetch(`/api/reports?${params}`, {
          credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch reports');
        }

        setReports(data.data);
        setPagination(data.pagination);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch reports';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  const createReport = useCallback(async (reportData: Partial<Report>) => {
    try {
      setLoading(true);

      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(reportData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create report');
      }

      toast.success('Report submitted successfully!');
      return data.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create report';
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateReport = useCallback(async (id: string, updates: Partial<Report>) => {
    try {
      setLoading(true);

      const response = await fetch(`/api/reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update report');
      }

      toast.success('Report updated successfully!');
      return data.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update report';
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteReport = useCallback(async (id: string) => {
    try {
      setLoading(true);

      const response = await fetch(`/api/reports/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete report');
      }

      toast.success('Report deleted successfully!');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete report';
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    reports,
    loading,
    error,
    pagination,
    fetchReports,
    createReport,
    updateReport,
    deleteReport,
  };
}