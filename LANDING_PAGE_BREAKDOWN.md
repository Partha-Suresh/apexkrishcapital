# Apex Krish Capital — Landing Page Architecture, Text Selection & Positioning Rationale

This document provides a comprehensive, element-by-element architectural breakdown of the **Apex Krish Capital** landing page. For every section, component, text selection, and UI placement, this guide explains:
1. **The Exact UI Positioning & Layout Architecture**
2. **The Exact Selection of Text & Copy**
3. **The Strategic, Psychological, and Financial Rationale** behind each choice.

---

## 1. Global Visual Philosophy & Design System

### A. Non-Slop Institutional Terminal Aesthetic
- **Visual Stance**: Ultra-clean, high-contrast, structured monospace & geometric sans-serif typography with 1px border grids and zero decorative fluff (no floating pastel spheres, gradient blobs, or hollow AI buzzwords).
- **Reasoning**:
  - **High-Net-Worth Psychology**: Accredited investors, family offices, and tech operators evaluate syndicates through a lens of fiduciary discipline, precision, and risk management. 
  - **Terminal Familiarity**: Mimicking the dense, functional aesthetic of *Bloomberg*, *CartaX*, and *Linear* signals algorithmic precision, competence, and transparent capitalization.

### B. Container & Spatial Constraints (`max-w-[960px]`)
- **Positioning**: Main container is horizontally centered with `mx-auto max-w-[960px] px-4 sm:px-6`.
- **Reasoning**:
  - **Optimal Reading Measure**: Constraining the viewport to `960px` prevents wide multi-column layout stretching on 4K monitors, enforcing an optimal line length of 65–75 characters for financial disclosures.
  - **High Information Density**: Enables tight grouping between financial terms (e.g. Valuation, Min Check) and conversion action boxes without forcing the eye to jump across expansive blank canvas.

### C. Typography Token Strategy
- **Headings & Body (`Inter` / `Geist Sans`)**: Crisp sans-serif with tight letter-spacing (`tracking-[-0.04em]` on large titles) delivers modern editorial clarity.
- **Figures & Metadata (`Geist Mono`)**: Monospaced tabular numerals (`tabular-nums`) and uppercase metadata tags.
  - **Reasoning**: Financial tables and live capital counts must align vertically on decimal columns to prevent layout shifts and maintain readability during calculations.

### D. Color Palette & Signal Tokens
- **Monochrome Foundation (`bg-background`, `text-foreground`, `border-border`)**: Eliminates visual noise and keeps the focus entirely on the investment math.
- **Emerald Green Signal (`#10B981` / `text-emerald-500` / `bg-emerald-500/10`)**: Used exclusively for live market status (`Active Offering`), positive carry arbitrage savings (`+$10,000 Kept`), and regulatory verification badges (`Verified Investor`).
  - **Reasoning**: Green is universally associated with liquidity, safety, and capital gain in institutional trading terminals.

---

## 2. Global Floating Navbar (`components/navbar.tsx`)

```
+---------------------------------------------------------------------------------------------------+
|  [Logo] Apex Krish    Offerings    About Us    [Investor Profile / Log in]  [Theme]  [Mobile Menu] |  [ADMIN]
+---------------------------------------------------------------------------------------------------+
```

### UI Positioning & Layout Structure
- **Positioning**: `fixed top-5 md:top-8 left-0 right-0 z-50 flex justify-center px-4 md:px-6 pointer-events-none`.
- **Inner Pill**: Centered `max-w-[840px] w-full rounded-[20px] border border-border/70 bg-background/80 py-2.5 px-5 backdrop-blur-xl shadow-sm pointer-events-auto`.
- **Floating Admin Capsule**: `absolute right-[-100px] top-1/2 -translate-y-1/2` (visible only on desktop for authenticated admins).

### Text Selection & Element Rationale

