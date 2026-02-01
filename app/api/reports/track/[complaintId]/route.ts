import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Report from '@/models/Report';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ complaintId: string }> }
) {
  try {
    const { complaintId } = await params;

    await connectDB();

    const report = await Report.findOne({ complaintId })
      .select('complaintId title category severity status statusHistory createdAt updatedAt authorityResponse')
      .populate('statusHistory.changedBy', 'name')
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
    });
  } catch (error) {
    console.error('Track report error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track report' },
      { status: 500 }
    );
  }
}