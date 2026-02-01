import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Report from '@/models/Report';
import { validateApiKey, hasPermission } from '@/lib/middleware/apiAuth';

// GET /api/v1/reports - List reports (requires API key)
export async function GET(request: NextRequest) {
  // Validate API key
  const auth = await validateApiKey(request);
  
  if (!auth.success) {
    return NextResponse.json(
      { 
        success: false, 
        error: auth.error,
        code: 'AUTH_ERROR',
      },
      { 
        status: auth.statusCode || 401,
        headers: {
          'X-RateLimit-Limit': '0',
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  // Check permission
  if (!hasPermission(auth.apiKey, 'reports:list')) {
    return NextResponse.json(
      { success: false, error: 'Permission denied: reports:list required' },
      { status: 403 }
    );
  }

  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const category = searchParams.get('category');
    const severity = searchParams.get('severity');
    const status = searchParams.get('status');
    const city = searchParams.get('city');
    const state = searchParams.get('state');
    const fromDate = searchParams.get('from');
    const toDate = searchParams.get('to');

    // Build query
    const query: Record<string, unknown> = {};

    if (category) query.category = category;
    if (severity) query.severity = severity;
    if (status) query.status = status;
    if (city) query['location.city'] = { $regex: city, $options: 'i' };
    if (state) query['location.state'] = { $regex: state, $options: 'i' };
    
    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) (query.createdAt as any).$gte = new Date(fromDate);
      if (toDate) (query.createdAt as any).$lte = new Date(toDate);
    }

    const [total, reports] = await Promise.all([
      Report.countDocuments(query),
      Report.find(query)
        .select('complaintId title description category severity status location createdAt updatedAt')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    // Add rate limit headers
    const headers = {
      'X-RateLimit-Limit-Minute': auth.apiKey.rateLimit.requestsPerMinute.toString(),
      'X-RateLimit-Limit-Day': auth.apiKey.rateLimit.requestsPerDay.toString(),
      'X-RateLimit-Limit-Month': auth.apiKey.rateLimit.requestsPerMonth.toString(),
      'X-RateLimit-Remaining-Minute': Math.max(0, auth.apiKey.rateLimit.requestsPerMinute - auth.apiKey.usage.requestsThisMinute - 1).toString(),
      'X-RateLimit-Remaining-Day': Math.max(0, auth.apiKey.rateLimit.requestsPerDay - auth.apiKey.usage.requestsToday - 1).toString(),
      'X-RateLimit-Remaining-Month': Math.max(0, auth.apiKey.rateLimit.requestsPerMonth - auth.apiKey.usage.requestsThisMonth - 1).toString(),
    };

    return NextResponse.json(
      {
        success: true,
        data: reports,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasMore: page * limit < total,
        },
        meta: {
          apiVersion: 'v1',
          timestamp: new Date().toISOString(),
        },
      },
      { headers }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}