| Element / Text | Placement | Strategic Rationale |
| :--- | :--- | :--- |
| **`Apex Krish` + Insignia Logo** | Far Left | **Brand Anchoring**: Establishes immediate institutional recognition. `28x28px` compact sizing keeps the bar sleek without dominating vertical screen real estate. |
| **`Offerings` & `About Us`** | Center Nav | **Frictionless Navigation**: Strictly limited to the 2 highest-intent links. Prevents cognitive overload; `Offerings` smooth-scrolls directly to the live deal room (`#offerings`). |
| **`Log in`** (Logged Out) | Right CTA Cluster | **Accredited Gating Cue**: High-contrast capsule button (`bg-primary text-primary-foreground`) invites investors to authenticate and unlock SEC 506(c) restricted data. |
| **`Investor Profile` + Avatar** (Logged In) | Right CTA Cluster | **Investor Status Awareness**: Gives verified syndicate members instant 1-click access to update their accreditation details, citizenship, and phone number. |
| **`Dark / Light Toggle`** | Far Right Pill | **Executive Preference**: Accommodates institutional users reviewing term sheets in dark mode (terminal style) or light mode (standard print memo style). |
| **Floating `Admin` Capsule** | Absolute Offset Right | **Separation of Concerns**: Kept outside the standard investor pill to maintain clean layout symmetry for LPs while giving syndicate managers immediate 1-click access to back-office rosters. |

---

## 3. System Notice Bar (`app/page.tsx`)

```
[ ● (Pulsing Emerald) APEX KRISH CAPITAL · PRIVATE MARKET SYNDICATE ]
```

### UI Positioning & Structure
- **Positioning**: Centered directly beneath the top navigation offset (`pt-24 sm:pt-28 pb-2 text-center`).
- **Styling**: `inline-flex items-center gap-2 rounded border border-border bg-muted/40 px-3 py-1 text-[10.5px] font-mono uppercase tracking-wider`.

### Text Selection & Strategic Rationale
- **Text**: `APEX KRISH CAPITAL · PRIVATE MARKET SYNDICATE`
- **Pulsing Emerald Dot**:
  - **Reasoning**: Instantly communicates a live, operational secondary syndicate desk rather than a static brochure site or passive blog.
  - **Monospace Tagging**: Sets the tone as a specialized institutional allocation channel.

---

## 4. Hero Section & Interactive Syndicate Terminal (`components/HeroSection.tsx`)

The Hero Section is architected in two complementary halves:
1. **The Editorial Conversion Header** (Upper narrative zone)
2. **The Interactive Syndicate Terminal** (Lower financial proof engine)

```
===================================================================================================
                                1. EDITORIAL CONVERSION HEADER
 [ DIRECT SPV ALLOCATIONS / 10% PERFORMANCE CARRY / SEC RULE 506(C) ]

 Frontier private tech investments. At half the industry carry fee.

 While larger players in the private equity market charge fees upwards of 20% of profits,
 we charge half of that (10% carry). You leave it to us to source, diligence, and structure
 direct allocations into the right companies.

 [ Explore Active Allocations -> ]   [ Complete / Update Investor Profile ]

 01 10% carry (vs 20%+ PE)     02 $5,000 accessible min.     03 Direct Delaware SPVs
===================================================================================================
                                2. INTERACTIVE SYNDICATE TERMINAL
 [ SYNDICATE TERMINAL · ALLOCATION LEDGER ]   [ Current SPV: Micro1 | Carry Advantage | Legal Arch ]
 -------------------------------------------------------------------------------------------------
  (Tab 1: Micro1 Term Sheet)       (Tab 2: Carry Ledger)         (Tab 3: SPV Mechanics)
   • $3.7B Valuation                • Select Gain: $50k-$500k     • Delaware Series LLC
   • 10% Carry Fee                  • 20% PE vs 10% Apex Table    • Pro-rata pass-through
   • $5,000 Min Check               • Exact dollar savings        • Zero management fee
   • Sept 30 Deadline               • Net profit retained
===================================================================================================
```

### A. Editorial Conversion Header: Text & Positioning Rationale

#### 1. Monospace Metadata Kicker
- **Text**: `DIRECT SPV ALLOCATIONS / 10% PERFORMANCE CARRY / SEC RULE 506(C)`
- **Position**: Preceding the headline (`text-[11px] font-mono tracking-wider text-muted-foreground uppercase`).
- **Rationale**: Immediately signals the three pillars of the syndicate (Vehicle structure, Economic arbitrage, Legal compliance) within the first 2 seconds of scanning.

