# FundVault

**Institutional portfolio portal for limited partners and investment advisors.**

FundVault is a prototype LP/advisor operating platform for private equity portfolios. It connects to GP (General Partner) data feeds and turns them into a single, ILPA-aligned view of every commitment, capital call, distribution, and document — plus the daily workflow tools an advisor actually opens each morning.

> ⚠️ **Prototype status:** This is a front-end MVP prototype. All data is mock/demo data, and all GP API connections are simulated. No real financial data, credentials, or integrations are included. Nothing in this app constitutes investment advice.

---

## Features

### Portals & Access
- **Landing page** with demo access and secure sign-in flow
- **Role-based login** — Limited Partner and Investment Advisor experiences
- **Demo credentials** built in (see below)
- Forgot-password flow, mobile hamburger navigation, fully responsive layout

### Advisor Console
- **Today (Daily Console)** — task queue with priorities and due dates, alerts center (liquidity warnings, NAV movements, feed failures, concentration flags), and a deadline calendar
- **Overview** — firmwide AUM, committed capital, NAV, and distributions across all clients
- **Clients** — searchable client cards and detail pages with fund positions, capital calls, distributions, auto-generated **meeting-prep one-pagers**, and a CRM-style notes log
- **Capital call notice generator** — creates a call, notifies the LP view, and auto-adds a wire-confirmation task
- **Fund Universe** — every position across the book, filterable by strategy

### Analytics (interactive)
- **Cash flow forecast** — 8-quarter projected calls vs. distributions with Base / Conservative / Accelerated scenarios and toggleable series
- **Commitment pacing model** — live sliders for target PE allocation, NAV growth, and deployment rate
- **NAV performance** — quarterly NAV time-series per fund with called-capital overlay
- **Concentration flags** — GP / strategy / vintage exposure vs. policy limits with breach highlighting

### Operations & Compliance
- **Wire verification workflow** — callback-verification policy, flagged-instruction fraud detection, escalation
- **Append-only audit trail**
- **Quarterly statement generator** with preview

### Data Infrastructure
- **GP API Integrations** page — simulated connections (OAuth 2.0, mTLS, API key + HMAC patterns), sync status, sync log, and connect flow
- **Portfolio database schema** reference (positions, capital_activity, nav_history, documents, tasks, wires, audit_log, gp_connections, clients)
- **Document vault** — K-1s, statements, notices, and legal docs with search, filters, and upload

### LP Portal
- Investor dashboard with pending-call banner, fund detail pages with NAV charts, commitment schedule, distribution history, personal document vault, and account settings with working notification toggles

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React (single-file component, hooks only) |
| Charts | Recharts (line + bar, interactive) |
| Styling | Inline styles + embedded CSS (no framework required) |
| Fonts | Fraunces, DM Sans, JetBrains Mono (Google Fonts) |
| State | React `useState` (in-memory; no backend) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm (or pnpm/yarn)

### Setup

```bash
# 1. Scaffold a Vite React app
npm create vite@latest fundvault -- --template react
cd fundvault

# 2. Install dependencies
npm install
npm install recharts

# 3. Replace src/App.jsx with fundvault-advisor.jsx from this repo
#    (rename it to App.jsx or update the import in src/main.jsx)

# 4. Run
npm run dev
```

Open `http://localhost:5173`.

### Demo Credentials

| Role | Email | Password |
|---|---|---|
| Investment Advisor | `advisor@demo.fundvault.com` | `demo1234` |
| Limited Partner | `lp@demo.fundvault.com` | `demo1234` |

You can also enter the advisor console without signing in via **View Demo** on the landing page.

---

## Project Structure

```
fundvault/
├── fundvault-advisor.jsx   # Entire prototype (all screens + mock data)
└── README.md
```

Key sections inside the file:

- `CLIENTS_SEED`, `DOCUMENTS_SEED`, `INITIAL_*` — all mock data
- `HomeScreen`, `LoginScreen` — public pages
- `AdvisorPortal` — Today, Overview, Clients, Funds, Analytics, Documents, Ops, Integrations
- `LpPortal` — investor-facing views
- Shared atoms — `StatCard`, `TabBar`, `Modal`, `ChartBox`, `TopNav`, etc.

---

## Roadmap to Production

- [ ] Real backend (positions, capital activity, NAV history, documents, audit log)
- [ ] Real authentication (SSO/OIDC, MFA) and role-based access control
- [ ] Actual GP data ingestion — note: PE firms generally don't offer public LP APIs; production data flows via negotiated feeds or aggregators (e.g., iCapital, Canoe, +SubscribeHub-style services)
- [ ] PDF generation for statements, reports, and one-pagers
- [ ] Email/notification delivery for call and distribution notices
- [ ] Persistence for tasks, notes, wires, and documents
- [ ] Split single file into components, add tests, add CI

---

## Disclaimer

This software is a demonstration prototype. All firm names, funds, figures, and API endpoints shown are fictional or used illustratively. It is not affiliated with or endorsed by any firm referenced, does not provide investment, legal, or tax advice, and must not be used with real client data in its current form.

## License

MIT — see `LICENSE` (add one before publishing).