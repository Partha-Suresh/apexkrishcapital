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
  ChevronLeft,
  Send,
  MessageSquare,
  ExternalLink,
  Copy,
  CheckCheck,
  Mail,
  Link2,
  X,
  Radio,
  LayoutGrid,
  List,
  Archive,
  History,
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

  // Deal Offerings Tracker Scalability Controls
  const [offeringFilterTab, setOfferingFilterTab] = useState<'all' | 'active' | 'past'>('all')
  const [offeringSearchQuery, setOfferingSearchQuery] = useState('')
  const [offeringViewMode, setOfferingViewMode] = useState<'grid' | 'table'>('grid')
  const [offeringPage, setOfferingPage] = useState(1)
  const offeringsPerPage = 8

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
  const [copiedUrl, setCopiedUrl] = useState(false)

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

  // Scalable Filtered Offerings List
  const filteredOfferings = useMemo(() => {
    return offerings.filter((deal) => {
      // 1. Tab differentiation: active vs past vs all
      if (offeringFilterTab === 'active') {
        const isActive = deal.status === 'active' || deal.status === 'closing_soon' || deal.status === 'upcoming'
        if (!isActive) return false
      } else if (offeringFilterTab === 'past') {
        const isPast = deal.status === 'funded' || deal.status === 'archived' || deal.status === 'closed'
        if (!isPast) return false
      }

      // 2. Search query filter
      if (offeringSearchQuery.trim()) {
        const query = offeringSearchQuery.trim().toLowerCase()
        const titleMatch = deal.title.toLowerCase().includes(query)
        const companyMatch = deal.companyName.toLowerCase().includes(query)
        const roundMatch = deal.roundName.toLowerCase().includes(query)
        const categoryMatch = deal.category.toLowerCase().includes(query)
        if (!titleMatch && !companyMatch && !roundMatch && !categoryMatch) {
          return false
        }
      }

      return true
    })
  }, [offerings, offeringFilterTab, offeringSearchQuery])

  // Paginated Offerings for handling dozens/hundreds of cards gracefully
  const totalOfferingPages = Math.ceil(filteredOfferings.length / offeringsPerPage) || 1
  const paginatedOfferings = useMemo(() => {
    const startIdx = (offeringPage - 1) * offeringsPerPage
    return filteredOfferings.slice(startIdx, startIdx + offeringsPerPage)
  }, [filteredOfferings, offeringPage, offeringsPerPage])

  // Offering Counts
  const activeOfferingsCount = useMemo(() => {
    return offerings.filter(
      (o) => o.status === 'active' || o.status === 'closing_soon' || o.status === 'upcoming'
    ).length
  }, [offerings])

  const pastOfferingsCount = useMemo(() => {
    return offerings.filter(
      (o) => o.status === 'funded' || o.status === 'archived' || o.status === 'closed'
    ).length
  }, [offerings])

  // Open Broadcast Modal & Load Deal Link & Preview
  async function handleOpenBroadcastModal(offering: OfferingMetric) {
    setBroadcastOffering(offering)
    setBroadcastResult(null)
    setIsBroadcastModalOpen(true)
    setBroadcastSubject(`Priority Access: ${offering.title} SPV Subscription & Closing Portal`)
    setCustomMessage('')
    setIsPreviewLoading(true)

    try {
      const linkRes = await fetch(`/api/admin/offerings/${offering.offeringId}/link`, {
        cache: 'no-store',
      })
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
      const res = await fetch(
        `/api/admin/broadcast?offeringId=${offeringId}&audience=${audience}`,
        { cache: 'no-store' }
      )
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

  // Trigger Broadcast Dispatch
  async function handleSendBroadcast() {
    if (!broadcastOffering) return
    if (!thirdPartyUrl.trim()) {
      alert('Please enter a valid third-party subscription/closing portal URL.')
      return
    }

    if (!thirdPartyUrl.startsWith('http://') && !thirdPartyUrl.startsWith('https://')) {
      alert('The portal URL must start with https:// or http://')
      return
    }

    if (!sendEmail && !sendWhatsApp) {
      alert('Please select at least one delivery channel (Email or WhatsApp).')
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

      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch broadcast.')
      }

      setBroadcastResult(data)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Broadcast failed.')
    } finally {
      setIsSendingBroadcast(false)
    }
  }

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
      if (selectedOfferingId !== 'all' && item.offeringId !== selectedOfferingId) {
        return false
      }
      if (selectedType !== 'all' && item.type !== selectedType) {
        return false
      }
      if (selectedStatus !== 'all' && item.status !== selectedStatus) {
        return false
      }
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
              Real-time multi-deal allocation tracking, investor qualification verification, capital commitment pipelines, and verified investor multi-channel broadcasts.
            </p>
          </div>

          {/* GLOBAL PORTFOLIO STRIP */}
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-xs min-w-[140px]">
              <div className="flex items-center gap-2 text-muted-foreground text-[11px] font-mono uppercase tracking-wider">
                <Building2 className="size-3.5 text-emerald-500" />
                Active Deals
              </div>
              <p className="mt-2 text-2xl font-bold font-mono text-foreground tabular-nums">
                {isLoadingCommitments ? '—' : activeOfferingsCount}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 shadow-xs min-w-[140px]">
              <div className="flex items-center gap-2 text-muted-foreground text-[11px] font-mono uppercase tracking-wider">
                <Archive className="size-3.5 text-muted-foreground" />
                Past Deals
              </div>
              <p className="mt-2 text-2xl font-bold font-mono text-muted-foreground tabular-nums">
                {isLoadingCommitments ? '—' : pastOfferingsCount}
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
              Deal Opportunities &amp; Commitments ({commitments.length})
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
            {/* MULTI-DEAL ALLOCATION TRACKER: SCALABLE & DIFFERENTIATED */}
            <section className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-5">
              {/* Top Filter & View Mode Controls */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between pb-4 border-b border-border/80">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                    <PieChart className="size-3.5 text-primary" />
                    Deal Portfolio Hub ({offerings.length} Total SPVs)
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Filter by active allocations or historical distributions • Click card to isolate commitment records.
                  </p>
                </div>

                {/* Sub-Filters & View Mode Switcher */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Segmented Filter Pills */}
                  <div className="inline-flex rounded-xl border border-border bg-muted/40 p-1 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setOfferingFilterTab('all')
                        setOfferingPage(1)
                      }}
                      className={cn(
                        'px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer',
                        offeringFilterTab === 'all'
                          ? 'bg-background text-foreground shadow-xs font-semibold'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      All ({offerings.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOfferingFilterTab('active')
                        setOfferingPage(1)
                      }}
                      className={cn(
                        'px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer',
                        offeringFilterTab === 'active'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
                      Active ({activeOfferingsCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOfferingFilterTab('past')
                        setOfferingPage(1)
                      }}
                      className={cn(
                        'px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer',
                        offeringFilterTab === 'past'
                          ? 'bg-background text-foreground shadow-xs font-semibold'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <History className="size-3 text-muted-foreground" />
                      Past ({pastOfferingsCount})
                    </button>
                  </div>

                  {/* Offering Search */}
                  <div className="relative w-full sm:w-[190px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search deals..."
                      value={offeringSearchQuery}
                      onChange={(e) => {
                        setOfferingSearchQuery(e.target.value)
                        setOfferingPage(1)
                      }}
                      className="w-full rounded-xl border border-border bg-background py-1.5 pl-8 pr-3 text-xs placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  {/* View Mode Toggle: Grid vs Table */}
                  <div className="inline-flex rounded-xl border border-border bg-muted/40 p-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setOfferingViewMode('grid')}
                      title="Card Grid View"
                      className={cn(
                        'p-1.5 rounded-lg transition-all cursor-pointer',
                        offeringViewMode === 'grid'
                          ? 'bg-background text-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <LayoutGrid className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setOfferingViewMode('table')}
                      title="Compact Table View"
                      className={cn(
                        'p-1.5 rounded-lg transition-all cursor-pointer',
                        offeringViewMode === 'table'
                          ? 'bg-background text-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <List className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* VIEW 1: SCALABLE GRID VIEW */}
              {offeringViewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {paginatedOfferings.map((deal) => {
                    const isSelected = selectedOfferingId === deal.offeringId
                    const isPast = deal.status === 'funded' || deal.status === 'archived' || deal.status === 'closed'

                    return (
                      <div
                        key={deal.offeringId}
                        className={cn(
                          'group relative rounded-2xl border p-4.5 transition-all duration-200 flex flex-col justify-between',
                          isPast
                            ? 'border-border/60 bg-muted/20 opacity-90 hover:opacity-100 hover:border-border'
                            : 'border-border bg-card shadow-xs hover:border-primary/50 hover:bg-muted/30',
                          isSelected && 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-md'
                        )}
                      >
                        <div>
                          {/* Top Category & Differentiated Status Header */}
                          <div
                            onClick={() => setSelectedOfferingId(isSelected ? 'all' : deal.offeringId)}
                            className="flex items-center justify-between pb-2.5 border-b border-border/60 text-xs cursor-pointer"
                          >
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                              {deal.category}
                            </span>
                            
                            {/* Differentiated Status Badges */}
                            {isPast ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-muted/80 text-muted-foreground border border-border">
                                <Archive className="size-2.5" />
                                Distributed
                              </span>
                            ) : (
                              <span
                                className={cn(
                                  'inline-flex items-center gap-1 text-[11px] font-semibold font-mono capitalize px-2 py-0.5 rounded-full border',
                                  deal.status === 'closing_soon'
                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                                )}
                              >
                                <span className="size-1.5 rounded-full bg-current animate-pulse" />
                                {deal.status === 'closing_soon' ? 'Closing Soon' : 'Active SPV'}
                              </span>
                            )}
                          </div>

                          {/* Title & Valuation */}
                          <div
                            onClick={() => setSelectedOfferingId(isSelected ? 'all' : deal.offeringId)}
                            className="mt-3 cursor-pointer"
                          >
                            <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                              <span>{deal.title}</span>
                              {isSelected && <Check className="size-4 text-primary" />}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                              Valuation: {deal.valuation} • Min ${deal.minCheckSize.toLocaleString()}
                            </p>
                          </div>

                          {/* Cap Fill Progress Bar for Active vs Past Summary */}
                          <div
                            onClick={() => setSelectedOfferingId(isSelected ? 'all' : deal.offeringId)}
                            className="mt-4 space-y-1.5 font-mono text-xs cursor-pointer"
                          >
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-muted-foreground">
                                {isPast ? 'Final Raised Allocation:' : 'Allocation Filled:'}
                              </span>
                              <span className="font-bold text-foreground tabular-nums">
                                {deal.percentFilled}%
                              </span>
                            </div>

                            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                              <div
                                className={cn(
                                  'h-full rounded-full transition-all duration-500',
                                  isPast
                                    ? 'bg-muted-foreground/60'
                                    : deal.percentFilled >= 100
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
                              <span>Target: ${deal.targetAllocation.toLocaleString()}</span>
                            </div>
                          </div>

                          {/* Investor counts */}
                          <div className="mt-3.5 pt-2.5 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                            <span>{deal.commitmentsCount} Checks ($5K+)</span>
                            <span>{deal.interestsCount} Interested</span>
                          </div>
                        </div>

                        {/* Differentiated Bottom Actions */}
                        <div className="mt-3.5 pt-3 border-t border-border/60 flex items-center gap-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleOpenBroadcastModal(deal)
                            }}
                            size="sm"
                            variant={isPast ? 'outline' : 'default'}
                            className={cn(
                              'w-full h-8.5 rounded-xl text-xs font-semibold gap-1.5 shadow-xs',
                              !isPast && 'bg-foreground text-background hover:bg-foreground/90'
                            )}
                          >
                            <Send className="size-3.5" />
                            <span>{isPast ? 'Manage Portal Link' : 'Broadcast Deal Link'}</span>
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* VIEW 2: HIGH-DENSITY COMPACT TABLE VIEW */}
              {offeringViewMode === 'table' && (
                <div className="overflow-x-auto rounded-2xl border border-border">
                  <table className="w-full text-left font-sans text-xs">
                    <thead className="bg-muted/40 font-mono text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                      <tr>
                        <th className="px-4 py-3 font-medium">Offering / Company</th>
                        <th className="px-4 py-3 font-medium">Category</th>
                        <th className="px-4 py-3 font-medium">Valuation</th>
                        <th className="px-4 py-3 font-medium">Target Cap</th>
                        <th className="px-4 py-3 font-medium">Committed / Progress</th>
                        <th className="px-4 py-3 font-medium">Participants</th>
                        <th className="px-4 py-3 font-medium">Lifecycle Status</th>
                        <th className="px-4 py-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {paginatedOfferings.map((deal) => {
                        const isSelected = selectedOfferingId === deal.offeringId
                        const isPast = deal.status === 'funded' || deal.status === 'archived' || deal.status === 'closed'

                        return (
                          <tr
                            key={deal.offeringId}
                            onClick={() => setSelectedOfferingId(isSelected ? 'all' : deal.offeringId)}
                            className={cn(
                              'transition-colors cursor-pointer hover:bg-muted/30',
                              isSelected && 'bg-primary/5 font-medium'
                            )}
                          >
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-2">
                                {isSelected && <Check className="size-3.5 text-primary" />}
                                <div>
                                  <p className="font-bold text-foreground text-sm">{deal.title}</p>
                                  <p className="text-[11px] text-muted-foreground font-mono">{deal.roundName}</p>
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-3.5">
                              <span className="font-mono text-[10.5px] px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                                {deal.category}
                              </span>
                            </td>

                            <td className="px-4 py-3.5 font-mono text-muted-foreground">
                              {deal.valuation}
                            </td>

                            <td className="px-4 py-3.5 font-mono text-foreground font-semibold">
                              ${deal.targetAllocation.toLocaleString()}
                            </td>

                            <td className="px-4 py-3.5 font-mono">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                  ${deal.committedCapital.toLocaleString()}
                                </span>
                                <span className="text-muted-foreground text-[11px]">({deal.percentFilled}%)</span>
                              </div>
                              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted mt-1">
                                <div
                                  className={cn(
                                    'h-full rounded-full',
                                    isPast ? 'bg-muted-foreground/60' : 'bg-primary'
                                  )}
                                  style={{ width: `${Math.min(100, deal.percentFilled)}%` }}
                                />
                              </div>
                            </td>

                            <td className="px-4 py-3.5 font-mono text-muted-foreground">
                              <span>{deal.commitmentsCount} Checks</span>
                              <span className="text-[10.5px] block text-muted-foreground/80">
                                {deal.interestsCount} interested
                              </span>
                            </td>

                            <td className="px-4 py-3.5 font-mono">
                              {isPast ? (
                                <span className="inline-flex items-center gap-1 text-[10.5px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                                  Distributed
                                </span>
                              ) : (
                                <span
                                  className={cn(
                                    'inline-flex items-center gap-1 text-[10.5px] px-2 py-0.5 rounded-full border',
                                    deal.status === 'closing_soon'
                                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                                  )}
                                >
                                  <span className="size-1 rounded-full bg-current" />
                                  {deal.status === 'closing_soon' ? 'Closing Soon' : 'Active'}
                                </span>
                              )}
                            </td>

                            <td className="px-4 py-3.5 text-right">
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleOpenBroadcastModal(deal)
                                }}
                                size="sm"
                                variant="outline"
                                className="h-7 rounded-lg text-xs gap-1 font-medium"
                              >
                                <Send className="size-3" />
                                <span>{isPast ? 'Portal Link' : 'Broadcast'}</span>
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Scalability Pagination Bar */}
              {totalOfferingPages > 1 && (
                <div className="flex items-center justify-between pt-2 border-t border-border/80 text-xs font-mono">
                  <span className="text-muted-foreground">
                    Showing {(offeringPage - 1) * offeringsPerPage + 1}–
                    {Math.min(offeringPage * offeringsPerPage, filteredOfferings.length)} of {filteredOfferings.length} deals
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setOfferingPage((p) => Math.max(1, p - 1))}
                      disabled={offeringPage === 1}
                      className="h-7 px-2.5 rounded-lg text-xs"
                    >
                      <ChevronLeft className="size-3.5" />
                    </Button>
                    <span className="px-2 text-foreground font-semibold">
                      Page {offeringPage} of {totalOfferingPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setOfferingPage((p) => Math.min(totalOfferingPages, p + 1))}
                      disabled={offeringPage === totalOfferingPages}
                      className="h-7 px-2.5 rounded-lg text-xs"
                    >
                      <ChevronRight className="size-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </section>

            {/* FILTER & SEARCH BAR */}
            <section className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                {/* Search input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search commitments by investor name, email, phone, offering, or check amount..."
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
                  <h2 className="text-sm font-semibold">Deal Commitments &amp; Syndicate Roster</h2>
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
                <h2 className="text-sm font-semibold">Registered Investors &amp; Accreditation</h2>
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

        {/* BROADCAST DEAL LINK MODAL */}
        {isBroadcastModalOpen && broadcastOffering && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card text-card-foreground p-6 sm:p-7 shadow-2xl space-y-6 font-sans">
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-4 border-b border-border">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10.5px] font-mono font-bold uppercase text-primary">
                    <Radio className="size-3 text-primary animate-pulse" />
                    Broadcast Engine
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    Broadcast {broadcastOffering.title} Link
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Send unique third-party subscription and closing links to verified investors via Email and WhatsApp.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* SUCCESS RESULT SCREEN */}
              {broadcastResult ? (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center space-y-2">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500 text-white">
                      <CheckCheck className="size-6" />
                    </div>
                    <h4 className="text-base font-bold text-emerald-950 dark:text-emerald-200">
                      Broadcast Dispatched Successfully!
                    </h4>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300 max-w-md mx-auto">
                      {broadcastResult.message}
                    </p>
                    <div className="flex items-center justify-center gap-4 pt-2 font-mono text-xs">
                      <span className="px-3 py-1 rounded-full bg-background border border-emerald-500/30 font-semibold text-emerald-600 dark:text-emerald-400">
                        ✉️ {broadcastResult.emailsSent} Emails Sent
                      </span>
                      <span className="px-3 py-1 rounded-full bg-background border border-emerald-500/30 font-semibold text-emerald-600 dark:text-emerald-400">
                        💬 {broadcastResult.whatsappProcessed} WhatsApp Links Ready
                      </span>
                    </div>
                  </div>

                  {/* WhatsApp Roster for Instant Direct Chat */}
                  {broadcastResult.whatsappRoster && broadcastResult.whatsappRoster.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold uppercase tracking-wider text-muted-foreground">
                          Direct WhatsApp Transmission Roster ({broadcastResult.whatsappRoster.length})
                        </span>
                        <span className="text-muted-foreground text-[11px]">
                          Click &quot;Open WhatsApp&quot; for instant pre-filled chat
                        </span>
                      </div>

                      <div className="max-h-52 overflow-y-auto divide-y divide-border rounded-xl border border-border bg-muted/20">
                        {broadcastResult.whatsappRoster.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 text-xs">
                            <div className="min-w-0 pr-3">
                              <p className="font-semibold text-foreground truncate">{item.userName}</p>
                              <p className="text-[11px] text-muted-foreground font-mono">
                                {item.userPhone || item.userEmail}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {item.whatsAppLink ? (
                                <a
                                  href={item.whatsAppLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-[11px] hover:bg-emerald-700 transition-colors shadow-xs"
                                >
                                  <MessageSquare className="size-3" />
                                  <span>Open WhatsApp</span>
                                  <ExternalLink className="size-2.5 opacity-70" />
                                </a>
                              ) : (
                                <span className="text-[11px] text-muted-foreground font-mono">
                                  No phone number
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <Button
                      onClick={() => setIsBroadcastModalOpen(false)}
                      className="rounded-xl text-xs font-semibold px-6"
                    >
                      Done
                    </Button>
                  </div>
                </div>
              ) : (
                /* FORM STEP */
                <div className="space-y-5">
                  {/* Target Audience Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
                      1. Target Audience (Must be Admin-Verified)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => handleAudienceChange('all_verified')}
                        className={cn(
                          'p-3 rounded-xl border text-left transition-all cursor-pointer',
                          broadcastAudience === 'all_verified'
                            ? 'border-primary bg-primary/10 text-primary font-semibold'
                            : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                        )}
                      >
                        <p className="font-bold text-foreground">All Verified</p>
                        <p className="text-[10.5px] text-muted-foreground mt-0.5">
                          Commitments ($5K+) &amp; Expressed Interest
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAudienceChange('commitments_only')}
                        className={cn(
                          'p-3 rounded-xl border text-left transition-all cursor-pointer',
                          broadcastAudience === 'commitments_only'
                            ? 'border-primary bg-primary/10 text-primary font-semibold'
                            : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                        )}
                      >
                        <p className="font-bold text-foreground">Commitments Only</p>
                        <p className="text-[10.5px] text-muted-foreground mt-0.5">
                          Investors with $5,000+ checks
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAudienceChange('interests_only')}
                        className={cn(
                          'p-3 rounded-xl border text-left transition-all cursor-pointer',
                          broadcastAudience === 'interests_only'
                            ? 'border-primary bg-primary/10 text-primary font-semibold'
                            : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                        )}
                      >
                        <p className="font-bold text-foreground">Interested Only</p>
                        <p className="text-[10.5px] text-muted-foreground mt-0.5">
                          Priority soft intent requests
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Third-Party Platform URL */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-1.5">
                        <Link2 className="size-3.5 text-primary" />
                        2. Third-Party Subscription / Closing Portal URL
                      </label>
                      <span className="text-[10.5px] text-muted-foreground">Unique for {broadcastOffering.title}</span>
                    </div>
                    <div className="relative">
                      <input
                        type="url"
                        placeholder="https://app.carta.com/spvs/... or https://docusign.net/..."
                        value={thirdPartyUrl}
                        onChange={(e) => setThirdPartyUrl(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background py-2.5 pl-3 pr-20 text-xs font-mono placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      {thirdPartyUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(thirdPartyUrl)
                            setCopiedUrl(true)
                            setTimeout(() => setCopiedUrl(false), 2000)
                          }}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-mono text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1 rounded bg-muted/60"
                        >
                          {copiedUrl ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                          <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      This link will be saved securely and embedded into the email CTA button and WhatsApp message.
                    </p>
                  </div>

                  {/* Custom Message / Instructions */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
                      3. Custom Message from Syndicate Lead (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Please sign your subscription documents by Friday, Oct 18th to secure your final allocation."
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background p-3 text-xs placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                    />
                  </div>

                  {/* Channel Delivery Toggles */}
                  <div className="rounded-xl border border-border bg-muted/30 p-3.5 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
                      4. Delivery Channels
                    </p>
                    <div className="flex flex-wrap items-center gap-5 text-xs">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={sendEmail}
                          onChange={(e) => setSendEmail(e.target.checked)}
                          className="size-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <span className="flex items-center gap-1.5 font-medium">
                          <Mail className="size-3.5 text-blue-500" />
                          Send Official Email Notification
                        </span>
                      </label>

                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={sendWhatsApp}
                          onChange={(e) => setSendWhatsApp(e.target.checked)}
                          className="size-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <span className="flex items-center gap-1.5 font-medium">
                          <MessageSquare className="size-3.5 text-emerald-500" />
                          Prepare WhatsApp Dispatch &amp; Links
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Verified Recipient Live Preview */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold uppercase tracking-wider text-muted-foreground">
                        Qualified Verified Recipients ({previewRecipients.length})
                      </span>
                      {isPreviewLoading && <Loader2 className="size-3.5 animate-spin text-primary" />}
                    </div>

                    {isPreviewLoading ? (
                      <div className="flex items-center justify-center p-6 text-xs text-muted-foreground border border-border rounded-xl">
                        <Loader2 className="size-4 animate-spin mr-2" />
                        Scanning database for verified participants...
                      </div>
                    ) : previewRecipients.length === 0 ? (
                      <div className="p-4 rounded-xl border border-border bg-muted/20 text-center text-xs text-muted-foreground">
                        No verified investors currently found for this audience filter.
                      </div>
                    ) : (
                      <div className="max-h-40 overflow-y-auto divide-y divide-border rounded-xl border border-border bg-background">
                        {previewRecipients.map((r) => (
                          <div key={r.userId} className="flex items-center justify-between p-2.5 text-xs">
                            <div className="min-w-0 pr-3">
                              <p className="font-medium text-foreground truncate">{r.userName}</p>
                              <p className="text-[11px] text-muted-foreground font-mono">{r.userEmail}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <span
                                className={cn(
                                  'inline-block px-2 py-0.5 rounded text-[10px] font-semibold font-mono',
                                  r.type === 'commitment'
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                    : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                )}
                              >
                                {r.type === 'commitment' && r.amount
                                  ? `$${r.amount.toLocaleString()} Check`
                                  : 'Interested'}
                              </span>
                              {r.userPhone && (
                                <p className="text-[10px] text-muted-foreground font-mono mt-0.5 flex items-center gap-1 justify-end">
                                  <Phone className="size-2.5" />
                                  {r.userPhone}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
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
                      disabled={
                        isSendingBroadcast ||
                        previewRecipients.length === 0 ||
                        !thirdPartyUrl.trim()
                      }
                      className="rounded-xl text-xs font-semibold gap-1.5 px-5 shadow-xs"
                    >
                      {isSendingBroadcast ? (
                        <>
                          <Loader2 className="size-3.5 animate-spin" />
                          <span>Dispatching Broadcast...</span>
                        </>
                      ) : (
                        <>
                          <Send className="size-3.5" />
                          <span>Send Broadcast ({previewRecipients.length})</span>
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