#### 2. Primary Headline
- **Text**: *"Frontier private tech investments."* `text-foreground font-semibold` + *"At half the industry carry fee."* `text-muted-foreground font-normal`
- **Position**: Central focal point (`text-4xl sm:text-6xl tracking-[-0.04em] leading-[1.08]`).
- **Rationale**:
  - **Two-Tone Typography**: The high-contrast bold lead hooks the aspirational desire (access to top private tech), while the muted subordinate clause introduces the primary mathematical moat (50% lower carry fee).
  - **Zero Buzzwords**: Avoids vague clichés like "Unlocking the Future of VC"; states the exact asset class and value proposition with complete clarity.

#### 3. Value Proposition Paragraph
- **Text**: *"While larger players in the private equity market charge fees upwards of 20% of profits, we charge half of that (10% carry). You leave it to us to source, diligence, and structure direct allocations into the right companies."*
- **Position**: `text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed`.
- **Rationale**: Solves the two major LP friction points: **Cost** (excessive carry erosion) and **Execution Hassle** (sourcing, secondary transfer restrictions, and legal SPV structuring handled entirely by the GP).

#### 4. Call-to-Action (CTA) Cluster
- **Primary CTA**: `Explore Active Allocations →`
  - **Position**: High-contrast black button (`bg-foreground text-background h-12 px-7 rounded-full text-xs font-semibold uppercase tracking-wider`).
  - **Rationale**: High visual weight attracts the dominant click volume; smooth-scrolls down to the live Micro1 deal card.
- **Secondary CTA**: `Complete Investor Profile` / `Update Investor Profile`
  - **Position**: Outlined pill (`border-border h-12 px-7 rounded-full text-xs font-semibold`).
  - **Rationale**: Dynamic auth-aware button that guides verified syndicate members to keep their profile current.

#### 5. Editorial Trust Strip
- **Position**: 3-column horizontal grid (`pt-3 border-t border-border/70 text-xs font-mono text-muted-foreground`).
- **Text Selection**:
  - `01 10% carry (vs 20%+ PE)` — Economic edge
  - `02 $5,000 accessible min.` — Low barrier to entry
  - `03 Direct Delaware SPVs` — Institutional structural integrity
- **Rationale**: Micro-reinforces key decision factors immediately above the fold for users who scan rather than read paragraphs.

---

### B. Interactive Syndicate Terminal: Text & Positioning Rationale

- **Positioning**: Encapsulated within a full-width terminal card (`rounded-2xl border border-border bg-card overflow-hidden shadow-xs`).
- **Top Segment Switcher**: `SYNDICATE TERMINAL · ALLOCATION LEDGER` header on the left, with 3 tab buttons on the right (`Current SPV: Micro1`, `Carry Advantage Ledger`, `Legal & SPV Architecture`).

#### Tab 1: Current SPV: Micro1 (Live Term Sheet)
- **Position**: Default landing tab in the terminal.
- **Text Elements**:
  - `● ACTIVE SYNDICATION` badge (emerald) + `Series Secondary Equity`.
  - Heading: `Micro1 Inc.` + description of AI engineer vetting infrastructure.
  - **4-Cell Financial Metric Grid**:
    - `Pre-Money Valuation: $3.7B` (Institutional benchmark)
    - `Performance Carry: 10%` (Highlighted in emerald text: *50% below PE standard*)
    - `Minimum Commitment: $5,000` (*USD accredited entry*)
    - `Closing Deadline: Sept 30, 2026` (*$125K allocation cap*)
  - Footnote: *Allocation limit: $125,000 USD (Accredited verification required to commit)* + link to deal room.
- **Rationale**: Provides investors with the essential numbers instantly without forcing them to wade through a 30-page confidential information memorandum (CIM) just to know the entry terms.

#### Tab 2: Carry Advantage Ledger (The Interactive Profit Simulator)
- **Position**: Second tab in the terminal.
- **Interactive UI**:
  - Profit Gain Buttons: `[$50,000]` `[$100,000]` `[$250,000]` `[$500,000] Net Gain`.
  - Top Metric: `+$10,000 USD Kept by LP` (dynamically updates with selection).
  - **Comparison Table**:
    1. *Deal Profit Realized*: Equal across both columns ($100,000).
    2. *Performance Fee Deducted*: Traditional PE (-$20,000 at 20%) vs. Apex Krish (-$10,000 at 10%).
    3. *Net Profit in Your Pocket*: $80,000 (PE) vs. **$90,000 (Apex Krish)**.
