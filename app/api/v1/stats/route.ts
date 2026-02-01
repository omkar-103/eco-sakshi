import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Report from '@/models/Report';
import { validateApiKey, hasPermission } from '@/lib/middleware/apiAuth';

export async function GET(request: NextRequest) {
  const auth = await validateApiKey(request);
  
  if (!auth.success) {
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: auth.statusCode || 401 }
    );
  }

  if (!hasPermission(auth.apiKey, 'reports:stats')) {
    return NextResponse.json(
      { success: false, error: 'Permission denied: reports:stats required' },
      { status: 403 }
    );
  }

  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const state = searchParams.get('state');
    const city = searchParams.get('city');

    const matchQuery: Record<string, unknown> = {};
    if (state) matchQuery['location.state'] = { $regex: state, $options: 'i' };
    if (city) matchQuery['location.city'] = { $regex: city, $options: 'i' };

    const [
      totalReports,
      byStatus,
      byCategory,
      bySeverity,
      byMonth,
    ] = await Promise.all([
      Report.countDocuments(matchQuery),
      Report.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Report.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Report.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$severity', count: { $sum: 1 } } },
      ]),
      Report.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 },
      ]),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        total: totalReports,
        byStatus: byStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {} as Record<string, number>),
        byCategory: byCategory.map(item => ({
          category: item._id,
          count: item.count,
        })),
        bySeverity: bySeverity.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {} as Record<string, number>),
        trend: byMonth.map(item => ({
          year: item._id.year,
          month: item._id.month,
          count: item.count,
        })),
      },
      meta: {
        apiVersion: 'v1',
        timestamp: new Date().toISOString(),
        filters: { state, city },
      },
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}