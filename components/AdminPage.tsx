"use client"

import { useEffect, useState, useMemo } from 'react'
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock,
  DollarSign,
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
  Briefcase,
  SlidersHorizontal,
  Check,
  Send,
  MessageSquare,
  ExternalLink,
  Copy,
  CheckCheck,
  Mail,
  Link2,
  X,
  Radio,
  Archive,
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
  status: 'active' | 'closing_soon' | 'funded' | 'upcoming' | string
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

type BroadcastPreviewRecipient = {
  userId: string
  userName: string
  userEmail: string
  userPhone?: string | null
  hasValidPhone: boolean
  type: 'commitment' | 'interest'
  amount?: number | null
}

type WhatsAppRosterItem = {
  userName: string
  userEmail: string
  userPhone: string | null
  whatsAppLink: string | null
  emailStatus: string
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
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
    case 'not verified':
      return 'bg-destructive/10 text-destructive border-destructive/30'
    case 'pending verification':
    case 'yet to be verified':
    default:
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
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
  const [activeTab, setActiveTab] = useState<'commitments' | 'users'>('commitments')

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

  // Deal Cards Filter: All vs Active vs Closed
  const [dealFilter, setDealFilter] = useState<'all' | 'active' | 'closed'>('all')

  // Commitments Table Filters
  const [selectedOfferingId, setSelectedOfferingId] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<'all' | 'commitment' | 'interest'>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Broadcast Modal State
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false)
  const [broadcastOffering, setBroadcastOffering] = useState<OfferingMetric | null>(null)
  const [broadcastAudience, setBroadcastAudience] = useState<'all_verified' | 'commitments_only' | 'interests_only'>('all_verified')
  const [thirdPartyUrl, setThirdPartyUrl] = useState('')
  const [broadcastSubject, setBroadcastSubject] = useState('')
  const [customMessage, setCustomMessage] = useState('')
  const [sendEmail, setSendEmail] = useState(true)
  const [sendWhatsApp, setSendWhatsApp] = useState(true)
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  const [previewRecipients, setPreviewRecipients] = useState<BroadcastPreviewRecipient[]>([])
  const [isSendingBroadcast, setIsSendingBroadcast] = useState(false)
  const [broadcastResult, setBroadcastResult] = useState<{
    success: boolean
    message: string
    emailsSent: number
    whatsappProcessed: number
    whatsappRoster: WhatsAppRosterItem[]
  } | null>(null)

  // Fetch Users
  useEffect(() => {
    let isActive = true
    async function loadUsers() {
      try {
        const response = await fetch('/api/admin/users', { cache: 'no-store' })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Unable to load users.')
        if (isActive) setUsers(data.users || [])
      } catch (error) {
        if (isActive) setUserError(error instanceof Error ? error.message : 'Unable to load users.')
      } finally {
        if (isActive) setIsLoadingUsers(false)
      }
    }
    loadUsers()
    return () => { isActive = false }
  }, [])

  // Fetch Commitments & Offerings
  useEffect(() => {
    let isActive = true
    async function loadCommitments() {
      try {
        const response = await fetch('/api/admin/commitments', { cache: 'no-store' })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Unable to load commitments.')
        if (isActive) {
          setCommitments(data.allCommitments || data.commitments || [])
          setOfferings(data.offerings || [])
          if (data.stats) setCommitmentStats(data.stats)
        }
      } catch (error) {
        if (isActive) setCommitmentError(error instanceof Error ? error.message : 'Unable to load commitments.')
      } finally {
        if (isActive) setIsLoadingCommitments(false)
      }
    }
    loadCommitments()
    return () => { isActive = false }
  }, [])

  // Active vs Closed Counts
  const activeDealsCount = useMemo(() => {
    return offerings.filter((d) => d.status === 'active' || d.status === 'closing_soon').length
  }, [offerings])

  const closedDealsCount = useMemo(() => {
    return offerings.filter((d) => d.status === 'funded' || d.status === 'archived' || d.status === 'closed').length
  }, [offerings])

  // Filtered Offerings by active/closed pill
  const displayedOfferings = useMemo(() => {
    if (dealFilter === 'active') {
      return offerings.filter((d) => d.status === 'active' || d.status === 'closing_soon')
    }
    if (dealFilter === 'closed') {
      return offerings.filter((d) => d.status === 'funded' || d.status === 'archived' || d.status === 'closed')
    }
    return offerings
  }, [offerings, dealFilter])

  // Open Broadcast Modal
  async function handleOpenBroadcastModal(offering: OfferingMetric) {
    setBroadcastOffering(offering)
    setBroadcastResult(null)
    setIsBroadcastModalOpen(true)
    setBroadcastSubject(`Priority Access: ${offering.title} SPV Portal`)
    setCustomMessage('')
    setIsPreviewLoading(true)

    try {
      const linkRes = await fetch(`/api/admin/offerings/${offering.offeringId}/link`, { cache: 'no-store' })
      const linkData = await linkRes.json()
      if (linkRes.ok && linkData.thirdPartyUrl) {
        setThirdPartyUrl(linkData.thirdPartyUrl)
      } else {
        setThirdPartyUrl('')
      }
      await fetchBroadcastPreview(offering.offeringId, broadcastAudience)
    } catch (err) {
      console.error('Error opening broadcast modal:', err)
    } finally {
      setIsPreviewLoading(false)
    }
  }

  // Fetch preview when audience changes
  async function fetchBroadcastPreview(offeringId: string, audience: string) {
    setIsPreviewLoading(true)
    try {
      const res = await fetch(`/api/admin/broadcast?offeringId=${offeringId}&audience=${audience}`, { cache: 'no-store' })
      const data = await res.json()
      if (res.ok) {
        setPreviewRecipients(data.recipients || [])
        if (data.thirdPartyUrl && !thirdPartyUrl) {
          setThirdPartyUrl(data.thirdPartyUrl)
        }
      }
    } catch (err) {
      console.error('Failed to preview broadcast:', err)
    } finally {
      setIsPreviewLoading(false)
    }
  }

  // Handle Audience Selection Change
  function handleAudienceChange(newAudience: 'all_verified' | 'commitments_only' | 'interests_only') {
    setBroadcastAudience(newAudience)
    if (broadcastOffering) {
      fetchBroadcastPreview(broadcastOffering.offeringId, newAudience)
    }
  }

  // Send Broadcast
  async function handleSendBroadcast() {
    if (!broadcastOffering) return
    if (!thirdPartyUrl.trim()) {
      alert('Please enter a valid third-party portal URL.')
      return
    }

    setIsSendingBroadcast(true)
    try {
      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offeringId: broadcastOffering.offeringId,
          offeringTitle: broadcastOffering.title,
          targetAudience: broadcastAudience,
          thirdPartyUrl: thirdPartyUrl.trim(),
          subject: broadcastSubject.trim(),
          customMessage: customMessage.trim(),
          sendEmail,
          sendWhatsApp,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to dispatch broadcast.')
      setBroadcastResult(data)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Broadcast failed.')
    } finally {
      setIsSendingBroadcast(false)
    }
  }

  // Investor verification change
  async function handleVerificationChange(userId: string, newStatus: string) {
    const previousUsers = [...users]
    setUsers((current) => current.map((u) => (u.id === userId ? { ...u, verificationStatus: newStatus } : u)))
    setUpdatingUserId(userId)

    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, verificationStatus: newStatus }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to update verification status.')

      setCommitments((prev) =>
        prev.map((c) => (c.userId === userId ? { ...c, userVerificationStatus: newStatus } : c))
      )
    } catch (err) {
      setUsers(previousUsers)
      alert(err instanceof Error ? err.message : 'Failed to update verification status.')
    } finally {
      setUpdatingUserId(null)
    }
  }

  // Commitment status change
  async function handleCommitmentStatusChange(commitmentId: string, newStatus: string) {
    const previousCommitments = [...commitments]
    setCommitments((current) => current.map((c) => (c.id === commitmentId ? { ...c, status: newStatus } : c)))
    setUpdatingCommitmentId(commitmentId)

    try {
      const response = await fetch('/api/admin/commitments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: commitmentId, status: newStatus }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to update commitment status.')
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
      if (selectedOfferingId === 'active_only') {
        const deal = offerings.find((o) => o.offeringId === item.offeringId)
        if (!deal || (deal.status !== 'active' && deal.status !== 'closing_soon')) return false
      } else if (selectedOfferingId === 'closed_only') {
        const deal = offerings.find((o) => o.offeringId === item.offeringId)
        if (!deal || (deal.status !== 'funded' && deal.status !== 'archived' && deal.status !== 'closed')) return false
      } else if (selectedOfferingId !== 'all' && item.offeringId !== selectedOfferingId) {
        return false
      }
      if (selectedType !== 'all' && item.type !== selectedType) return false
      if (selectedStatus !== 'all' && item.status !== selectedStatus) return false
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase()
        const nameMatch = item.userName.toLowerCase().includes(query)
        const emailMatch = item.userEmail.toLowerCase().includes(query)
        const phoneMatch = item.userPhone ? item.userPhone.toLowerCase().includes(query) : false
        const offeringMatch = item.offeringTitle.toLowerCase().includes(query)
        const amountMatch = item.amount ? item.amount.toString().includes(query) : false
        if (!nameMatch && !emailMatch && !phoneMatch && !offeringMatch && !amountMatch) return false
      }
      return true
    })
  }, [commitments, offerings, selectedOfferingId, selectedType, selectedStatus, searchQuery])

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

  // Export CSV
  function handleExportCSV() {
    if (filteredCommitments.length === 0) {
      alert('No commitments to export.')
      return
    }

    const headers = [
      'Investor Name',
      'Email',
      'Phone',
      'Accreditation',
      'Verification',
      'Offering',
      'Type',
      'Amount (USD)',
      'Status',
      'Date',
    ]

    const csvRows = filteredCommitments.map((c) => [
      `"${(c.userName || '').replace(/"/g, '""')}"`,
      `"${(c.userEmail || '').replace(/"/g, '""')}"`,
      `"${(c.userPhone || '').replace(/"/g, '""')}"`,
      `"${(c.investorStatus || '').replace(/"/g, '""')}"`,
      `"${(c.userVerificationStatus || '').replace(/"/g, '""')}"`,
      `"${(c.offeringTitle || '').replace(/"/g, '""')}"`,
      `"${c.type}"`,
      c.amount ? c.amount : 0,
      `"${c.status || 'active'}"`,
      `"${c.createdAt || ''}"`,
    ])

    const csvContent = [headers.join(','), ...csvRows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `syndicate-commitments-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <main className="min-h-screen bg-background px-4 pb-20 pt-[110px] text-foreground md:px-6 md:pt-[140px] font-sans">
      <div className="mx-auto max-w-6xl space-y-7">
        {/* CLEAN HEADER & TOP METRICS */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-muted text-[11px] font-mono text-muted-foreground uppercase font-semibold">
              <ShieldCheck className="size-3 text-primary" />
              Admin Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1">
              Syndicate Overview
            </h1>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl border border-border bg-card px-3.5 py-2 text-center min-w-[110px]">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block">Active SPV</span>
              <span className="text-base font-bold text-foreground font-mono">Micro1 Inc.</span>
            </div>
            <div className="rounded-xl border border-border bg-card px-3.5 py-2 text-center min-w-[110px]">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block">Committed</span>
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                ${commitmentStats.totalCommittedCapital.toLocaleString()}
              </span>
            </div>
            <div className="rounded-xl border border-border bg-card px-3.5 py-2 text-center min-w-[100px]">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block">Investors</span>
              <span className="text-base font-bold text-foreground font-mono tabular-nums">{users.length}</span>
            </div>
          </div>
        </section>

        {/* DEAL CARDS SECTION WITH CLEAN ACTIVE / CLOSED FILTER */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            {/* Filter Toggle: All vs Active vs Closed */}
            <div className="inline-flex rounded-xl border border-border bg-muted/40 p-1 text-xs font-mono">
              <button
                type="button"
                onClick={() => setDealFilter('all')}
                className={cn(
                  'px-3 py-1 rounded-lg font-medium transition cursor-pointer',
                  dealFilter === 'all'
                    ? 'bg-background text-foreground font-bold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                All ({offerings.length})
              </button>
              <button
                type="button"
                onClick={() => setDealFilter('active')}
                className={cn(
                  'px-3 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5',
                  dealFilter === 'active'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active ({activeDealsCount})
              </button>
              <button
                type="button"
                onClick={() => setDealFilter('closed')}
                className={cn(
                  'px-3 py-1 rounded-lg font-medium transition cursor-pointer',
                  dealFilter === 'closed'
                    ? 'bg-background text-foreground font-bold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Closed ({closedDealsCount})
              </button>
            </div>

            <span className="text-[11px] text-muted-foreground">Click card to isolate commitments</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {displayedOfferings.map((deal) => {
              const isSelected = selectedOfferingId === deal.offeringId
              const isActive = deal.status === 'active' || deal.status === 'closing_soon'

              return (
                <div
                  key={deal.offeringId}
                  onClick={() => setSelectedOfferingId(isSelected ? 'all' : deal.offeringId)}
                  className={cn(
                    'group relative rounded-2xl border p-4 transition-all cursor-pointer flex flex-col justify-between gap-3',
                    isSelected
                      ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-xs'
                      : 'border-border bg-card hover:border-primary/40 hover:bg-muted/20'
                  )}
                >
                  <div>
                    {/* Top Row: Title + Status Tag */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                          {deal.title}
                        </h3>
                        <span className="text-[11px] font-mono text-muted-foreground block">
                          {deal.valuation} • Cap ${deal.targetAllocation.toLocaleString()}
                        </span>
                      </div>

                      {isActive ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0">
                          Distributed
                        </span>
                      )}
                    </div>

                    {/* Progress Bar & Amount */}
                    <div className="mt-3 space-y-1 font-mono text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          ${deal.committedCapital.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground">{deal.percentFilled}% filled</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all',
                            isActive ? 'bg-primary' : 'bg-muted-foreground/50'
                          )}
                          style={{ width: `${Math.min(100, deal.percentFilled)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Single Action Button */}
                  <div className="pt-1">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenBroadcastModal(deal)
                      }}
                      size="sm"
                      variant={isActive ? 'default' : 'outline'}
                      className={cn(
                        'w-full h-8 rounded-xl text-xs font-semibold gap-1.5',
                        isActive && 'bg-foreground text-background hover:bg-foreground/90'
                      )}
                    >
                      <Send className="size-3" />
                      <span>{isActive ? 'Broadcast Link' : 'Portal Link'}</span>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* PRIMARY TABS: COMMITMENTS VS INVESTORS */}
        <div className="flex items-center justify-between border-b border-border pb-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('commitments')}
              className={cn(
                'rounded-full px-4 py-1.5 text-xs font-semibold transition cursor-pointer',
                activeTab === 'commitments'
                  ? 'bg-foreground text-background shadow-xs'
                  : 'bg-muted/50 text-muted-foreground hover:text-foreground'
              )}
            >
              Commitments ({commitments.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={cn(
                'rounded-full px-4 py-1.5 text-xs font-semibold transition cursor-pointer',
                activeTab === 'users'
                  ? 'bg-foreground text-background shadow-xs'
                  : 'bg-muted/50 text-muted-foreground hover:text-foreground'
              )}
            >
              Investors ({users.length})
            </button>
          </div>

          {activeTab === 'commitments' && (
            <Button
              onClick={handleExportCSV}
              variant="outline"
              size="sm"
              className="h-8 rounded-full text-xs font-medium gap-1.5 px-3"
            >
              <Download className="size-3 text-muted-foreground" />
              <span>Export CSV</span>
            </Button>
          )}
        </div>

        {/* TAB 1: COMMITMENTS & ALLOCATIONS */}
        {activeTab === 'commitments' && (
          <section className="space-y-3">
            {/* Unified Search & Filter Bar */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search investor, email, phone, check amount..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background py-1.5 pl-8 pr-3 text-xs placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="w-[180px]">
                <Select value={selectedOfferingId} onValueChange={setSelectedOfferingId}>
                  <SelectTrigger className="h-8.5 rounded-xl text-xs">
                    <SelectValue placeholder="All Deals" />
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                    <SelectItem value="all">All Deals ({offerings.length})</SelectItem>
                    <SelectItem value="active_only">● Active Deals Only ({activeDealsCount})</SelectItem>
                    <SelectItem value="closed_only">○ Closed Deals Only ({closedDealsCount})</SelectItem>
                    <div className="my-1 border-t border-border" />
                    {offerings.map((o) => {
                      const isActive = o.status === 'active' || o.status === 'closing_soon'
                      return (
                        <SelectItem key={o.offeringId} value={o.offeringId}>
                          {o.title} {isActive ? '(Active)' : '(Closed)'}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-[130px]">
                <Select value={selectedType} onValueChange={(val: any) => setSelectedType(val)}>
                  <SelectTrigger className="h-8.5 rounded-xl text-xs">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="commitment">Commitments</SelectItem>
                    <SelectItem value="interest">Interested</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-[140px]">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="h-8.5 rounded-xl text-xs">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="wire_received">Wire Received</SelectItem>
                    <SelectItem value="allocated">Allocated</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(selectedOfferingId !== 'all' || selectedType !== 'all' || selectedStatus !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedOfferingId('all')
                    setSelectedType('all')
                    setSelectedStatus('all')
                    setSearchQuery('')
                  }}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Commitments Table */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              {isLoadingCommitments ? (
                <div className="p-10 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                  <Loader2 className="size-4 animate-spin" /> Loading records...
                </div>
              ) : filteredCommitments.length === 0 ? (
                <div className="p-10 text-center text-xs text-muted-foreground">
                  No commitment records found matching your filters.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/40 font-mono text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                      <tr>
                        <th className="px-4 py-3 font-medium">Investor</th>
                        <th className="px-4 py-3 font-medium">Offering</th>
                        <th className="px-4 py-3 font-medium">Type</th>
                        <th className="px-4 py-3 font-medium">Amount</th>
                        <th className="px-4 py-3 font-medium">Verification</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredCommitments.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="flex size-7 items-center justify-center rounded-full bg-muted font-bold text-[10px] text-muted-foreground shrink-0">
                                {getInitials(item.userName)}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-foreground truncate">{item.userName}</p>
                                <p className="text-[11px] text-muted-foreground truncate">{item.userEmail}</p>
                                {item.userPhone && (
                                  <p className="text-[10px] font-mono text-muted-foreground/80 flex items-center gap-1">
                                    <Phone className="size-2.5" /> {item.userPhone}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3 font-semibold text-foreground">{item.offeringTitle}</td>

                          <td className="px-4 py-3">
                            {item.type === 'commitment' ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                                Commitment
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold text-[11px]">
                                Interested
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-3 font-mono font-bold text-foreground tabular-nums">
                            {item.amount ? `$${item.amount.toLocaleString()}` : '—'}
                          </td>

                          <td className="px-4 py-3">
                            <span className={cn('px-2 py-0.5 rounded-full text-[10.5px] font-medium border capitalize', getVerificationBadgeClass(item.userVerificationStatus))}>
                              {item.userVerificationStatus}
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <div className="w-[145px]">
                              <Select
                                value={item.status || 'active'}
                                onValueChange={(val) => handleCommitmentStatusChange(item.id, val)}
                                disabled={updatingCommitmentId === item.id}
                              >
                                <SelectTrigger className={cn('h-7 rounded-full border px-2.5 text-xs font-medium shadow-none', getCommitmentStatusBadgeClass(item.status))}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="text-xs">
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="wire_received">Wire Received</SelectItem>
                                  <SelectItem value="allocated">Allocated</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </td>

                          <td className="px-4 py-3 font-mono text-muted-foreground text-[11px]">
                            {formatDate(item.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}

        {/* TAB 2: INVESTORS DIRECTORY */}
        {activeTab === 'users' && (
          <section className="space-y-3">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, email, phone..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-background py-1.5 pl-8 pr-3 text-xs placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              {isLoadingUsers ? (
                <div className="p-10 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                  <Loader2 className="size-4 animate-spin" /> Loading investors...
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-10 text-center text-xs text-muted-foreground">
                  No investors found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/40 font-mono text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                      <tr>
                        <th className="px-4 py-3 font-medium">Investor</th>
                        <th className="px-4 py-3 font-medium">Phone</th>
                        <th className="px-4 py-3 font-medium">Accreditation</th>
                        <th className="px-4 py-3 font-medium">Verification Status</th>
                        <th className="px-4 py-3 font-medium">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3">
                            <p className="font-semibold text-foreground">{user.name}</p>
                            <p className="text-[11px] text-muted-foreground">{user.email}</p>
                          </td>

                          <td className="px-4 py-3 font-mono text-muted-foreground text-[11px]">
                            {user.phoneNumber || '—'}
                          </td>

                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground text-[11px]">
                              {user.investorStatus}
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <div className="w-[170px]">
                              <Select
                                value={
                                  !user.verificationStatus || user.verificationStatus === 'yet to be verified'
                                    ? 'pending verification'
                                    : user.verificationStatus
                                }
                                onValueChange={(val) => handleVerificationChange(user.id, val)}
                                disabled={updatingUserId === user.id}
                              >
                                <SelectTrigger className={cn('h-7.5 rounded-full border px-2.5 text-xs font-medium', getVerificationBadgeClass(user.verificationStatus))}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="text-xs">
                                  <SelectItem value="verified">Verified</SelectItem>
                                  <SelectItem value="pending verification">Pending verification</SelectItem>
                                  <SelectItem value="not verified">Not verified</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </td>

                          <td className="px-4 py-3 font-mono text-muted-foreground text-[11px]">
                            {formatDate(user.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}

        {/* BROADCAST DEAL LINK MODAL (SIMPLE & EFFICIENT) */}
        {isBroadcastModalOpen && broadcastOffering && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-3xl border border-border bg-card text-card-foreground p-6 shadow-2xl space-y-5 font-sans">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    Broadcast {broadcastOffering.title} Link
                  </h3>
                  <span className="text-xs text-muted-foreground">Notify verified investors via Email &amp; WhatsApp</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
                >
                  <X className="size-4" />
                </button>
              </div>

              {broadcastResult ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center space-y-1">
                    <CheckCheck className="size-6 text-emerald-500 mx-auto" />
                    <p className="text-sm font-bold text-emerald-950 dark:text-emerald-200">Broadcast Dispatched!</p>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300">
                      Sent {broadcastResult.emailsSent} emails • Prepared {broadcastResult.whatsappProcessed} WhatsApp links.
                    </p>
                  </div>

                  {broadcastResult.whatsappRoster && broadcastResult.whatsappRoster.length > 0 && (
                    <div className="max-h-48 overflow-y-auto divide-y divide-border rounded-xl border border-border">
                      {broadcastResult.whatsappRoster.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 text-xs">
                          <div>
                            <p className="font-semibold text-foreground">{item.userName}</p>
                            <p className="text-[10px] font-mono text-muted-foreground">{item.userPhone || item.userEmail}</p>
                          </div>
                          {item.whatsAppLink && (
                            <a
                              href={item.whatsAppLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded-md bg-emerald-600 text-white font-semibold text-[10.5px] hover:bg-emerald-700 flex items-center gap-1"
                            >
                              <MessageSquare className="size-3" /> Chat
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <Button onClick={() => setIsBroadcastModalOpen(false)} className="w-full rounded-xl text-xs font-semibold">
                    Done
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Audience Toggle */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
                      Target Audience
                    </label>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => handleAudienceChange('all_verified')}
                        className={cn(
                          'p-2 rounded-xl border text-center font-medium transition',
                          broadcastAudience === 'all_verified'
                            ? 'border-primary bg-primary/10 text-primary font-bold'
                            : 'border-border bg-muted/40 text-muted-foreground'
                        )}
                      >
                        All Verified
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAudienceChange('commitments_only')}
                        className={cn(
                          'p-2 rounded-xl border text-center font-medium transition',
                          broadcastAudience === 'commitments_only'
                            ? 'border-primary bg-primary/10 text-primary font-bold'
                            : 'border-border bg-muted/40 text-muted-foreground'
                        )}
                      >
                        Commitments
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAudienceChange('interests_only')}
                        className={cn(
                          'p-2 rounded-xl border text-center font-medium transition',
                          broadcastAudience === 'interests_only'
                            ? 'border-primary bg-primary/10 text-primary font-bold'
                            : 'border-border bg-muted/40 text-muted-foreground'
                        )}
                      >
                        Interested
                      </button>
                    </div>
                  </div>

                  {/* Third Party URL */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
                      Third-Party Closing / Portal URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://app.carta.com/spvs/..."
                      value={thirdPartyUrl}
                      onChange={(e) => setThirdPartyUrl(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background py-2 px-3 text-xs font-mono placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  {/* Custom Message */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
                      Note from Admin (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Please sign subscription documents before closing."
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background p-2.5 text-xs placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  {/* Recipients Preview */}
                  <div className="rounded-xl border border-border bg-muted/20 p-3 text-xs flex items-center justify-between font-mono">
                    <span className="text-muted-foreground">Verified Recipients:</span>
                    <strong className="text-foreground">
                      {isPreviewLoading ? 'Loading...' : `${previewRecipients.length} Verified Investor(s)`}
                    </strong>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsBroadcastModalOpen(false)}
                      className="rounded-xl text-xs"
                      disabled={isSendingBroadcast}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleSendBroadcast}
                      disabled={isSendingBroadcast || !thirdPartyUrl.trim() || previewRecipients.length === 0}
                      className="rounded-xl text-xs font-semibold gap-1.5 px-4 bg-foreground text-background hover:bg-foreground/90"
                    >
                      {isSendingBroadcast ? (
                        <>
                          <Loader2 className="size-3.5 animate-spin" /> Sending...
                        </>
                      ) : (
                        <>
                          <Send className="size-3" /> Send ({previewRecipients.length})
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