- **Rationale**:
  - **Concrete Loss Aversion Psychology**: Investors understand "10% carry" abstractly, but seeing a concrete **+$10,000 to +$50,000 cash savings** makes the syndicate's value proposition undeniable.

#### Tab 3: Legal & SPV Architecture
- **Position**: Third tab in the terminal.
- **Text & 3-Column Layout**:
  - `Delaware Series LLC`: Highlights liability segregation and bankruptcy-remote isolation.
  - `Direct Economic Pass-Through`: Explains pro-rata beneficial ownership and liquidation preferences matching institutional preferred shares.
  - `Pure Carry Model`: Affirms zero management fees on direct syndicated SPVs.
- **Rationale**: Directly addresses legal and compliance due-diligence concerns from family offices and sophisticated angels before they review deal rooms.

---

## 5. Deal Room & Offerings Section (`components/OfferingsSection.tsx`)

```
+---------------------------------------------------------------------------------------------------+
| 01 / PRIVATE SYNDICATE                                                                            |
| Current & Past Offerings                            [ ● Current Deal (1) ]  [ Past Deals (3) ]     |
| Direct SPV allocations into high-conviction rounds                                                |
+---------------------------------------------------------------------------------------------------+
| [ACTIVE OFFERING] Micro1 Inc.                     | PARTICIPATION STATUS                          |
| AI-powered engineer vetting & talent infra.       | [ Verified Investor / Pending / Preview ]     |
|                                                   |                                               |
| Valuation     Funding Goal   Min Check  Accred.   | [ COMMIT CAPITAL ($5,000 - $125,000) ]        |
|  $3.7B           $125K         $5K      506(c)    | [ I'M INTERESTED (Priority Roster)   ]        |
+---------------------------------------------------------------------------------------------------+
```

### UI Positioning & Layout Architecture
- **Positioning**: Section `id="offerings"` with `scroll-mt-24 py-6 space-y-8`.
- **Top Header**: Split layout with Section Title on the left and Deal Filter Tabs on the right (`Current Deal (1)` vs `Past Deals (3)`).
- **Active Deal Card**: Split 12-column grid (`lg:grid-cols-12 gap-8`):
  - **Left 7 Columns**: Deal Overview, Company summary, and 4-column terms grid.
  - **Right 5 Columns**: Real-time Participation Status & Action Console.

### Text Selection & Strategic Rationale

| UI Element | Text / Content | Strategic Rationale |
| :--- | :--- | :--- |
| **Section Kicker** | `01 / PRIVATE SYNDICATE` | **Sequential Hierarchy**: Numbered editorial sections guide the investor methodically down the page. |
| **Filter Switcher** | `● Current Deal (1)` / `Past Deals (3)` | **Clarity on Live Opportunities**: Clearly separates the single active syndicate (Micro1) from past track-record deals (Scale AI, xAI, Neuralink) to prevent investor confusion. |
| **Active Deal Badge** | `Active Offering` (Emerald) + `Direct SPV Equity` | **Live Allocation Urgency**: Reassures the investor that allocations are currently being accepted. |
| **Closing Date Tag** | `Closing: Sept 30, 2026` | **Scarcity & Horizon**: Creates natural calendar urgency around syndicate cap closure. |
| **Key Terms Grid** | `$3.7B Valuation`, `$125K Funding Goal`, `$5K Min Check`, `Accredited 506(c)` | **Instant Scannability**: 4 rounded metric tiles display the critical deal constraints at a glance. |
| **Participation Status Console (Unauthenticated)** | `Public Preview` + `Log in to participate` | **Conversion Gate**: Allows public viewing of the offering while securely requiring authentication before capital can be pledged. |
| **Participation Status Console (Pending)** | `Verification Pending` + Amber banner | **Compliance Feedback**: Informs unverified users that their profile is under manual admin review, protecting SEC 506(c) compliance. |
| **Participation Status Console (Verified)** | `Verified Investor` (Emerald) + Action Buttons | **Frictionless Capital Commitment**: Unlocks the `Commit Capital` and `I'm Interested` direct action buttons for verified LPs. |
| **Primary Action Button** | `Commit Capital` (`size="lg"` / dollar icon) | **Direct Conversion**: Opens the modal to capture binding allocation amounts. |
| **Secondary Action Button** | `I'm Interested` (`variant="outline"`) | **Low-Friction Pipeline**: Captures soft interest from accredited investors who want updates before committing cash. |

