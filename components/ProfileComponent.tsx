"use client"

import React, { useEffect, useState, ChangeEvent } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { Check, ArrowLeft, ShieldCheck, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

type Profile = {
	firstName: string
	middleName?: string
	lastName: string
	phone: string
	investorStatus: "Not Accredited" | "Accredited investor(1M+)" | "Qualified client(2M+)" | "Qualified purchaser(5M+)" | string
	citizenship: "US" | "Non-US" | string
	avatar?: string
}

type HoveredStatusInfo = {
	value: string
	description: string
	top: number
	left: number
	placement: "right" | "left" | "bottom"
}

const STORAGE_KEY = "myapp:profile"

// Centralized descriptions for accredited investor statuses (placeholders ready to be customized)
const investorStatusDescriptions: Record<string, string> = {
	"Accredited investor(1M+)": "Net worth exceeding $1 million, either individually or jointly with a spouse, excluding the value of their primary residence.",
	"Qualified client(2M+)": "Net worth possessing a net worth exceeding $2.7 million, excluding the value of their primary residence.",
	"Qualified purchaser(5M+)": "Individuals with an excess of $5 million in investments, or entities with at least $25 million in investments.",
}

export default function ProfilePage() {
	const { user, isLoaded: isClerkLoaded } = useUser()

	const [profile, setProfile] = useState<Profile>({
		firstName: "",
		middleName: "",
		lastName: "",
		phone: "",
		investorStatus: "Not Accredited",
		citizenship: "US",
		avatar: "",
	})

	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [saved, setSaved] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [hoveredStatus, setHoveredStatus] = useState<HoveredStatusInfo | null>(null)
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	// Dismiss hovering dialog on scroll or resize to prevent misaligned floating dialogs
	useEffect(() => {
		if (!hoveredStatus) return
		const handleDismiss = () => setHoveredStatus(null)
		window.addEventListener("scroll", handleDismiss, true)
		window.addEventListener("resize", handleDismiss)
		return () => {
			window.removeEventListener("scroll", handleDismiss, true)
			window.removeEventListener("resize", handleDismiss)
		}
	}, [hoveredStatus])

	function handleOptionHover(val: string, element: HTMLElement) {
		const desc = investorStatusDescriptions[val]
		if (!desc) {
			setHoveredStatus(null)
			return
		}

		const rect = element.getBoundingClientRect()
		const margin = 12
		const dialogWidth = 320
		const viewportWidth = window.innerWidth
		const viewportHeight = window.innerHeight

		if (viewportWidth >= 640) {
			const hasRoomOnLeft = rect.left - margin - dialogWidth >= 0
			const left = hasRoomOnLeft
				? rect.left - margin - dialogWidth
				: rect.right + margin
			const centerY = rect.top + rect.height / 2
			const top = Math.max(70, Math.min(viewportHeight - 70, centerY))

			setHoveredStatus({
				value: val,
				description: desc,
				top,
				left,
				placement: hasRoomOnLeft ? "left" : "right",
			})
		} else {
			const left = Math.max(margin, Math.min(rect.left, viewportWidth - dialogWidth - margin))
			const top = rect.bottom + margin
			setHoveredStatus({
				value: val,
				description: desc,
				top,
				left,
				placement: "bottom",
			})
		}
	}

	// Fetch existing profile from MongoDB
	useEffect(() => {
		async function fetchProfile() {
			try {
				const res = await fetch("/api/user/profile")
				if (res.ok) {
					const data = await res.json()
					if (data.user) {
						setProfile({
							firstName: data.user.firstName || "",
							middleName: data.user.middleName || "",
							lastName: data.user.lastName || "",
							phone: data.user.phoneNumber || "",
							investorStatus: data.user.investorStatus || "Not Accredited",
							citizenship: data.user.citizenship || "US",
							avatar: data.user.avatar || "",
						})
						setLoading(false)
						return
					}
				}
			} catch (e) {
				console.warn("Could not fetch profile from server, using local fallback", e)
			}

			// Fallback: Clerk data or localStorage
			try {
				const raw = localStorage.getItem(STORAGE_KEY)
				if (raw) {
					const parsed = JSON.parse(raw)
					setProfile((prev) => ({
						...prev,
						...parsed,
						investorStatus: parsed.investorStatus || "Not Accredited",
						citizenship: parsed.citizenship || "US",
					}))
				} else if (user) {
					setProfile((prev) => ({
						...prev,
						firstName: user.firstName || "",
						lastName: user.lastName || "",
						phone: user.phoneNumbers?.[0]?.phoneNumber || "",
					}))
				}
			} catch (e) {}

			setLoading(false)
		}

		if (isClerkLoaded) {
			fetchProfile()
		}
	}, [isClerkLoaded, user])

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target
		setError(null)
		setProfile((p) => ({ ...p, [name]: value }))
	}

	async function handleSave() {
		// Non-optional validation
		if (!profile.firstName.trim()) {
			setError("First name is required.")
			return
		}
		if (!profile.lastName.trim()) {
			setError("Last name is required.")
			return
		}
		if (!profile.phone.trim()) {
			setError("Phone number is required.")
			return
		}
		if (!profile.investorStatus) {
			setError("Accredited investor status is required.")
			return
		}
		if (!profile.citizenship) {
			setError("Citizenship is required.")
			return
		}

		setSaving(true)
		setError(null)

		const avatarUrl = user?.imageUrl || profile.avatar || "/usericon.webp"

		try {
			const res = await fetch("/api/user/profile", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					firstName: profile.firstName,
					middleName: profile.middleName,
					lastName: profile.lastName,
					phone: profile.phone,
					investorStatus: profile.investorStatus,
					citizenship: profile.citizenship,
					avatar: avatarUrl,
				}),
			})

			if (!res.ok) {
				const errData = await res.json()
				throw new Error(errData.error || "Failed to save profile to database")
			}

			// Also backup to localStorage
			try {
				localStorage.setItem(
					STORAGE_KEY,
					JSON.stringify({ ...profile, avatar: avatarUrl })
				)
			} catch (e) {}

			setSaved(true)
			setTimeout(() => setSaved(false), 2500)
		} catch (err: any) {
			console.error("Save error:", err)
			setError(err.message || "Failed to update profile.")
		} finally {
			setSaving(false)
		}
	}

	// Avatar resolution: Google profile picture if signed in with Google, else fallback to /usericon.webp
	const displayAvatar = user?.imageUrl || "/usericon.webp"

	return (
		<main className="min-h-screen bg-background text-foreground pt-[120px] md:pt-[160px] pb-20 px-4">
			<div className="max-w-xl mx-auto">
				{/* Top back navigation */}
				<Link
					href="/"
					className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors mb-6"
				>
					<ArrowLeft className="w-3.5 h-3.5" />
					<span>Back to Apex Krish Capital</span>
				</Link>

				{/* Main Card */}
				<div className="rounded-[32px] border border-border bg-card text-card-foreground p-7 sm:p-10 shadow-sm backdrop-blur-xl">
					{/* Header */}
					<div className="flex items-start justify-between pb-6 border-b border-border">
						<div>
							<span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-primary text-primary-foreground">
								{profile.investorStatus === "Not Accredited" ? "INVESTOR PROFILE" : "ACCREDITED INVESTOR"}
							</span>
							<h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-card-foreground mt-2">
								Investor Profile
							</h1>
							<p className="text-xs sm:text-sm text-muted-foreground mt-1">
								Manage your accredited investor qualifications and confidential credentials.
							</p>
						</div>

						<ShieldCheck className="w-6 h-6 text-muted-foreground" />
					</div>

					<section className="flex flex-col items-center gap-8 mt-8">
						{/* Google Account Profile Picture */}
						<div className="flex flex-col items-center text-center">
							<div className="relative">
								<div className="w-28 h-28 rounded-full overflow-hidden bg-muted border-2 border-border shadow-inner flex items-center justify-center">
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										src={displayAvatar}
										alt="Investor Profile Picture"
										className="w-full h-full object-cover"
										onError={(e) => {
											e.currentTarget.src = "/usericon.webp"
										}}
									/>
								</div>
							</div>
							<span className="text-[11px] font-mono text-muted-foreground mt-2.5">
								{user?.imageUrl
									? "Synced from your Google account"
									: "Default investor avatar"}
							</span>
						</div>

						{/* Validation error display */}
						{error && (
							<div className="w-full flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
								<AlertCircle className="w-4 h-4 shrink-0" />
								<span>{error}</span>
							</div>
						)}

						{/* Form Fields */}
						<div className="w-full space-y-4">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
								<div>
									<label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
										First Name <span className="text-destructive">*</span>
									</label>
									<input
										name="firstName"
										required
										value={profile.firstName}
										onChange={handleChange}
										placeholder="e.g. Partha"
										className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring transition"
									/>
								</div>

								<div>
									<label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
										Middle Name
									</label>
									<input
										name="middleName"
										value={profile.middleName}
										onChange={handleChange}
										placeholder="Optional"
										className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring transition"
									/>
								</div>
							</div>

							<div>
								<label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
									Last Name <span className="text-destructive">*</span>
								</label>
								<input
									name="lastName"
									required
									value={profile.lastName}
									onChange={handleChange}
									placeholder="e.g. Suresh"
									className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring transition"
								/>
							</div>

							<div>
								<label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
									Phone Number <span className="text-destructive">*</span>
								</label>
								<input
									name="phone"
									required
									value={profile.phone}
									onChange={handleChange}
									placeholder="+1 (555) 000-0000"
									className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring transition"
								/>
							</div>

							{/* Non-Optional Feature 1: Accredited investor status */}
							<div>
								<label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
									Accredited Investor Status <span className="text-destructive">*</span>
								</label>
								<Select
									value={profile.investorStatus}
									onValueChange={(val) => {
										setError(null)
										setProfile((p) => ({ ...p, investorStatus: val }))
										setHoveredStatus(null)
									}}
									onOpenChange={(open) => {
										if (!open) setHoveredStatus(null)
									}}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select investor status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem
											value="Not Accredited"
											onPointerEnter={() => setHoveredStatus(null)}
											onFocus={() => setHoveredStatus(null)}
										>
											Not Accredited
										</SelectItem>
										{Object.entries(investorStatusDescriptions).map(([val]) => (
											<SelectItem
												key={val}
												value={val}
												onPointerEnter={(e) => handleOptionHover(val, e.currentTarget)}
												onPointerLeave={() => setHoveredStatus(null)}
												onFocus={(e) => handleOptionHover(val, e.currentTarget)}
												onBlur={() => setHoveredStatus(null)}
											>
												{val}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<p className="text-[11px] text-muted-foreground mt-1.5 font-mono">
									Required under SEC Rule 506(c) private placements.
								</p>
							</div>

							{/* Non-Optional Feature 2: Citizenship */}
							<div>
								<label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
									Citizenship <span className="text-destructive">*</span>
								</label>
								<Select
									value={profile.citizenship}
									onValueChange={(val) => {
										setError(null)
										setProfile((p) => ({ ...p, citizenship: val }))
									}}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select citizenship" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="US">US Citizen / US Resident</SelectItem>
										<SelectItem value="Non-US">Non US Citizen</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* Actions */}
						<div className="w-full flex items-center justify-between pt-4 border-t border-border">
							<Button
								onClick={handleSave}
								disabled={saving}
								className="h-11 px-7 rounded-full text-xs font-semibold tracking-wide uppercase transition active:scale-[0.98] shadow-xs cursor-pointer inline-flex items-center gap-2"
							>
								{saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
								<span>{saving ? "Saving to Database..." : "Save Changes"}</span>
							</Button>

							{saved && (
								<div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium border border-emerald-500/20 animate-in fade-in zoom-in-95">
									<Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
									<span>Saved to MongoDB</span>
								</div>
							)}
						</div>
					</section>
				</div>
			</div>

			{/* Non-clickable hovering description dialog rendered via portal */}
			{mounted &&
				hoveredStatus &&
				createPortal(
					<div
						role="tooltip"
						aria-live="polite"
						className="pointer-events-none fixed z-[9999] w-72 sm:w-80 rounded-2xl border border-border/80 bg-popover/95 p-3.5 sm:p-4 text-popover-foreground shadow-2xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-150 ring-1 ring-border/20"
						style={{
							top: `${hoveredStatus.top}px`,
							left: `${hoveredStatus.left}px`,
							transform: hoveredStatus.placement !== "bottom" ? "translateY(-50%)" : "none",
						}}
					>
						<div className="text-xs font-semibold text-foreground mb-1.5">
							{hoveredStatus.value}
						</div>
						<p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
							{hoveredStatus.description}
						</p>
					</div>,
					document.body
				)}
		</main>
	)
}
