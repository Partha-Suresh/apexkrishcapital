import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
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
      .select('name firstName middleName lastName email investorStatus citizenship createdAt')
      .sort({ createdAt: -1 })
      .lean()

    const users = records.map((user) => {
      const name =
        user.name?.trim() ||
        [user.firstName, user.middleName, user.lastName]
          .filter(Boolean)
          .join(' ') ||
        user.email.split('@')[0]

      return {
        id: user._id.toString(),
        name,
        email: user.email,
        investorStatus: user.investorStatus || 'Not Accredited',
        citizenship: user.citizenship || 'US',
        createdAt: user.createdAt?.toISOString() || null,
      }
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Failed to fetch admin users:', error)
    return NextResponse.json({ error: 'Unable to fetch users' }, { status: 500 })
  }
}