### Capital Commitment Modal (`commitModalOpen`)
- **Positioning**: Fixed overlay backdrop with centered card (`max-w-lg rounded-2xl border bg-card p-6 sm:p-7 shadow-xl`).
- **Text & Quick Presets**:
  - Dollar input with `$5,000` minimum validation.
  - Quick Preset Chips: **`$5,000`**, **`$10,000`**, **`$25,000`**, **`$50,000`**.
  - Legal Disclaimer: *"By submitting this commitment, you express binding intent to participate in this SPV subject to receipt of formal subscription agreements and closing verification."*
- **Rationale**: Preset chips speed up mobile and desktop check input, reducing friction during the commitment process.

### Past Track Record Grid (`activeTab === 'past'`)
- **Positioning**: 3-column responsive grid (`grid-cols-1 md:grid-cols-3 gap-4`).
- **Cards & Status Text**:
  - **Scale AI**: Series F SPV · `$14.0B` Valuation · `Distributed`
  - **xAI**: Series B SPV · `$24.0B` Valuation · `Distributed`
  - **Neuralink**: Direct SPV · `$7.0B` Valuation · `Distributed`
- **Rationale**:
  - **Why "Distributed" instead of "Closed"?**: In private equity and venture capital, "Distributed" indicates that capital was deployed, executed, and pro-rata beneficial ownership was successfully distributed to LPs, establishing institutional track record.

---

## 6. Sectors of Conviction (`app/page.tsx` — Section 02)

```
+---------------------------------------------------------------------------------------------------+
| 02 / RESEARCH THESIS                                                                              |
| Sectors of Conviction             Disciplined focus on asymmetric platform shifts across tech.    |
+---------------------------------------------------------------------------------------------------+
| 01 / Intelligence & Autonomous Agents                                                             |
| Foundation Architectures & Applied AI Infrastructure              Historical & Live Marks         |
| Backing category-leading teams building synthetic data...         Micro1 · Scale AI · xAI         |
+---------------------------------------------------------------------------------------------------+
| 02 / Hardware & Scale                                                                             |
| Accelerated Computing & Silicon Systems                           Focus Stage                     |
| Next-generation datacenter interconnects, ASICs...                Series B through Pre-IPO        |
+---------------------------------------------------------------------------------------------------+
| 03 / Frontier Science                                                                             |
| Neural Interfaces & Computational Therapeutics                    Historical Marks                |
| Pioneering brain-computer interfaces (BCI)...                     Neuralink SPV                   |
+---------------------------------------------------------------------------------------------------+
```

### UI Positioning & Layout Architecture
- **Positioning**: Section `id="focus"` with `space-y-8 pt-4`.
- **Layout**: Stacked editorial rows connected with `1px bg-border space-y-px rounded-xl overflow-hidden border border-border`.
- **Row Flexbox**: Left content zone (Sector number, title, thesis summary) + Right alignment block (Historical marks and focus stage).

### Text Selection & Strategic Rationale

| Sector | Selected Copy | Strategic Rationale |
| :--- | :--- | :--- |
| **Section Title** | `02 / RESEARCH THESIS` — `Sectors of Conviction` | **Institutional Gravity**: Positions the syndicate as thesis-driven specialists rather than opportunistic generalists. |
| **Sector 01: Intelligence** | *Foundation Architectures & Applied AI Infrastructure* (Marks: Micro1, Scale AI, xAI) | **Direct Relevance**: Ties the active Micro1 syndicate and past Scale AI deal to a coherent thesis on developer agents and data pipelines. |
| **Sector 02: Hardware** | *Accelerated Computing & Silicon Systems* (Stage: Series B through Pre-IPO) | **Infrastructure Depth**: Demonstrates conviction in the physical compute, ASIC, and thermal layers underpinning the AI surge. |
| **Sector 03: Frontier Science** | *Neural Interfaces & Computational Therapeutics* (Mark: Neuralink SPV) | **Long-Horizon Asymmetry**: Justifies high-conviction deep-tech allocations like Neuralink. |

---

## 7. Fiduciary & Execution Standards (`app/page.tsx` — Section 03)

