import { NextResponse } from 'next/server';
import { SUBSCRIPTION_PLANS } from '@/lib/utils/constants';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: SUBSCRIPTION_PLANS,
  });
}