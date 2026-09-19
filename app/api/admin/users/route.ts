import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/dbConnect'
import User from '@/models/user.model'

export async function GET() {
  const { userId, sessionClaims } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (sessionClaims?.metadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    await dbConnect()

    const records = await User.find({ role: { $ne: 'admin' } })
      .select('name firstName middleName lastName email investorStatus citizenship verificationStatus createdAt')
      .sort({ createdAt: -1 })
      .lean()

    const users = records.map((user) => {
      const name =
        user.name?.trim() ||
        [user.firstName, user.middleName, user.lastName]
          .filter(Boolean)
          .join(' ') ||
        user.email.split('@')[0]

      const rawStatus = user.verificationStatus
      const verificationStatus =
        !rawStatus || rawStatus === 'yet to be verified' ? 'pending verification' : rawStatus

      return {
        id: user._id.toString(),
        name,
        email: user.email,
        investorStatus: user.investorStatus || 'Not Accredited',
        citizenship: user.citizenship || 'US',
        verificationStatus,
        createdAt: user.createdAt?.toISOString() || null,
      }
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Failed to fetch admin users:', error)
    return NextResponse.json({ error: 'Unable to fetch users' }, { status: 500 })
  }
}

const ALLOWED_VERIFICATION_STATUSES = [
  'pending verification',
  'verified',
  'not verified',
]

export async function PATCH(req: NextRequest) {
  const { userId: authUserId, sessionClaims } = await auth()

  if (!authUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (sessionClaims?.metadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { userId, verificationStatus } = body

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (!verificationStatus || !ALLOWED_VERIFICATION_STATUSES.includes(verificationStatus)) {
      return NextResponse.json(
        {
          error: `Invalid verification status. Must be one of: ${ALLOWED_VERIFICATION_STATUSES.join(', ')}`,
        },
        { status: 400 }
      )
    }

    await dbConnect()

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { verificationStatus },
      { new: true }
    ).select('verificationStatus')

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser._id.toString(),
        verificationStatus: updatedUser.verificationStatus,
      },
    })
  } catch (error) {
    console.error('Failed to update verification status:', error)
    return NextResponse.json({ error: 'Unable to update verification status' }, { status: 500 })
  }
}