```
+---------------------------------------------------------------------------------------------------+
| 03 / STRUCTURAL INTEGRITY                                                                         |
| Fiduciary & Execution Standards    How we protect syndicate members and ensure clean ownership.   |
+---------------------------------------------------------------------------------------------------+
| [FileCheck] Rigorous Secondary Diligence      | [Layers] Delaware Ring-Fenced SPVs               |
| Direct verification of board approvals, ROFR  | Every deal is isolated in its own Delaware       |
| waivers, and cap table standings.             | Series LLC (bankruptcy-remote).                  |
+---------------------------------------------------------------------------------------------------+
| [Percent] 10% Pure Carry Alignment            | [Shield] SEC 506(c) Compliance                   |
| Zero management fees; carry capped at 10%     | Strictly structured under SEC Rule 506(c)        |
| (half of industry standard 20%+).             | for verified accredited investors.               |
+---------------------------------------------------------------------------------------------------+
```

### UI Positioning & Layout Architecture
- **Positioning**: Section 03 (`space-y-8 pt-4`).
- **Layout**: 2x2 responsive card grid (`grid grid-cols-1 sm:grid-cols-2 gap-4`).
- **Card Anatomy**: Clean card container (`rounded-xl border border-border bg-card p-6 space-y-3`) with an emerald icon + bold title + descriptive copy.

### Text Selection & Strategic Rationale

| Pillar Card | Copy Selection | Risk/Objection Addressed |
| :--- | :--- | :--- |
| **1. Secondary Diligence** | *"Direct verification of board approvals, company right-of-first-refusal (ROFR) waivers, capitalization table standings, and transfer restriction mechanics prior to capital calls."* | **Secondary Market Risk**: Solves the fear of invalid transfer claims, unapproved secondaries, or company clawbacks. |
| **2. Delaware Ring-Fenced SPVs** | *"Every deal is isolated in its own Delaware Series LLC. Each vehicle is bankruptcy-remote, completely insulating your capital from other portfolio investments."* | **Cross-Liability Risk**: Guarantees that legal or financial issues in one company's SPV cannot touch assets in another. |
| **3. 10% Pure Carry Alignment** | *"We charge zero management fees on direct SPVs and cap our carry fee at 10%—half the standard 20%+ fee. Our economic upside is strictly tied to your net realized gain."* | **Fee Erosion**: Assures LPs that GPs don't profit from idle management fees; rewards only positive investor exits. |
| **4. SEC 506(c) Compliance** | *"All allocations are strictly structured under SEC Rule 506(c) exemptions for verified accredited individuals, family offices, and qualified institutional buyers."* | **Regulatory Risk**: Confirms adherence to US securities law for institutional LP peace of mind. |

---

## 8. Syndicate Desk & Regulatory Footer (`app/page.tsx`)

```
+---------------------------------------------------------------------------------------------------+
| [Mail] info@apexkrishcapital.com    [Phone] +1 (720) 845-6839    [MapPin] New York, NY 10001     |
+---------------------------------------------------------------------------------------------------+
| © 2026 Apex Krish Capital. All Rights Reserved.                                                   |
| Apex Krish Capital provides private market investment opportunities exclusively to accredited     |
| investors under SEC Rule 506(c). Past performance is not indicative of future results...          |
+---------------------------------------------------------------------------------------------------+
```

### UI Positioning & Text Rationale
- **Syndicate Direct Communications Bar**:
  - **Position**: Pre-footer banner (`rounded-xl border border-border bg-card p-6 sm:p-8 font-mono text-xs flex flex-col sm:flex-row items-center justify-between gap-5`).
  - **Copy**:
    - Email: `info@apexkrishcapital.com` (`mailto:`)
    - Phone: `+1 (720) 845-6839` (`tel:`)
    - Office: `New York, NY 10001`
  - **Rationale**: Real phone and physical city anchoring builds tangible credibility for high-value transactions.
- **Footer & SEC 506(c) Disclaimer**:
  - **Position**: Bottom edge (`border-t border-border bg-background py-10 px-4 text-center font-mono text-xs text-muted-foreground space-y-3`).
  - **Statutory Notice**: Clear disclosure that securities involve substantial risk of loss and are restricted to accredited investors.
  - **Rationale**: Ensures complete regulatory compliance under US securities regulations.

---

