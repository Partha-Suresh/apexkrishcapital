"use client"

import { useEffect, useState } from 'react'
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock,
  DollarSign,
  Layers,
  Loader2,
  ShieldCheck,
  TrendingUp,
  UserRound,
  Users,
  XCircle,
  Activity,
  Building2,
  Phone,
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
  phoneNumber: string | null
  investorStatus: string
  citizenship: string
  verificationStatus: 'pending verification' | 'not verified' | 'verified' | string
  createdAt: string | null
}

type AdminCommitment = {
  id: string
  userId: string
  userName: string
  userEmail: string
  userPhone?: string | null
  investorStatus: string
  citizenship: string
  userVerificationStatus: string
  offeringId: string
  offeringTitle: string
  type: 'interest' | 'commitment'
  amount: number | null
  status: string
  createdAt: string | null
  updatedAt: string | null
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
  const [activeTab, setActiveTab] = useState<'users' | 'commitments'>('users')

  // Users state
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [userError, setUserError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // Commitments state
  const [commitments, setCommitments] = useState<AdminCommitment[]>([])
  const [commitmentStats, setCommitmentStats] = useState({
    totalCommittedCapital: 0,
    totalCommitmentsCount: 0,
    totalInterestsCount: 0,
  })
  const [isLoadingCommitments, setIsLoadingCommitments] = useState(true)
  const [commitmentError, setCommitmentError] = useState<string | null>(null)

  // Fetch Users
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
          setUserError(error instanceof Error ? error.message : 'Unable to load users.')
        }
      } finally {
        if (isActive) setIsLoadingUsers(false)
      }
    }

    loadUsers()
    return () => {
      isActive = false
    }
  }, [])

  // Fetch Commitments
  useEffect(() => {
    let isActive = true

    async function loadCommitments() {
      try {
        const response = await fetch('/api/admin/commitments', { cache: 'no-store' })
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Unable to load commitments.')
        }

        if (isActive) {
          setCommitments(data.commitments || [])
          if (data.stats) {
            setCommitmentStats(data.stats)
          }
        }
      } catch (error) {
        if (isActive) {
          setCommitmentError(error instanceof Error ? error.message : 'Unable to load commitments.')
        }
      } finally {
        if (isActive) setIsLoadingCommitments(false)
      }
    }

    loadCommitments()
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

      // Also update any matching commitments in state
      setCommitments((prev) =>
        prev.map((c) =>
          c.userId === userId ? { ...c, userVerificationStatus: newStatus } : c
        )
      )
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
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Top Header & Tab Navigation */}
        <section className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <ShieldCheck className="size-3.5" />
              Admin Portal
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Syndicate Management
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Manage accredited investor verifications, review capital commitments, and monitor deal interest across active SPVs.
            </p>
          </div>

          {/* Quick Metrics Strip */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-xs">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Users className="size-4" />
              </div>
              <div>
                <p className="text-lg font-semibold leading-none tabular-nums">
                  {isLoadingUsers ? '—' : users.length}
                </p>
                <p className="mt-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Total Users
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-xs">
              <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500 text-white">
                <DollarSign className="size-4" />
              </div>
              <div>
                <p className="text-lg font-semibold leading-none tabular-nums text-emerald-600 dark:text-emerald-400">
                  {isLoadingCommitments ? '—' : `$${commitmentStats.totalCommittedCapital.toLocaleString()}`}
                </p>
                <p className="mt-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Committed Capital
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <button
            onClick={() => setActiveTab('users')}
            className={cn(
              'flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold transition-all cursor-pointer',
              activeTab === 'users'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'bg-muted/60 text-muted-foreground hover:text-foreground'
            )}
          >
            <UserRound className="size-3.5" />
            Investor Directory ({users.length})
          </button>

          <button
            onClick={() => setActiveTab('commitments')}
            className={cn(
              'flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold transition-all cursor-pointer',
              activeTab === 'commitments'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'bg-muted/60 text-muted-foreground hover:text-foreground'
            )}
          >
            <TrendingUp className="size-3.5" />
            Deal Commitments & Interests ({commitments.length})
          </button>
        </div>

        {/* TAB 1: INVESTOR DIRECTORY */}
        {activeTab === 'users' && (
          <section className="overflow-hidden rounded-[24px] border border-border bg-card text-card-foreground shadow-sm">
            <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-sm font-semibold">Registered Investors</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Update verification status to grant or restrict deal participation rights.
                </p>
              </div>
              <UserRound className="size-4 text-muted-foreground" />
            </div>

            {isLoadingUsers ? (
              <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
                <Loader2 className="mb-3 size-5 animate-spin text-muted-foreground" />
                <p className="text-sm font-medium">Loading investors</p>
                <p className="mt-1 text-xs text-muted-foreground">Retrieving registered accounts.</p>
              </div>
            ) : userError ? (
              <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
                <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                  <AlertCircle className="size-5" />
                </div>
                <p className="text-sm font-medium">Could not load users</p>
                <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">{userError}</p>
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
                        <th className="px-6 py-3 font-medium">Phone</th>
                        <th className="px-6 py-3 font-medium">Investor status</th>
                        <th className="px-6 py-3 font-medium">Citizenship</th>
                        <th className="px-6 py-3 font-medium">Verification Status</th>
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
                          <td className="px-6 py-4 text-xs font-mono text-muted-foreground">
                            {user.phoneNumber ? (
                              <span className="inline-flex items-center gap-1.5">
                                <Phone className="size-3 text-muted-foreground/70" />
                                {user.phoneNumber}
                              </span>
                            ) : (
                              '—'
                            )}
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
                          {user.phoneNumber && (
                            <p className="mt-1 flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                              <Phone className="size-3 text-muted-foreground/70" />
                              {user.phoneNumber}
                            </p>
                          )}
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
        )}

        {/* TAB 2: DEAL COMMITMENTS & INTERESTS */}
        {activeTab === 'commitments' && (
          <section className="overflow-hidden rounded-[24px] border border-border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-sm font-semibold">Deal Commitments & Expressed Interest</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Track investor dollar commitments ($5K+ checks) and deal pipeline interest.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                  {commitmentStats.totalCommitmentsCount} Commitments
                </span>
                <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold">
                  {commitmentStats.totalInterestsCount} Interested
                </span>
              </div>
            </div>

            {isLoadingCommitments ? (
              <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
                <Loader2 className="mb-3 size-5 animate-spin text-muted-foreground" />
                <p className="text-sm font-medium">Loading commitments</p>
                <p className="mt-1 text-xs text-muted-foreground">Retrieving investor participation data.</p>
              </div>
            ) : commitmentError ? (
              <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
                <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                  <AlertCircle className="size-5" />
                </div>
                <p className="text-sm font-medium">Could not load commitments</p>
                <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">{commitmentError}</p>
              </div>
            ) : commitments.length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
                <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                  <TrendingUp className="size-5" />
                </div>
                <p className="text-sm font-medium">No commitments recorded yet</p>
                <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
                  When verified investors commit capital or express interest in offerings like Micro1 Inc., their allocations will appear here.
                </p>
              </div>
            ) : (
              <>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[860px] text-left">
                    <thead className="bg-muted/40 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="px-6 py-3 font-medium">Investor</th>
                        <th className="px-6 py-3 font-medium">Offering</th>
                        <th className="px-6 py-3 font-medium">Type</th>
                        <th className="px-6 py-3 font-medium">Committed Amount</th>
                        <th className="px-6 py-3 font-medium">Investor Verification</th>
                        <th className="px-6 py-3 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {commitments.map((item) => (
                        <tr key={item.id} className="transition-colors hover:bg-muted/35">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-[11px] font-semibold text-muted-foreground">
                                {getInitials(item.userName)}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-foreground">{item.userName}</p>
                                <p className="truncate text-xs text-muted-foreground">{item.userEmail}</p>
                                {item.userPhone && (
                                  <p className="mt-0.5 flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
                                    <Phone className="size-2.5" />
                                    {item.userPhone}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span className="font-semibold text-sm text-foreground">
                              {item.offeringTitle}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            {item.type === 'commitment' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                                <DollarSign className="size-3" />
                                Capital Commitment
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                                <Activity className="size-3" />
                                Deal Interest
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-4">
                            {item.amount ? (
                              <span className="text-base font-bold text-foreground font-mono tabular-nums">
                                ${item.amount.toLocaleString()} USD
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground font-mono">—</span>
                            )}
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={cn(
                                'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border',
                                getStatusBadgeClass(item.userVerificationStatus)
                              )}
                            >
                              {item.userVerificationStatus === 'verified' ? (
                                <CheckCircle2 className="size-3" />
                              ) : (
                                <Clock className="size-3" />
                              )}
                              <span className="capitalize">{item.userVerificationStatus}</span>
                            </span>
                          </td>

                          <td className="px-6 py-4 text-sm text-muted-foreground font-mono">
                            {formatDate(item.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="divide-y divide-border md:hidden">
                  {commitments.map((item) => (
                    <article key={item.id} className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-xs font-semibold text-muted-foreground">
                            {getInitials(item.userName)}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-foreground">{item.userName}</p>
                            <p className="text-xs text-muted-foreground">{item.userEmail}</p>
                            {item.userPhone && (
                              <p className="mt-0.5 flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
                                <Phone className="size-2.5" />
                                {item.userPhone}
                              </p>
                            )}
                          </div>
                        </div>

                        {item.type === 'commitment' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
                            Commitment
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-semibold">
                            Interested
                          </span>
                        )}
                      </div>

                      <div className="rounded-xl bg-muted/40 p-3 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{item.offeringTitle}</span>
                        {item.amount ? (
                          <strong className="text-sm font-bold text-foreground font-mono">
                            ${item.amount.toLocaleString()} USD
                          </strong>
                        ) : (
                          <span className="text-muted-foreground">Interest only</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                        <span className="capitalize">Status: {item.userVerificationStatus}</span>
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </section>
        )}
      </div>
    </main>
  )
}

export default AdminPage
