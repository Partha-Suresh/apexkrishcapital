"use client"

import { useEffect, useState, useMemo } from 'react'
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
  Search,
  Download,
  Filter,
  Sparkles,
  ArrowUpRight,
  PieChart,
  Briefcase,
  SlidersHorizontal,
  Check,
  ChevronRight,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
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
  status: 'active' | 'wire_received' | 'allocated' | 'cancelled' | string
  notes?: string
  createdAt: string | null
  updatedAt: string | null
}

type OfferingMetric = {
  offeringId: string
  title: string
  companyName: string
  roundName: string
  description: string
  targetAllocation: number
  minCheckSize: number
  valuation: string
  status: 'active' | 'closing_soon' | 'funded' | 'upcoming'
  category: string
  committedCapital: number
  commitmentsCount: number
  interestsCount: number
  wiresReceivedCapital: number
  allocatedCapital: number
  percentFilled: number
  averageCheckSize: number
  isOversubscribed: boolean
  oversubscribedAmount: number
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

function getVerificationBadgeClass(status?: string) {
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

function getCommitmentStatusBadgeClass(status?: string) {
  switch (status) {
    case 'allocated':
      return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30'
    case 'wire_received':
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
    case 'cancelled':
      return 'bg-destructive/10 text-destructive border-destructive/30'
    case 'active':
    default:
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
  }
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'commitments'>('commitments')

  // Users state
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [userError, setUserError] = useState<string | null>(null)
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)
  const [userSearchQuery, setUserSearchQuery] = useState('')

  // Commitments state
  const [commitments, setCommitments] = useState<AdminCommitment[]>([])
  const [offerings, setOfferings] = useState<OfferingMetric[]>([])
  const [commitmentStats, setCommitmentStats] = useState({
    totalCommittedCapital: 0,
    totalCommitmentsCount: 0,
    totalInterestsCount: 0,
    totalWiresReceivedCapital: 0,
    totalAllocatedCapital: 0,
    activeOfferingsCount: 0,
  })
  const [isLoadingCommitments, setIsLoadingCommitments] = useState(true)
  const [commitmentError, setCommitmentError] = useState<string | null>(null)
  const [updatingCommitmentId, setUpdatingCommitmentId] = useState<string | null>(null)

  // Filters
  const [selectedOfferingId, setSelectedOfferingId] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<'all' | 'commitment' | 'interest'>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

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

        if (isActive) setUsers(data.users || [])
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

  // Fetch Commitments & Offerings Metrics
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
          setCommitments(data.allCommitments || data.commitments || [])
          setOfferings(data.offerings || [])
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

  // Handle Investor Verification Status Change
  async function handleVerificationChange(userId: string, newStatus: string) {
    const previousUsers = [...users]

    setUsers((current) =>
      current.map((u) => (u.id === userId ? { ...u, verificationStatus: newStatus } : u))
    )
    setUpdatingUserId(userId)

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

      setCommitments((prev) =>
        prev.map((c) =>
          c.userId === userId ? { ...c, userVerificationStatus: newStatus } : c
        )
      )
    } catch (err) {
      setUsers(previousUsers)
      alert(err instanceof Error ? err.message : 'Failed to update verification status.')
    } finally {
      setUpdatingUserId(null)
    }
  }

  // Handle Commitment Lifecycle Status Change
  async function handleCommitmentStatusChange(commitmentId: string, newStatus: string) {
    const previousCommitments = [...commitments]

    setCommitments((current) =>
      current.map((c) => (c.id === commitmentId ? { ...c, status: newStatus } : c))
    )
    setUpdatingCommitmentId(commitmentId)

    try {
      const response = await fetch('/api/admin/commitments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: commitmentId, status: newStatus }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update commitment status.')
      }
    } catch (err) {
      setCommitments(previousCommitments)
      alert(err instanceof Error ? err.message : 'Failed to update commitment status.')
    } finally {
      setUpdatingCommitmentId(null)
    }
  }

  // Filtered Commitments
  const filteredCommitments = useMemo(() => {
    return commitments.filter((item) => {
      // Offering filter
      if (selectedOfferingId !== 'all' && item.offeringId !== selectedOfferingId) {
        return false
      }
      // Type filter
      if (selectedType !== 'all' && item.type !== selectedType) {
        return false
      }
      // Status filter
      if (selectedStatus !== 'all' && item.status !== selectedStatus) {
        return false
      }
      // Search query filter (name, email, phone, offeringTitle, amount)
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase()
        const nameMatch = item.userName.toLowerCase().includes(query)
        const emailMatch = item.userEmail.toLowerCase().includes(query)
        const phoneMatch = item.userPhone ? item.userPhone.toLowerCase().includes(query) : false
        const offeringMatch = item.offeringTitle.toLowerCase().includes(query)
        const amountMatch = item.amount ? item.amount.toString().includes(query) : false
        if (!nameMatch && !emailMatch && !phoneMatch && !offeringMatch && !amountMatch) {
          return false
        }
      }
      return true
    })
  }, [commitments, selectedOfferingId, selectedType, selectedStatus, searchQuery])

  // Filtered Users
  const filteredUsers = useMemo(() => {
    if (!userSearchQuery.trim()) return users
    const query = userSearchQuery.trim().toLowerCase()
    return users.filter((u) => {
      const nameMatch = u.name.toLowerCase().includes(query)
      const emailMatch = u.email.toLowerCase().includes(query)
      const phoneMatch = u.phoneNumber ? u.phoneNumber.toLowerCase().includes(query) : false
      const statusMatch = u.investorStatus.toLowerCase().includes(query)
      return nameMatch || emailMatch || phoneMatch || statusMatch
    })
  }, [users, userSearchQuery])

  // Export Syndicate CSV Function
  function handleExportCSV() {
    if (filteredCommitments.length === 0) {
      alert('No commitment records available to export.')
      return
    }

    const headers = [
      'Record ID',
      'Created At',
      'Investor Name',
      'Investor Email',
      'Phone Number',
      'Accreditation Level',
      'Citizenship',
      'Verification Status',
      'Offering ID',
      'Offering Title',
      'Participation Type',
      'Committed Amount (USD)',
      'Syndicate Status',
      'Admin Notes',
    ]

    const csvRows = filteredCommitments.map((c) => [
      `"${c.id}"`,
      `"${c.createdAt || ''}"`,
      `"${(c.userName || '').replace(/"/g, '""')}"`,
      `"${(c.userEmail || '').replace(/"/g, '""')}"`,
      `"${(c.userPhone || '').replace(/"/g, '""')}"`,
      `"${(c.investorStatus || '').replace(/"/g, '""')}"`,
      `"${(c.citizenship || '').replace(/"/g, '""')}"`,
      `"${(c.userVerificationStatus || '').replace(/"/g, '""')}"`,
      `"${(c.offeringId || '').replace(/"/g, '""')}"`,
      `"${(c.offeringTitle || '').replace(/"/g, '""')}"`,
      `"${c.type}"`,
      c.amount ? c.amount : 0,
      `"${c.status || 'active'}"`,
      `"${(c.notes || '').replace(/"/g, '""')}"`,
    ])

    const csvContent = [headers.join(','), ...csvRows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute(
      'download',
      `apex-krish-syndicate-roster-${selectedOfferingId}-${new Date().toISOString().slice(0, 10)}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <main className="min-h-screen bg-background px-4 pb-24 pt-[120px] text-foreground md:px-6 md:pt-[150px]">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* TOP HEADER */}
        <section className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1.5 text-[10.5px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              <ShieldCheck className="size-3.5 text-primary" />
              Institutional Syndicate Operations
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Syndicate Portfolio Command
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground leading-relaxed">
              Real-time multi-deal allocation tracking, investor qualification verification, capital commitment pipelines, and legal syndicate closing.
            </p>
          </div>

          {/* GLOBAL PORTFOLIO STRIP */}
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-xs min-w-[140px]">
              <div className="flex items-center gap-2 text-muted-foreground text-[11px] font-mono uppercase tracking-wider">
                <Building2 className="size-3.5 text-primary" />
                Active Deals
              </div>
              <p className="mt-2 text-2xl font-bold font-mono text-foreground tabular-nums">
                {isLoadingCommitments ? '—' : offerings.filter((o) => o.status === 'active').length}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 shadow-xs min-w-[150px]">
              <div className="flex items-center gap-2 text-muted-foreground text-[11px] font-mono uppercase tracking-wider">
                <Users className="size-3.5 text-primary" />
                Total Investors
              </div>
              <p className="mt-2 text-2xl font-bold font-mono text-foreground tabular-nums">
                {isLoadingUsers ? '—' : users.length}
              </p>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-2xl border border-border bg-card p-4 shadow-xs min-w-[190px]">
              <div className="flex items-center gap-2 text-muted-foreground text-[11px] font-mono uppercase tracking-wider">
                <DollarSign className="size-3.5 text-emerald-500" />
                Total Committed
              </div>
              <p className="mt-2 text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                {isLoadingCommitments ? '—' : `$${commitmentStats.totalCommittedCapital.toLocaleString()}`}
              </p>
            </div>
          </div>
        </section>

        {/* PRIMARY TAB CONTROLS */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-3">
          <div className="flex items-center gap-2">
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
              Deal Opportunities & Commitments ({commitments.length})
            </button>

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
          </div>

          {activeTab === 'commitments' && (
            <Button
              onClick={handleExportCSV}
              variant="outline"
              size="sm"
              className="rounded-full text-xs font-medium gap-1.5 h-8.5 px-4 shadow-xs"
            >
              <Download className="size-3.5 text-muted-foreground" />
              <span>Export Syndicate CSV ({filteredCommitments.length})</span>
            </Button>
          )}
        </div>

        {/* TAB 1: DEAL COMMITMENTS & MULTI-OPPORTUNITY PIPELINE */}
        {activeTab === 'commitments' && (
          <div className="space-y-6">
            {/* MULTI-DEAL CAROUSEL / GRID CARDS */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  <PieChart className="size-3.5 text-primary" />
                  Deal Allocation Tracker ({offerings.length} Opportunities)
                </div>
                <span className="text-[11px] text-muted-foreground">
                  Click any deal card to instantly filter allocations
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {offerings.map((deal) => {
                  const isSelected = selectedOfferingId === deal.offeringId
                  return (
                    <div
                      key={deal.offeringId}
                      onClick={() =>
                        setSelectedOfferingId(isSelected ? 'all' : deal.offeringId)
                      }
                      className={cn(
                        'group relative cursor-pointer rounded-2xl border p-4 transition-all duration-200',
                        isSelected
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-md'
                          : 'border-border bg-card hover:border-primary/50 hover:bg-muted/30 shadow-xs'
                      )}
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-border/60 text-xs">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                          {deal.category}
                        </span>
                        <span
                          className={cn(
                            'text-[11px] font-semibold capitalize',
                            deal.status === 'active'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : deal.status === 'funded'
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-amber-600 dark:text-amber-400'
                          )}
                        >
                          {deal.status === 'closing_soon' ? 'Closing Soon' : deal.status}
                        </span>
                      </div>

                      <div className="mt-3">
                        <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                          <span>{deal.title}</span>
                          {isSelected && <Check className="size-4 text-primary" />}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                          Valuation: {deal.valuation} • Min ${deal.minCheckSize.toLocaleString()}
                        </p>
                      </div>

                      {/* Cap Fill Progress Bar */}
                      <div className="mt-4 space-y-1.5 font-mono text-xs">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground">Allocation Filled:</span>
                          <span className="font-bold text-foreground tabular-nums">
                            {deal.percentFilled}%
                          </span>
                        </div>

                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all duration-500',
                              deal.percentFilled >= 100
                                ? 'bg-purple-500'
                                : deal.percentFilled >= 75
                                ? 'bg-emerald-500'
                                : 'bg-primary'
                            )}
                            style={{ width: `${Math.min(100, deal.percentFilled)}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10.5px] text-muted-foreground pt-1">
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            ${deal.committedCapital.toLocaleString()}
                          </span>
                          <span>Cap: ${deal.targetAllocation.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Investor stats */}
                      <div className="mt-3.5 pt-2.5 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                        <span>{deal.commitmentsCount} Checks ($5K+)</span>
                        <span>{deal.interestsCount} Interested</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* FILTER & SEARCH BAR */}
            <section className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                {/* Search input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by investor name, email, phone, offering, or check amount..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background py-2 pl-10 pr-4 text-xs placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Offering Filter */}
                <div className="w-full md:w-[200px]">
                  <Select value={selectedOfferingId} onValueChange={setSelectedOfferingId}>
                    <SelectTrigger className="h-9 rounded-xl border-border text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <Briefcase className="size-3.5 text-muted-foreground" />
                        <SelectValue placeholder="All Deals" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-border bg-popover text-popover-foreground">
                      <SelectItem value="all" className="text-xs">
                        All Deals ({commitments.length})
                      </SelectItem>
                      {offerings.map((o) => (
                        <SelectItem key={o.offeringId} value={o.offeringId} className="text-xs">
                          {o.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Type Filter */}
                <div className="w-full md:w-[170px]">
                  <Select
                    value={selectedType}
                    onValueChange={(val: 'all' | 'commitment' | 'interest') =>
                      setSelectedType(val)
                    }
                  >
                    <SelectTrigger className="h-9 rounded-xl border-border text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <Filter className="size-3.5 text-muted-foreground" />
                        <SelectValue placeholder="All Types" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-border bg-popover text-popover-foreground">
                      <SelectItem value="all" className="text-xs">
                        All Types
                      </SelectItem>
                      <SelectItem value="commitment" className="text-xs">
                        Commitments ($5K+)
                      </SelectItem>
                      <SelectItem value="interest" className="text-xs">
                        Expressed Interest
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div className="w-full md:w-[170px]">
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="h-9 rounded-xl border-border text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <SlidersHorizontal className="size-3.5 text-muted-foreground" />
                        <SelectValue placeholder="All Statuses" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-border bg-popover text-popover-foreground">
                      <SelectItem value="all" className="text-xs">
                        All Statuses
                      </SelectItem>
                      <SelectItem value="active" className="text-xs">
                        Active Commitment
                      </SelectItem>
                      <SelectItem value="wire_received" className="text-xs">
                        Wire Received
                      </SelectItem>
                      <SelectItem value="allocated" className="text-xs">
                        Allocated
                      </SelectItem>
                      <SelectItem value="cancelled" className="text-xs">
                        Cancelled
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active Filter Indicators */}
              {(selectedOfferingId !== 'all' ||
                selectedType !== 'all' ||
                selectedStatus !== 'all' ||
                searchQuery) && (
                <div className="flex items-center gap-2 pt-2 border-t border-border/60 text-xs text-muted-foreground">
                  <span>Filtered to <strong>{filteredCommitments.length}</strong> records</span>
                  <button
                    onClick={() => {
                      setSelectedOfferingId('all')
                      setSelectedType('all')
                      setSelectedStatus('all')
                      setSearchQuery('')
                    }}
                    className="text-primary hover:underline ml-auto font-medium"
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </section>

            {/* COMMITMENTS TABLE */}
            <section className="overflow-hidden rounded-[24px] border border-border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
                <div>
                  <h2 className="text-sm font-semibold">Deal Commitments & Syndicate Roster</h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Review accredited investor commitments, update wire status, and manage allocation records.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                    {filteredCommitments.filter((c) => c.type === 'commitment').length} Commitments
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold">
                    {filteredCommitments.filter((c) => c.type === 'interest').length} Interested
                  </span>
                </div>
              </div>

              {isLoadingCommitments ? (
                <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
                  <Loader2 className="mb-3 size-5 animate-spin text-muted-foreground" />
                  <p className="text-sm font-medium">Loading syndicate records</p>
                  <p className="mt-1 text-xs text-muted-foreground">Retrieving multi-deal allocation data.</p>
                </div>
              ) : commitmentError ? (
                <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
                  <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                    <AlertCircle className="size-5" />
                  </div>
                  <p className="text-sm font-medium">Could not load commitments</p>
                  <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
                    {commitmentError}
                  </p>
                </div>
              ) : filteredCommitments.length === 0 ? (
                <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
                  <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                    <TrendingUp className="size-5" />
                  </div>
                  <p className="text-sm font-medium">No matching commitments found</p>
                  <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
                    Try adjusting your search queries, deal selections, or filter parameters.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedOfferingId('all')
                      setSelectedType('all')
                      setSelectedStatus('all')
                      setSearchQuery('')
                    }}
                    className="mt-4 rounded-full text-xs"
                  >
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <>
                  <div className="hidden overflow-x-auto lg:block">
                    <table className="w-full min-w-[960px] text-left">
                      <thead className="bg-muted/40 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                        <tr>
                          <th className="px-6 py-3 font-medium">Investor</th>
                          <th className="px-6 py-3 font-medium">Offering</th>
                          <th className="px-6 py-3 font-medium">Type</th>
                          <th className="px-6 py-3 font-medium">Committed Check</th>
                          <th className="px-6 py-3 font-medium">Verification</th>
                          <th className="px-6 py-3 font-medium">Syndicate Status</th>
                          <th className="px-6 py-3 font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredCommitments.map((item) => (
                          <tr key={item.id} className="transition-colors hover:bg-muted/35">
                            {/* Investor details */}
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
                                      <Phone className="size-2.5 text-muted-foreground/70" />
                                      {item.userPhone}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Offering */}
                            <td className="px-6 py-4">
                              <span className="font-semibold text-sm text-foreground block">
                                {item.offeringTitle}
                              </span>
                              <span className="text-[10.5px] font-mono text-muted-foreground">
                                ID: {item.offeringId}
                              </span>
                            </td>

                            {/* Type */}
                            <td className="px-6 py-4">
                              {item.type === 'commitment' ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                                  <DollarSign className="size-3" />
                                  Commitment
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                                  <Activity className="size-3" />
                                  Interested
                                </span>
                              )}
                            </td>

                            {/* Amount */}
                            <td className="px-6 py-4">
                              {item.amount ? (
                                <span className="text-base font-bold text-foreground font-mono tabular-nums">
                                  ${item.amount.toLocaleString()} USD
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground font-mono">—</span>
                              )}
                            </td>

                            {/* Verification */}
                            <td className="px-6 py-4">
                              <span
                                className={cn(
                                  'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border',
                                  getVerificationBadgeClass(item.userVerificationStatus)
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

                            {/* Syndicate Lifecycle Status Selector */}
                            <td className="px-6 py-4">
                              <div className="w-[160px]">
                                <Select
                                  value={item.status || 'active'}
                                  onValueChange={(val) => handleCommitmentStatusChange(item.id, val)}
                                  disabled={updatingCommitmentId === item.id}
                                >
                                  <SelectTrigger
                                    className={cn(
                                      'h-8 rounded-full border px-3 text-xs font-medium shadow-none transition-all',
                                      getCommitmentStatusBadgeClass(item.status)
                                    )}
                                  >
                                    <div className="flex items-center gap-1.5 truncate">
                                      {updatingCommitmentId === item.id && (
                                        <Loader2 className="size-3 animate-spin shrink-0" />
                                      )}
                                      <SelectValue />
                                    </div>
                                  </SelectTrigger>
                                  <SelectContent
                                    align="start"
                                    className="rounded-2xl border border-border bg-popover/95 p-1 text-popover-foreground shadow-lg backdrop-blur-xl"
                                  >
                                    <SelectItem value="active" className="rounded-xl py-2 text-xs">
                                      <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                        Active Commitment
                                      </span>
                                    </SelectItem>
                                    <SelectItem value="wire_received" className="rounded-xl py-2 text-xs">
                                      <span className="font-medium text-blue-600 dark:text-blue-400">
                                        Wire Received
                                      </span>
                                    </SelectItem>
                                    <SelectItem value="allocated" className="rounded-xl py-2 text-xs">
                                      <span className="font-medium text-purple-600 dark:text-purple-400">
                                        Allocated / Closed
                                      </span>
                                    </SelectItem>
                                    <SelectItem value="cancelled" className="rounded-xl py-2 text-xs">
                                      <span className="font-medium text-destructive">
                                        Cancelled
                                      </span>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </td>

                            {/* Date */}
                            <td className="px-6 py-4 text-xs text-muted-foreground font-mono">
                              {formatDate(item.createdAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Responsive Mobile / Tablet Card View */}
                  <div className="divide-y divide-border lg:hidden">
                    {filteredCommitments.map((item) => (
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
                          <div>
                            <span className="font-semibold text-foreground block">{item.offeringTitle}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">ID: {item.offeringId}</span>
                          </div>
                          {item.amount ? (
                            <strong className="text-sm font-bold text-foreground font-mono">
                              ${item.amount.toLocaleString()} USD
                            </strong>
                          ) : (
                            <span className="text-muted-foreground">Interest only</span>
                          )}
                        </div>

                        <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
                          <span className="text-xs text-muted-foreground font-medium">Syndicate Status:</span>
                          <div className="w-[160px]">
                            <Select
                              value={item.status || 'active'}
                              onValueChange={(val) => handleCommitmentStatusChange(item.id, val)}
                              disabled={updatingCommitmentId === item.id}
                            >
                              <SelectTrigger
                                className={cn(
                                  'h-8 rounded-full border px-3 text-xs font-medium shadow-none',
                                  getCommitmentStatusBadgeClass(item.status)
                                )}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent align="end" className="rounded-2xl border border-border bg-popover text-popover-foreground">
                                <SelectItem value="active" className="text-xs">Active</SelectItem>
                                <SelectItem value="wire_received" className="text-xs">Wire Received</SelectItem>
                                <SelectItem value="allocated" className="text-xs">Allocated</SelectItem>
                                <SelectItem value="cancelled" className="text-xs">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                          <span className="capitalize">Verification: {item.userVerificationStatus}</span>
                          <span>{formatDate(item.createdAt)}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              )}
            </section>
          </div>
        )}

        {/* TAB 2: INVESTOR DIRECTORY */}
        {activeTab === 'users' && (
          <section className="overflow-hidden rounded-[24px] border border-border bg-card text-card-foreground shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-sm font-semibold">Registered Investors & Accreditation</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Update verification status to grant or restrict deal participation and check commitments.
                </p>
              </div>

              {/* User search input */}
              <div className="relative w-full sm:w-[260px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search investors..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-border bg-background py-1.5 pl-9 pr-3 text-xs placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
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
            ) : filteredUsers.length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
                <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                  <Users className="size-5" />
                </div>
                <p className="text-sm font-medium">No investor accounts found</p>
                <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
                  Try adjusting your search criteria or register a new investor profile.
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
                      {filteredUsers.map((user) => (
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
                                disabled={updatingUserId === user.id}
                              >
                                <SelectTrigger
                                  className={cn(
                                    'h-8 rounded-full border px-3 text-xs font-medium shadow-none transition-all',
                                    getVerificationBadgeClass(user.verificationStatus)
                                  )}
                                >
                                  <div className="flex items-center gap-1.5 truncate">
                                    {updatingUserId === user.id && (
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
                          <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{formatDate(user.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="divide-y divide-border md:hidden">
                  {filteredUsers.map((user) => (
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
                            disabled={updatingUserId === user.id}
                          >
                            <SelectTrigger
                              className={cn(
                                'h-8 rounded-full border px-3 text-xs font-medium shadow-none transition-all',
                                getVerificationBadgeClass(user.verificationStatus)
                              )}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                {updatingUserId === user.id && (
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
      </div>
    </main>
  )
}