## 9. Comprehensive Layout & Copy Summary Matrix

| Section / Element | Location in Code | Visual Placement | Text / Copy Chosen | Strategic & Behavioral Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **Floating Nav Bar** | [`components/navbar.tsx`](file:///home/parthasuresh/Cient%20work/my-app/components/navbar.tsx#L28-L121) | `fixed top-5 max-w-[840px]` | Logo, Offerings, About Us, Log In / Profile, Admin pill | Unobtrusive, persistent navigation with dedicated admin routing. |
| **System Notice Kicker** | [`app/page.tsx`](file:///home/parthasuresh/Cient%20work/my-app/app/page.tsx#L18-L24) | Centered above Hero | `● APEX KRISH CAPITAL · PRIVATE MARKET SYNDICATE` | Live secondary desk signal via pulsing emerald indicator. |
| **Hero Headline** | [`components/HeroSection.tsx`](file:///home/parthasuresh/Cient%20work/my-app/components/HeroSection.tsx#L87-L92) | Top Hero (`text-4xl sm:text-6xl`) | *"Frontier private tech investments. At half the industry carry fee."* | Two-tone headline pairing access to elite private tech with the 10% carry fee advantage. |
| **Trust Strip** | [`components/HeroSection.tsx`](file:///home/parthasuresh/Cient%20work/my-app/components/HeroSection.tsx#L137-L150) | Beneath Hero CTAs | `01 10% carry` · `02 $5,000 min` · `03 Delaware SPVs` | 3 quick proof points to reinforce decision criteria above the fold. |
| **Terminal Segment Tabs** | [`components/HeroSection.tsx`](file:///home/parthasuresh/Cient%20work/my-app/components/HeroSection.tsx#L168-L202) | Right side of Terminal header | `Current SPV: Micro1` · `Carry Advantage Ledger` · `Legal Arch` | Interactive proof engine allowing LPs to explore deal terms, calculate savings, and review legal structure. |
| **Carry Comparison Table** | [`components/HeroSection.tsx`](file:///home/parthasuresh/Cient%20work/my-app/components/HeroSection.tsx#L319-L349) | Inside Terminal Tab 2 | 20% PE vs 10% Apex Krish math with profit tier chips | Uses loss aversion math to demonstrate exact dollar gains kept by LPs ($10K–$50K+). |
| **Deal Room Header** | [`components/OfferingsSection.tsx`](file:///home/parthasuresh/Cient%20work/my-app/components/OfferingsSection.tsx#L197-L236) | `id="offerings"` | `01 / PRIVATE SYNDICATE` · `Current Deal (1)` · `Past Deals (3)` | Explicitly isolates the single active round (Micro1) from past track-record deals. |
| **Micro1 Deal Room Card** | [`components/OfferingsSection.tsx`](file:///home/parthasuresh/Cient%20work/my-app/components/OfferingsSection.tsx#L250-L442) | 12-col split card | $3.7B Valuation, $125K Cap, $5K Min, Status Panel | Provides immediate terms access and gated commitment actions. |
| **Past Deals Grid** | [`components/OfferingsSection.tsx`](file:///home/parthasuresh/Cient%20work/my-app/components/OfferingsSection.tsx#L447-L533) | 3-column card deck | Scale AI ($14B), xAI ($24B), Neuralink ($7B) | Builds institutional credibility by showcasing distributed allocations into tier-1 companies. |
| **Sectors of Conviction** | [`app/page.tsx`](file:///home/parthasuresh/Cient%20work/my-app/app/page.tsx#L35-L123) | 3 stacked rows (`id="focus"`) | AI Agents, Accelerated Computing, Frontier Science | Establishes specialized domain expertise and clear investment thesis. |
| **Fiduciary Standards** | [`app/page.tsx`](file:///home/parthasuresh/Cient%20work/my-app/app/page.tsx#L126-L182) | 2x2 grid (`03 / STRUCTURAL INTEGRITY`) | Secondary Diligence, Delaware SPVs, 10% Carry, SEC 506(c) | Addresses and eliminates institutional investor risk objections. |
| **Syndicate Desk Strip** | [`app/page.tsx`](file:///home/parthasuresh/Cient%20work/my-app/app/page.tsx#L185-L202) | Pre-footer box | Email, Phone, NY Office | Real-world physical and direct communication contact points. |
