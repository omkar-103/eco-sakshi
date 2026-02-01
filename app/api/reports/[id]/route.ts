import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Report from '@/models/Report';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/utils/serverAuth';
import { sendStatusUpdateEmail } from '@/lib/email/nodemailer';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { id } = await params;

    await connectDB();

    const report = await Report.findById(id)
      .populate('userId', 'name email avatar')
      .populate('assignedTo', 'name email')
      .populate('statusHistory.changedBy', 'name')
      .populate('authorityResponse.respondedBy', 'name')
      .lean();

    if (!report) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    // Check access
    if (user.role === 'citizen' && report.userId._id.toString() !== user._id.toString()) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    // Increment view count
    await Report.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });

    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('Get report error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch report' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    await connectDB();

    const report = await Report.findById(id);

    if (!report) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    // Check permissions
    const isOwner = report.userId.toString() === user._id.toString();
    const isAuthorityOrAdmin = ['authority', 'admin'].includes(user.role);

    if (!isOwner && !isAuthorityOrAdmin) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    const previousStatus = report.status;
    const updates: Record<string, unknown> = {};

    // Citizens can only update certain fields
    if (user.role === 'citizen') {
      if (body.title) updates.title = body.title;
      if (body.description) updates.description = body.description;
      // Can only update if status is still pending
      if (report.status !== 'pending') {
        return NextResponse.json(
          { success: false, error: 'Cannot modify report after review has started' },
          { status: 400 }
        );
      }
    }

    // Authority/Admin can update status and add responses
    if (isAuthorityOrAdmin) {
      if (body.status) {
        updates.status = body.status;
        updates.$push = {
          statusHistory: {
            status: body.status,
            changedBy: user._id,
            changedAt: new Date(),
            notes: body.statusNotes || undefined,
          },
        };
      }

      if (body.verificationNotes) {
        updates.verificationNotes = body.verificationNotes;
      }

      if (body.assignedTo) {
        updates.assignedTo = body.assignedTo;
      }

      if (body.isPublic !== undefined) {
        updates.isPublic = body.isPublic;
      }

      if (body.authorityResponse) {
        updates.authorityResponse = {
          message: body.authorityResponse.message,
          actionTaken: body.authorityResponse.actionTaken,
          media: body.authorityResponse.media || [],
          respondedAt: new Date(),
          respondedBy: user._id,
        };
      }
    }

    const updatedReport = await Report.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    ).populate('userId', 'name email');

    // Update user stats if status changed
    if (body.status && body.status !== previousStatus) {
      const reportOwner = await User.findById(report.userId);

      if (reportOwner) {
        const statUpdates: Record<string, number> = {};

        // Decrement old status counter
        if (previousStatus === 'pending') {
          statUpdates['stats.pendingReports'] = -1;
        } else if (previousStatus === 'resolved') {
          statUpdates['stats.resolvedReports'] = -1;
        }

        // Increment new status counter
        if (body.status === 'pending') {
          statUpdates['stats.pendingReports'] = (statUpdates['stats.pendingReports'] || 0) + 1;
        } else if (body.status === 'resolved') {
          statUpdates['stats.resolvedReports'] = (statUpdates['stats.resolvedReports'] || 0) + 1;
        }

        if (Object.keys(statUpdates).length > 0) {
          await User.findByIdAndUpdate(report.userId, { $inc: statUpdates });
        }
      }

      // Send status update email
      try {
        const reportOwnerData = updatedReport!.userId as any;
        await sendStatusUpdateEmail(
          {
            _id: reportOwnerData._id.toString(),
            email: reportOwnerData.email,
            name: reportOwnerData.name,
          } as any,
          {
            ...updatedReport!.toObject(),
            _id: updatedReport!._id.toString(),
          } as any,
          previousStatus,
          body.statusNotes
        );
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      data: updatedReport,
      message: 'Report updated successfully',
    });
  } catch (error) {
    console.error('Update report error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update report' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { id } = await params;

    await connectDB();

    const report = await Report.findById(id);

    if (!report) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    // Only owner can delete, and only if pending
    const isOwner = report.userId.toString() === user._id.toString();
    const isAdmin = user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    if (isOwner && report.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: 'Cannot delete report after review has started' },
        { status: 400 }
      );
    }

    await Report.findByIdAndDelete(id);

    // Update user stats
    await User.findByIdAndUpdate(report.userId, {
      $inc: {
        'stats.totalReports': -1,
        'stats.pendingReports': report.status === 'pending' ? -1 : 0,
        'stats.resolvedReports': report.status === 'resolved' ? -1 : 0,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Report deleted successfully',
    });
  } catch (error) {
    console.error('Delete report error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete report' },
      { status: 500 }
    );
  }
}