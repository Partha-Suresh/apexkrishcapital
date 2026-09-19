"use client"

import { useEffect, useState } from 'react'
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock,
  Loader2,
  ShieldCheck,
  UserRound,
  Users,
  XCircle,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

type AdminUser = {
  id: string
  name: string
  email: string
  investorStatus: string
  citizenship: string
  verificationStatus: 'pending verification' | 'not verified' | 'verified' | string
  createdAt: string | null
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function formatDate(date: string | null) {
  if (!date) return '—'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

function getStatusBadgeClass(status?: string) {
  switch (status) {
    case 'verified':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:border-emerald-500/50'
    case 'not verified':
      return 'bg-destructive/10 text-destructive border-destructive/30 hover:border-destructive/50'
    case 'pending verification':
    case 'yet to be verified':
    default:
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:border-amber-500/50'
  }
}

const AdminPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    async function loadUsers() {
      try {
        const response = await fetch('/api/admin/users', { cache: 'no-store' })
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Unable to load users.')
        }

        if (isActive) setUsers(data.users)
      } catch (error) {
        if (isActive) {
          setError(error instanceof Error ? error.message : 'Unable to load users.')
        }
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    loadUsers()
    return () => {
      isActive = false
    }
  }, [])

  async function handleVerificationChange(userId: string, newStatus: string) {
    const previousUsers = [...users]

    // Optimistically update UI
    setUsers((current) =>
      current.map((u) => (u.id === userId ? { ...u, verificationStatus: newStatus } : u))
    )
    setUpdatingId(userId)

    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, verificationStatus: newStatus }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update verification status.')
      }
    } catch (err) {
      // Rollback on error
      setUsers(previousUsers)
      alert(err instanceof Error ? err.message : 'Failed to update verification status.')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 pb-20 pt-[120px] text-foreground md:px-6 md:pt-[160px]">
      <div className="mx-auto max-w-6xl">
        <section className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <ShieldCheck className="size-3.5" />
              Admin dashboard
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Investor directory
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Registered investor accounts. Verify investor accounts and manage access permissions.
            </p>
          </div>

          <div className="inline-flex items-center gap-3 self-start rounded-2xl border border-border bg-card px-4 py-3 shadow-sm sm:self-auto">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Users className="size-4" />
            </div>
            <div>
              <p className="text-xl font-semibold leading-none tabular-nums">{isLoading ? '—' : users.length}</p>
              <p className="mt-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Total users
              </p>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[24px] border border-border bg-card text-card-foreground shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-sm font-semibold">All users</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">Newest registrations first</p>
            </div>
            <UserRound className="size-4 text-muted-foreground" />
          </div>

          {isLoading ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
              <Loader2 className="mb-3 size-5 animate-spin text-muted-foreground" />
              <p className="text-sm font-medium">Loading users</p>
              <p className="mt-1 text-xs text-muted-foreground">Retrieving registered investor accounts.</p>
            </div>
          ) : error ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                <AlertCircle className="size-5" />
              </div>
              <p className="text-sm font-medium">Could not load users</p>
              <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">{error}</p>
            </div>
          ) : users.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <Users className="size-5" />
              </div>
              <p className="text-sm font-medium">No investor accounts yet</p>
              <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
                New non-admin accounts will appear here after they are registered.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[860px] text-left">
                  <thead className="bg-muted/40 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-6 py-3 font-medium">User</th>
                      <th className="px-6 py-3 font-medium">Investor status</th>
                      <th className="px-6 py-3 font-medium">Citizenship</th>
                      <th className="px-6 py-3 font-medium">Verification</th>
                      <th className="px-6 py-3 font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users.map((user) => (
                      <tr key={user.id} className="transition-colors hover:bg-muted/35">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-[11px] font-semibold text-muted-foreground">
                              {getInitials(user.name)}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
                              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full border border-border bg-muted/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                            {user.investorStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{user.citizenship}</td>
                        <td className="px-6 py-4">
                          <div className="w-[185px]">
                            <Select
                              value={
                                !user.verificationStatus || user.verificationStatus === 'yet to be verified'
                                  ? 'pending verification'
                                  : user.verificationStatus
                              }
                              onValueChange={(val) => handleVerificationChange(user.id, val)}
                              disabled={updatingId === user.id}
                            >
                              <SelectTrigger
                                className={cn(
                                  'h-8 rounded-full border px-3 text-xs font-medium shadow-none transition-all',
                                  getStatusBadgeClass(user.verificationStatus)
                                )}
                              >
                                <div className="flex items-center gap-1.5 truncate">
                                  {updatingId === user.id && (
                                    <Loader2 className="size-3 animate-spin shrink-0" />
                                  )}
                                  <SelectValue />
                                </div>
                              </SelectTrigger>
                              <SelectContent align="start" className="rounded-2xl border border-border bg-popover/95 p-1 text-popover-foreground shadow-lg backdrop-blur-xl">
                                <SelectItem value="verified" className="rounded-xl py-2 text-xs">
                                  <div className="flex items-center gap-2">
                                    <CheckCircle2 className="size-3.5 text-emerald-500" />
                                    <span className="font-medium text-foreground">Verified</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="pending verification" className="rounded-xl py-2 text-xs">
                                  <div className="flex items-center gap-2">
                                    <Clock className="size-3.5 text-amber-500" />
                                    <span className="font-medium text-foreground">Pending verification</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="not verified" className="rounded-xl py-2 text-xs">
                                  <div className="flex items-center gap-2">
                                    <XCircle className="size-3.5 text-destructive" />
                                    <span className="font-medium text-foreground">Not verified</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{formatDate(user.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-border md:hidden">
                {users.map((user) => (
                  <article key={user.id} className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-xs font-semibold text-muted-foreground">
                        {getInitials(user.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{user.name}</p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="rounded-full border border-border bg-muted/60 px-2.5 py-1 text-muted-foreground">
                        {user.investorStatus}
                      </span>
                      <span className="rounded-full border border-border px-2.5 py-1 text-muted-foreground">
                        {user.citizenship}
                      </span>
                      <span className="ml-auto inline-flex items-center gap-1 text-muted-foreground">
                        <CalendarDays className="size-3" />
                        {formatDate(user.createdAt)}
                      </span>
                    </div>

                    <div className="mt-3.5 pt-3 border-t border-border flex items-center justify-between gap-3">
                      <span className="text-xs text-muted-foreground font-medium">Status:</span>
                      <div className="w-[185px]">
                        <Select
                          value={
                            !user.verificationStatus || user.verificationStatus === 'yet to be verified'
                              ? 'pending verification'
                              : user.verificationStatus
                          }
                          onValueChange={(val) => handleVerificationChange(user.id, val)}
                          disabled={updatingId === user.id}
                        >
                          <SelectTrigger
                            className={cn(
                              'h-8 rounded-full border px-3 text-xs font-medium shadow-none transition-all',
                              getStatusBadgeClass(user.verificationStatus)
                            )}
                          >
                            <div className="flex items-center gap-1.5 truncate">
                              {updatingId === user.id && (
                                <Loader2 className="size-3 animate-spin shrink-0" />
                              )}
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent align="end" className="rounded-2xl border border-border bg-popover/95 p-1 text-popover-foreground shadow-lg backdrop-blur-xl">
                            <SelectItem value="verified" className="rounded-xl py-2 text-xs">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="size-3.5 text-emerald-500" />
                                <span className="font-medium text-foreground">Verified</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="pending verification" className="rounded-xl py-2 text-xs">
                              <div className="flex items-center gap-2">
                                <Clock className="size-3.5 text-amber-500" />
                                <span className="font-medium text-foreground">Pending verification</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="not verified" className="rounded-xl py-2 text-xs">
                              <div className="flex items-center gap-2">
                                <XCircle className="size-3.5 text-destructive" />
                                <span className="font-medium text-foreground">Not verified</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  )
}

export default AdminPage
