// app/api/admin/subscriptions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Subscription from '@/models/Subscription';
import { getUserFromRequest } from '@/lib/utils/serverAuth';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const plan = searchParams.get('plan');

    const query: Record<string, unknown> = {};

    if (status) query.status = status;
    if (plan) query.plan = plan;

    const [total, subscriptions, activeCount, revenueResult] = await Promise.all([
      Subscription.countDocuments(query),
      Subscription.find(query)
        .populate('userId', 'name email avatar')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Subscription.countDocuments({ status: 'active' }),
      Subscription.aggregate([
        { $match: { status: { $in: ['active', 'cancelled'] } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: subscriptions,
      stats: {
        total: await Subscription.countDocuments(),
        active: activeCount,
        revenue: totalRevenue,
      },
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}