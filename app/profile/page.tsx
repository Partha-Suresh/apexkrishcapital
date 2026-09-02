"use client"

import React, { useEffect, useState, ChangeEvent } from "react"
import Link from "next/link"
import { Check, ArrowLeft, Camera, User, Phone, ShieldCheck } from "lucide-react"

type Profile = {
	firstName: string
	middleName?: string
	lastName: string
	phone?: string
	avatar?: string
}

const STORAGE_KEY = "myapp:profile"

export default function ProfilePage() {
	const [profile, setProfile] = useState<Profile>({
		firstName: "",
		middleName: "",
		lastName: "",
		phone: "",
		avatar: "",
	})
	const [saved, setSaved] = useState(false)

	useEffect(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY)
			if (raw) setProfile(JSON.parse(raw))
		} catch (e) {
			// ignore
		}
	}, [])

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target
		setProfile((p) => ({ ...p, [name]: value }))
	}

	function handleAvatar(e: ChangeEvent<HTMLInputElement>) {
		const file = e.target.files && e.target.files[0]
		if (!file) return
		const reader = new FileReader()
		reader.onload = () => {
			setProfile((p) => ({ ...p, avatar: reader.result as string }))
		}
		reader.readAsDataURL(file)
	}

	function handleSave() {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
			setSaved(true)
			setTimeout(() => setSaved(false), 2200)
		} catch (e) {
			console.error("Failed to save profile", e)
		}
	}

	return (
		<main className="min-h-screen pt-[120px] md:pt-[160px] pb-20 px-4">
			<div className="max-w-xl mx-auto">
				{/* Top back navigation */}
				<Link
					href="/"
					className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-500 hover:text-zinc-950 transition-colors mb-6"
				>
					<ArrowLeft className="w-3.5 h-3.5" />
					<span>Back to Apex Krish Capital</span>
				</Link>

				{/* Main Card */}
				<div className="rounded-[32px] border border-zinc-200/80 bg-white/95 p-7 sm:p-10 shadow-[0_20px_50px_-15px_rgba(10,10,10,0.08)] backdrop-blur-xl">
					{/* Header */}
					<div className="flex items-start justify-between pb-6 border-b border-zinc-100">
						<div>
							<span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-black text-white">
								ACCREDITED INVESTOR
							</span>
							<h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950 mt-2">
								Investor Profile
							</h1>
							<p className="text-xs sm:text-sm text-zinc-500 mt-1">
								Manage your confidential identity details and contact credentials.
							</p>
						</div>

						<ShieldCheck className="w-6 h-6 text-zinc-400" />
					</div>

					<section className="flex flex-col items-center gap-8 mt-8">
						{/* Avatar Upload Container */}
						<div className="flex flex-col items-center">
							<div className="relative group">
								<div className="w-28 h-28 rounded-full overflow-hidden bg-zinc-100 border-2 border-zinc-200/80 shadow-inner flex items-center justify-center">
									{profile.avatar ? (
										// eslint-disable-next-line @next/next/no-img-element
										<img
											src={profile.avatar}
											alt="Investor Avatar"
											className="w-full h-full object-cover"
										/>
									) : (
										<User className="w-10 h-10 text-zinc-300" />
									)}
								</div>

								<label className="absolute bottom-0 right-0 p-2 rounded-full bg-black text-white shadow-md cursor-pointer hover:bg-zinc-800 transition active:scale-95">
									<Camera className="w-3.5 h-3.5" />
									<input
										type="file"
										accept="image/*"
										onChange={handleAvatar}
										className="sr-only"
									/>
								</label>
							</div>
							<span className="text-[11px] font-mono text-zinc-400 mt-2.5">
								Click camera to update photo
							</span>
						</div>

						{/* Form Fields */}
						<div className="w-full space-y-4">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
								<div>
									<label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">
										First Name
									</label>
									<input
										name="firstName"
										value={profile.firstName}
										onChange={handleChange}
										placeholder="e.g. Partha"
										className="w-full h-11 px-4 rounded-xl border border-zinc-200 bg-zinc-50/60 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-950 focus:outline-none transition"
									/>
								</div>

								<div>
									<label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">
										Middle Name
									</label>
									<input
										name="middleName"
										value={profile.middleName}
										onChange={handleChange}
										placeholder="Optional"
										className="w-full h-11 px-4 rounded-xl border border-zinc-200 bg-zinc-50/60 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-950 focus:outline-none transition"
									/>
								</div>
							</div>

							<div>
								<label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">
									Last Name
								</label>
								<input
									name="lastName"
									value={profile.lastName}
									onChange={handleChange}
									placeholder="e.g. Suresh"
									className="w-full h-11 px-4 rounded-xl border border-zinc-200 bg-zinc-50/60 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-950 focus:outline-none transition"
								/>
							</div>

							<div>
								<label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">
									Phone Number
								</label>
								<input
									name="phone"
									value={profile.phone}
									onChange={handleChange}
									placeholder="+1 (555) 000-0000"
									className="w-full h-11 px-4 rounded-xl border border-zinc-200 bg-zinc-50/60 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-950 focus:outline-none transition"
								/>
							</div>
						</div>

						{/* Actions */}
						<div className="w-full flex items-center justify-between pt-4 border-t border-zinc-100">
							<button
								onClick={handleSave}
								className="h-11 px-7 rounded-full bg-black text-xs font-semibold text-white tracking-wide uppercase transition hover:bg-zinc-800 active:scale-[0.98] shadow-sm cursor-pointer"
							>
								Save Changes
							</button>

							{saved && (
								<div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200 animate-in fade-in zoom-in-95">
									<Check className="w-3.5 h-3.5 text-emerald-600" />
									<span>Profile Updated</span>
								</div>
							)}
						</div>
					</section>
				</div>
			</div>
		</main>
	)
}


