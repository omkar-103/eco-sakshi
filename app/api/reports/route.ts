import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Report from '@/models/Report';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/utils/serverAuth';
import { generateComplaintId } from '@/lib/utils/helpers';
import { sendReportSubmittedEmail } from '@/lib/email/nodemailer';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      category,
      severity,
      location,
      media,
    } = body;

    // Validation
    if (!title || !description || !category || !severity || !location) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!location.coordinates || location.coordinates.length !== 2) {
      return NextResponse.json(
        { success: false, error: 'Invalid location coordinates' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check subscription limits for free users
    if (user.subscription?.plan === 'free') {
      const currentMonth = new Date();
      currentMonth.setDate(1);
      currentMonth.setHours(0, 0, 0, 0);

      const monthlyReports = await Report.countDocuments({
        userId: user._id,
        createdAt: { $gte: currentMonth },
      });

      if (monthlyReports >= 5) {
        return NextResponse.json(
          {
            success: false,
            error: 'Monthly report limit reached. Upgrade to Premium for unlimited reports.',
          },
          { status: 403 }
        );
      }
    }

    // Generate unique complaint ID
    const complaintId = generateComplaintId();
    const now = new Date();

    // Create report with explicit dates
    const report = await Report.create({
      complaintId,
      userId: user._id,
      title: title.trim(),
      description: description.trim(),
      category,
      severity: severity || 'medium',
      status: 'pending',
      location: {
        type: 'Point',
        coordinates: location.coordinates,
        address: location.address || '',
        city: location.city || '',
        state: location.state || '',
        pincode: location.pincode || '',
      },
      media: media || [],
      statusHistory: [
        {
          status: 'pending',
          changedBy: user._id,
          changedAt: now,
          notes: 'Report submitted',
        },
      ],
      isPublic: false,
      viewCount: 0,
      createdAt: now,
      updatedAt: now,
    });

    // Update user stats
    await User.findByIdAndUpdate(user._id, {
      $inc: {
        'stats.totalReports': 1,
        'stats.pendingReports': 1,
      },
    });

    // Populate user for email
    const populatedReport = await Report.findById(report._id)
      .populate('userId', 'name email')
      .lean();

    // Send confirmation email
    try {
      if (populatedReport) {
        await sendReportSubmittedEmail(
          { 
            ...user, 
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
          } as any,
          { 
            ...populatedReport, 
            _id: populatedReport._id.toString(),
            complaintId: populatedReport.complaintId,
            title: populatedReport.title,
            category: populatedReport.category,
            severity: populatedReport.severity,
            createdAt: populatedReport.createdAt,
          } as any
        );
      }
    } catch (emailError) {
      console.error('Failed to send report submission email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      data: {
        _id: report._id.toString(),
        complaintId: report.complaintId,
        status: report.status,
        createdAt: report.createdAt,
      },
      message: 'Report submitted successfully',
    });
  } catch (error) {
    console.error('Create report error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create report' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const severity = searchParams.get('severity');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query based on role
    const query: Record<string, unknown> = {};

    // Citizens can only see their own reports
    if (user.role === 'citizen') {
      query.userId = user._id;
    }

    // NGOs see only verified/public reports
    if (user.role === 'ngo') {
      query.isPublic = true;
      query.status = { $in: ['verified', 'in-progress', 'resolved'] };
    }

    // Apply filters
    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    if (severity) {
      query.severity = severity;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { complaintId: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Report.countDocuments(query);
    const reports = await Report.find(query)
      .populate('userId', 'name email avatar')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
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
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error('Get reports error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}