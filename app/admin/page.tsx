import AdminPage from '@/components/AdminPage'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import User from '@/models/user.model'
import { dbConnect } from '@/lib/dbConnect'

export default async function AdminDashboard() {
  const { sessionClaims } = await auth()

  // Protect the page from users who are not admins
  if (sessionClaims?.metadata?.role !== 'admin') {
    redirect('/')
  }

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

  return <AdminPage users={users} />
}
