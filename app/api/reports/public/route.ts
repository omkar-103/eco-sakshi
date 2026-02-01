// app/api/reports/public/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Report from '@/models/Report';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const category = searchParams.get('category');
    const severity = searchParams.get('severity');
    const status = searchParams.get('status');

    // Build query - show ALL reports (remove isPublic filter)
    const query: Record<string, unknown> = {};

    // Optional filters
    if (category) query.category = category;
    if (severity) query.severity = severity;
    if (status) query.status = status;

    const total = await Report.countDocuments(query);
    const reports = await Report.find(query)
      .select('complaintId title category severity status location media createdAt viewCount')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: reports,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Public reports error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}