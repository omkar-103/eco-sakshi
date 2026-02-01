import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Report from '@/models/Report';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/utils/serverAuth';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { action, reportIds } = await request.json();

    if (!action || !Array.isArray(reportIds)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request' },
        { status: 400 }
      );
    }

    await connectDB();

    let result;

    switch (action) {
      case 'verify':
        result = await Report.updateMany(
          { _id: { $in: reportIds } },
          {
            $set: { status: 'verified', isPublic: true },
            $push: {
              statusHistory: {
                status: 'verified',
                changedBy: user._id,
                changedAt: new Date(),
                notes: 'Bulk verified by admin',
              },
            },
          }
        );
        break;

      case 'resolve':
        result = await Report.updateMany(
          { _id: { $in: reportIds } },
          {
            $set: { status: 'resolved' },
            $push: {
              statusHistory: {
                status: 'resolved',
                changedBy: user._id,
                changedAt: new Date(),
                notes: 'Bulk resolved by admin',
              },
            },
          }
        );
        break;

      case 'reject':
        result = await Report.updateMany(
          { _id: { $in: reportIds } },
          {
            $set: { status: 'rejected' },
            $push: {
              statusHistory: {
                status: 'rejected',
                changedBy: user._id,
                changedAt: new Date(),
                notes: 'Bulk rejected by admin',
              },
            },
          }
        );
        break;

      case 'delete': {
        const reports = await Report.find({ _id: { $in: reportIds } });

        for (const report of reports) {
          await User.findByIdAndUpdate(report.userId, {
            $inc: {
              'stats.totalReports': -1,
              'stats.pendingReports': report.status === 'pending' ? -1 : 0,
              'stats.resolvedReports': report.status === 'resolved' ? -1 : 0,
            },
          });
        }

        result = await Report.deleteMany({ _id: { $in: reportIds } });
        break;
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

    const affectedCount =
      'modifiedCount' in result
        ? result.modifiedCount
        : result.deletedCount;

    return NextResponse.json({
      success: true,
      message: `${affectedCount} reports updated`,
    });
  } catch (error) {
    console.error('Bulk action error:', error);
    return NextResponse.json(
      { success: false, error: 'Bulk action failed' },
      { status: 500 }
    );
  }
}
