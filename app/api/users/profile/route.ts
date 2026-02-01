import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/utils/serverAuth';

export async function PATCH(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, firstName, lastName, phone, address, city, state } = body;

    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          name: name || user.name,
          firstName: firstName || user.firstName,
          lastName: lastName || user.lastName,
          phone: phone ?? user.phone,
          address: address ?? user.address,
          city: city ?? user.city,
          state: state ?? user.state,
        },
      },
      { new: true }
    ).select('-password');

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}