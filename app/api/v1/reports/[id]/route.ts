import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Report from '@/models/Report';
import { validateApiKey, hasPermission } from '@/lib/middleware/apiAuth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await validateApiKey(request);
  
  if (!auth.success) {
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: auth.statusCode || 401 }
    );
  }

  if (!hasPermission(auth.apiKey, 'reports:read')) {
    return NextResponse.json(
      { success: false, error: 'Permission denied: reports:read required' },
      { status: 403 }
    );
  }

  try {
    const { id } = await params;
    
    await connectDB();

    const report = await Report.findById(id)
      .select('-userId')
      .lean();

    if (!report) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: report,
      meta: {
        apiVersion: 'v1',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}