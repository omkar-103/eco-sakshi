import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Report from '@/models/Report';
import { getUserFromRequest } from '@/lib/utils/serverAuth';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user || !['ngo', 'admin'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format') || 'csv';
    const dateRange = searchParams.get('dateRange') || 'all';
    const category = searchParams.get('category');
    const severity = searchParams.get('severity');

    await connectDB();

    // Build query
    const query: Record<string, unknown> = {
      isPublic: true,
      status: { $in: ['verified', 'in-progress', 'resolved'] },
    };

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      let startDate: Date;

      switch (dateRange) {
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'quarter':
          startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(0);
      }

      query.createdAt = { $gte: startDate };
    }

    if (category) query.category = category;
    if (severity) query.severity = severity;

    const reports = await Report.find(query)
      .select('complaintId title description category severity status location createdAt updatedAt')
      .sort({ createdAt: -1 })
      .lean();

    if (format === 'json') {
      return NextResponse.json(reports, {
        headers: {
          'Content-Disposition': `attachment; filename="environmental-data.json"`,
        },
      });
    }

    // CSV format
    const csvHeaders = [
      'Complaint ID',
      'Title',
      'Category',
      'Severity',
      'Status',
      'City',
      'State',
      'Latitude',
      'Longitude',
      'Created At',
    ];

    const csvRows = reports.map((report: any) => [
      report.complaintId,
      `"${(report.title || '').replace(/"/g, '""')}"`,
      report.category,
      report.severity,
      report.status,
      report.location?.city || '',
      report.location?.state || '',
      report.location?.coordinates?.[1] || '',
      report.location?.coordinates?.[0] || '',
      new Date(report.createdAt).toISOString(),
    ]);

    const csvContent = [csvHeaders.join(','), ...csvRows.map((row) => row.join(','))].join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="environmental-data.csv"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { success: false, error: 'Export failed' },
      { status: 500 }
    );
  }
}