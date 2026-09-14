import AdminPage from '@/components/AdminPage'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
  const { sessionClaims } = await auth()

  // Protect the page from users who are not admins
  if (sessionClaims?.metadata?.role !== 'admin') {
    redirect('/')
  }

  return <AdminPage />
}
