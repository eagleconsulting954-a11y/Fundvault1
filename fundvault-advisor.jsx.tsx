import { useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, ReferenceLine } from "recharts";

// ── CSS (responsive + effects) ───────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:#0b0e14; --surface:#111520; --surface-2:#181d2b; --surface-3:#1f2536;
    --gold:#c9a84c; --gold-dim:#8a6f2e; --gold-glow:rgba(201,168,76,0.12);
    --text:#e8e2d5; --text-dim:#7a7269; --text-bright:#f5f1ea;
    --border:rgba(255,255,255,0.07); --green:#4a9d6e; --red:#b05a4a; --blue:#5a7db0;
  }
  html { scroll-behavior:smooth; }
  body { background:var(--bg); color:var(--text); font-family:'DM Sans',sans-serif;
    font-size:16px; line-height:1.6; -webkit-font-smoothing:antialiased; }
  .grid-overlay { position:fixed; inset:0;
    background-image:linear-gradient(rgba(201,168,76,0.03) 1px,transparent 1px),
      linear-gradient(90deg,rgba(201,168,76,0.03) 1px,transparent 1px);
    background-size:80px 80px; pointer-events:none; z-index:0; }
  button { cursor:pointer; font-family:'DM Sans',sans-serif; }
  input,select,textarea { font-family:'DM Sans',sans-serif; }
  .mono { font-family:'JetBrains Mono',monospace; }
  .input-field { width:100%; background:var(--surface-2); border:1px solid var(--border);
    color:var(--text); padding:13px 16px; font-size:14px; outline:none;
    transition:border-color .25s, box-shadow .25s; }
  .input-field:focus { border-color:var(--gold-dim); box-shadow:0 0 0 3px rgba(201,168,76,0.08); }
  .input-field::placeholder { color:var(--text-dim); }
  @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  .fade-in { animation:fadeIn .4s cubic-bezier(.22,1,.36,1) both; }
  @keyframes glowPulse { 0%,100%{box-shadow:0 0 20px rgba(201,168,76,.08)} 50%{box-shadow:0 0 40px rgba(201,168,76,.22)} }
  @keyframes borderRotate { to{transform:rotate(360deg)} }
  @keyframes dotFlow { 0%{opacity:.2} 30%{opacity:1} 100%{opacity:.2} }
  .sync-dot { animation:dotFlow 1.2s infinite; }
  .tab-btn { position:relative; overflow:hidden; white-space:nowrap; }
  .tab-btn::after { content:''; position:absolute; bottom:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg,transparent,var(--gold),transparent);
    transform:scaleX(0); transition:transform .35s cubic-bezier(.22,1,.36,1); }
  .tab-btn:hover::after { transform:scaleX(.6); }
  .tab-btn.active::after { transform:scaleX(1); }
  .tab-btn::before { content:''; position:absolute; inset:0;
    background:radial-gradient(ellipse at bottom, rgba(201,168,76,.12), transparent 70%);
    opacity:0; transition:opacity .3s; }
  .tab-btn:hover::before, .tab-btn.active::before { opacity:1; }
  .premium-card { position:relative; background:var(--surface); border:1px solid var(--border);
    transition:transform .3s cubic-bezier(.22,1,.36,1), border-color .3s, box-shadow .3s; }
  .premium-card:hover { border-color:var(--gold-dim);
    box-shadow:0 12px 40px rgba(0,0,0,.4), 0 0 24px rgba(201,168,76,.06); transform:translateY(-2px); }

  .px { padding-left:48px; padding-right:48px; }
  .stat-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(210px,1fr)); gap:14px;
    max-width:1400px; margin:28px auto 0; }
  .card-grid { display:grid; gap:16px; }
  .table-scroll { overflow-x:auto; -webkit-overflow-scrolling:touch; }
  .table-scroll table { min-width:720px; width:100%; border-collapse:collapse; }
  .page-title { font-family:'Fraunces',serif; font-weight:300; color:var(--text-bright);
    letter-spacing:-0.03em; line-height:1.1; font-size:clamp(26px,4.5vw,36px); margin-bottom:8px; }
  .hero-title { font-family:'Fraunces',serif; font-weight:300; color:var(--text-bright);
    letter-spacing:-0.04em; line-height:1.05; font-size:clamp(34px,7.5vw,64px); margin-bottom:24px; }
  .nav-desktop { display:flex; gap:0; overflow-x:auto; scrollbar-width:none; }
  .nav-desktop::-webkit-scrollbar { display:none; }
  .nav-burger { display:none; }
  .nav-user-name { display:inline; }
  .top-nav { padding:0 32px; }
  input[type=range] { -webkit-appearance:none; width:100%; height:3px; background:var(--surface-3);
    border-radius:2px; outline:none; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:16px; height:16px;
    border-radius:50%; background:var(--gold); cursor:pointer; border:2px solid var(--bg);
    box-shadow:0 0 8px rgba(201,168,76,.5); }
  input[type=range]::-moz-range-thumb { width:16px; height:16px; border-radius:50%;
    background:var(--gold); cursor:pointer; border:2px solid var(--bg); }
  .toggle-sw { position:relative; width:42px; height:22px; border-radius:11px;
    border:1px solid var(--border); transition:background .25s; flex-shrink:0; }
  .toggle-sw span { position:absolute; top:2px; left:2px; width:16px; height:16px; border-radius:50%;
    transition:transform .25s, background .25s; display:block; }
  .chip-btn { font-size:12px; padding:6px 14px; border:1px solid var(--border);
    background:var(--surface-2); color:var(--text-dim); transition:all .2s; }
  .chip-btn.on { background:var(--gold-glow); border-color:var(--gold-dim); color:var(--gold); }

  @media (max-width: 900px) {
    .px { padding-left:18px; padding-right:18px; }
    .nav-desktop { display:none; }
    .nav-burger { display:block; }
    .nav-user-name { display:none; }
    .top-nav { padding:0 18px; }
    .stat-grid { grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px; }
    .hide-mobile { display:none !important; }
  }
  @media (max-width: 520px) {
    .stat-grid { grid-template-columns:1fr 1fr; }
  }
`;

// ── DATA ─────────────────────────────────────────────────────────
const CLIENTS_SEED = [
  {
    id:1, name:"Harrington Family Office", type:"Family Office",
    aum:42_500_000, risk:"Moderate", advisor:"Sarah Chen",
    accountId:"FV-1029-HFO", custodian:"Northern Trust", taxId:"••-•••4821",
    inception:"2018-04-12", benchmark:"Cambridge PE Index", targetPE:0.25, liquidity:6_200_000,
    funds:[
      {id:101,name:"Sequoia Growth Fund VI",gp:"Sequoia",vintage:2021,strategy:"Venture",committed:5_000_000,called:3_250_000,distributed:420_000,nav:4_180_000,irr:18.4,tvpi:1.42,dpi:0.13,source:"Sequoia GP API"},
      {id:102,name:"Blackstone RE Partners IX",gp:"Blackstone",vintage:2020,strategy:"Real Estate",committed:8_000_000,called:6_100_000,distributed:1_800_000,nav:6_950_000,irr:14.1,tvpi:1.43,dpi:0.30,source:"Blackstone BXConnect"},
      {id:103,name:"Vista Equity Partners VIII",gp:"Vista Equity",vintage:2022,strategy:"Buyout",committed:3_000_000,called:900_000,distributed:0,nav:1_020_000,irr:9.2,tvpi:1.13,dpi:0.00,source:"Vista LP Gateway"},
    ],
    distributions:[
      {date:"2024-03-15",fund:"Blackstone RE Partners IX",type:"Capital Return",amount:1_200_000,ref:"DST-2024-0315-BX"},
      {date:"2024-01-08",fund:"Blackstone RE Partners IX",type:"Income",amount:600_000,ref:"DST-2024-0108-BX"},
      {date:"2023-11-20",fund:"Sequoia Growth Fund VI",type:"Carry",amount:420_000,ref:"DST-2023-1120-SQ"},
    ],
    calls:[
      {date:"2026-07-15",fund:"Vista Equity Partners VIII",purpose:"Portfolio Investment",amount:450_000,ref:"CC-2026-0715-VE",status:"Pending"},
      {date:"2024-04-10",fund:"Sequoia Growth Fund VI",purpose:"Follow-on Investment",amount:750_000,ref:"CC-2024-0410-SQ",status:"Funded"},
      {date:"2024-02-14",fund:"Blackstone RE Partners IX",purpose:"Acquisition",amount:800_000,ref:"CC-2024-0214-BX",status:"Funded"},
    ],
  },
  {
    id:2, name:"Meridian Endowment Fund", type:"Endowment",
    aum:120_000_000, risk:"Conservative", advisor:"Sarah Chen",
    accountId:"FV-1044-MEF", custodian:"State Street", taxId:"••-•••9310",
    inception:"2015-09-01", benchmark:"NCREIF + 300bps", targetPE:0.30, liquidity:14_500_000,
    funds:[
      {id:201,name:"KKR Americas XII",gp:"KKR",vintage:2019,strategy:"Buyout",committed:15_000_000,called:13_500_000,distributed:4_200_000,nav:14_800_000,irr:16.8,tvpi:1.41,dpi:0.31,source:"KKR Investor API"},
      {id:202,name:"Andreessen Horowitz Bio Fund III",gp:"a16z",vintage:2021,strategy:"Venture",committed:5_000_000,called:2_250_000,distributed:0,nav:2_610_000,irr:11.3,tvpi:1.16,dpi:0.00,source:"a16z LP Portal API"},
      {id:203,name:"Brookfield Infrastructure IV",gp:"Brookfield",vintage:2020,strategy:"Infrastructure",committed:10_000_000,called:7_800_000,distributed:2_100_000,nav:8_420_000,irr:12.6,tvpi:1.35,dpi:0.27,source:"Brookfield Connect"},
      {id:204,name:"TPG Growth VI",gp:"TPG",vintage:2022,strategy:"Growth Equity",committed:6_000_000,called:1_800_000,distributed:0,nav:1_940_000,irr:7.9,tvpi:1.08,dpi:0.00,source:"TPG Data Feed"},
    ],
    distributions:[
      {date:"2024-05-20",fund:"KKR Americas XII",type:"Capital Return",amount:2_500_000,ref:"DST-2024-0520-KK"},
      {date:"2024-05-20",fund:"Brookfield Infrastructure IV",type:"Income",amount:800_000,ref:"DST-2024-0520-BF"},
      {date:"2024-02-10",fund:"KKR Americas XII",type:"Carry",amount:1_700_000,ref:"DST-2024-0210-KK"},
      {date:"2023-12-15",fund:"Brookfield Infrastructure IV",type:"Capital Return",amount:1_300_000,ref:"DST-2023-1215-BF"},
    ],
    calls:[
      {date:"2026-07-10",fund:"TPG Growth VI",purpose:"Portfolio Investment",amount:900_000,ref:"CC-2026-0710-TP",status:"Pending"},
      {date:"2024-05-01",fund:"Andreessen Horowitz Bio Fund III",purpose:"New Investment",amount:750_000,ref:"CC-2024-0501-AH",status:"Funded"},
    ],
  },
  {
    id:3, name:"Castellano UHNW", type:"Individual",
    aum:28_000_000, risk:"Aggressive", advisor:"Marcus Webb",
    accountId:"FV-1067-CAS", custodian:"BNY Mellon", taxId:"••-•••2277",
    inception:"2020-01-20", benchmark:"MSCI World + 500bps", targetPE:0.35, liquidity:1_800_000,
    funds:[
      {id:301,name:"Tiger Global PIP XIV",gp:"Tiger Global",vintage:2022,strategy:"Venture",committed:3_000_000,called:1_200_000,distributed:0,nav:1_130_000,irr:-3.1,tvpi:0.94,dpi:0.00,source:"Tiger LP Feed"},
      {id:302,name:"Carlyle Europe IV",gp:"Carlyle",vintage:2021,strategy:"Buyout",committed:5_000_000,called:3_900_000,distributed:950_000,nav:4_310_000,irr:13.7,tvpi:1.35,dpi:0.24,source:"Carlyle CLEAR API"},
    ],
    distributions:[
      {date:"2024-04-30",fund:"Carlyle Europe IV",type:"Capital Return",amount:950_000,ref:"DST-2024-0430-CG"},
    ],
    calls:[
      {date:"2026-07-08",fund:"Tiger Global PIP XIV",purpose:"New Investment",amount:600_000,ref:"CC-2026-0708-TG",status:"Pending"},
      {date:"2024-03-22",fund:"Carlyle Europe IV",purpose:"Add-on Acquisition",amount:1_100_000,ref:"CC-2024-0322-CG",status:"Funded"},
    ],
  },
  {
    id:4, name:"Oduya Foundation", type:"Foundation",
    aum:67_000_000, risk:"Moderate", advisor:"Marcus Webb",
    accountId:"FV-1081-ODF", custodian:"Northern Trust", taxId:"••-•••6604",
    inception:"2017-06-30", benchmark:"Cambridge PE Index", targetPE:0.28, liquidity:5_100_000,
    funds:[
      {id:401,name:"Warburg Pincus XIV",gp:"Warburg Pincus",vintage:2020,strategy:"Buyout",committed:8_000_000,called:6_400_000,distributed:1_100_000,nav:7_240_000,irr:15.2,tvpi:1.30,dpi:0.17,source:"Warburg LP API"},
      {id:402,name:"General Atlantic Growth III",gp:"General Atlantic",vintage:2021,strategy:"Growth Equity",committed:5_000_000,called:2_750_000,distributed:0,nav:3_050_000,irr:10.8,tvpi:1.11,dpi:0.00,source:"GA Investor Hub"},
      {id:403,name:"Ares Real Estate Fund V",gp:"Ares",vintage:2022,strategy:"Real Estate",committed:6_000_000,called:2_100_000,distributed:0,nav:2_180_000,irr:5.4,tvpi:1.04,dpi:0.00,source:"Ares Data Bridge"},
    ],
    distributions:[
      {date:"2024-06-01",fund:"Warburg Pincus XIV",type:"Capital Return",amount:700_000,ref:"DST-2024-0601-WP"},
      {date:"2024-03-10",fund:"Warburg Pincus XIV",type:"Income",amount:400_000,ref:"DST-2024-0310-WP"},
    ],
    calls:[
      {date:"2026-07-20",fund:"Ares Real Estate Fund V",purpose:"Acquisition",amount:1_050_000,ref:"CC-2026-0720-AR",status:"Notice Sent"},
      {date:"2024-05-15",fund:"General Atlantic Growth III",purpose:"Portfolio Investment",amount:500_000,ref:"CC-2024-0515-GA",status:"Funded"},
    ],
  },
];

const DEMO_ACCOUNTS = {
  "advisor@demo.fundvault.com": { password:"demo1234", role:"advisor" },
  "lp@demo.fundvault.com":      { password:"demo1234", role:"lp" },
};

const INITIAL_INTEGRATIONS = [
  {id:"bx", firm:"Blackstone", product:"BXConnect LP API", status:"connected", lastSync:"2026-07-01 06:12 UTC", records:1284, env:"Production", auth:"OAuth 2.0", scopes:["positions:read","capital_activity:read","documents:read"], endpoint:"api.bxconnect.blackstone.com/v3"},
  {id:"kkr", firm:"KKR", product:"KKR Investor Data API", status:"connected", lastSync:"2026-07-01 05:58 UTC", records:940, env:"Production", auth:"OAuth 2.0 + mTLS", scopes:["nav:read","capital_activity:read"], endpoint:"investor-api.kkr.com/v2"},
  {id:"carlyle", firm:"Carlyle", product:"CLEAR Data Feed", status:"connected", lastSync:"2026-06-30 22:41 UTC", records:512, env:"Production", auth:"API Key + HMAC", scopes:["positions:read","statements:read"], endpoint:"clear.carlyle.com/api/v1"},
  {id:"vista", firm:"Vista Equity", product:"Vista LP Gateway", status:"error", lastSync:"2026-06-28 14:03 UTC", records:388, env:"Production", auth:"OAuth 2.0", scopes:["positions:read"], endpoint:"lpgateway.vistaequity.com/v2", error:"Token expired — re-authentication required"},
  {id:"a16z", firm:"Andreessen Horowitz", product:"a16z LP Portal API", status:"connected", lastSync:"2026-07-01 04:20 UTC", records:203, env:"Production", auth:"API Key", scopes:["nav:read","capital_activity:read"], endpoint:"lp-api.a16z.com/v1"},
  {id:"brookfield", firm:"Brookfield", product:"Brookfield Connect", status:"syncing", lastSync:"in progress", records:766, env:"Production", auth:"OAuth 2.0", scopes:["positions:read","capital_activity:read","nav:read"], endpoint:"connect.brookfield.com/api/v4"},
  {id:"warburg", firm:"Warburg Pincus", product:"Warburg LP API", status:"connected", lastSync:"2026-06-30 20:15 UTC", records:451, env:"Production", auth:"OAuth 2.0", scopes:["positions:read","documents:read"], endpoint:"lp.warburgpincus.com/api/v2"},
  {id:"ares", firm:"Ares Management", product:"Ares Data Bridge", status:"pending", lastSync:"never", records:0, env:"Sandbox", auth:"API Key", scopes:["positions:read"], endpoint:"databridge.aresmgmt.com/v1"},
];

const AVAILABLE_INTEGRATIONS = [
  {firm:"TPG", product:"TPG Data Feed", auth:"OAuth 2.0"},
  {firm:"Apollo Global", product:"Apollo Investor API", auth:"OAuth 2.0 + mTLS"},
  {firm:"Sequoia Capital", product:"Sequoia GP API", auth:"API Key"},
  {firm:"General Atlantic", product:"GA Investor Hub", auth:"OAuth 2.0"},
  {firm:"Tiger Global", product:"Tiger LP Feed", auth:"API Key + HMAC"},
  {firm:"iCapital", product:"iCapital Network API", auth:"OAuth 2.0"},
];

const SYNC_LOG = [
  {ts:"2026-07-01 06:12:04", firm:"Blackstone", event:"Full sync completed", detail:"1,284 records · 3 new capital activity events", level:"ok"},
  {ts:"2026-07-01 05:58:31", firm:"KKR", event:"Incremental sync", detail:"940 records · NAV updated for 2 funds", level:"ok"},
  {ts:"2026-07-01 04:20:12", firm:"a16z", event:"Incremental sync", detail:"203 records · no changes", level:"ok"},
  {ts:"2026-06-30 22:41:55", firm:"Carlyle", event:"Full sync completed", detail:"512 records · 1 new distribution notice", level:"ok"},
  {ts:"2026-06-30 20:15:09", firm:"Warburg Pincus", event:"Document sync", detail:"4 new documents ingested (Q2 statements)", level:"ok"},
  {ts:"2026-06-28 14:03:22", firm:"Vista Equity", event:"Sync failed", detail:"401 Unauthorized — OAuth token expired", level:"error"},
];

const INITIAL_TASKS = [
  {id:1,due:"2026-07-08",priority:"high",client:"Castellano UHNW",title:"Wire confirmation — Tiger Global call CC-2026-0708-TG",detail:"$600,000 due · liquidity buffer thin, confirm funding source",tag:"Capital Call",done:false},
  {id:2,due:"2026-07-10",priority:"high",client:"Meridian Endowment Fund",title:"Wire confirmation — TPG Growth VI call CC-2026-0710-TP",detail:"$900,000 due · standing instructions on file",tag:"Capital Call",done:false},
  {id:3,due:"2026-07-03",priority:"high",client:"—",title:"Re-authenticate Vista LP Gateway feed",detail:"OAuth token expired 06/28 — positions stale for 3 days",tag:"Data Feed",done:false},
  {id:4,due:"2026-07-15",priority:"med",client:"Harrington Family Office",title:"Wire confirmation — Vista call CC-2026-0715-VE",detail:"$450,000 due",tag:"Capital Call",done:false},
  {id:5,due:"2026-07-11",priority:"med",client:"Oduya Foundation",title:"Countersign Ares side letter amendment",detail:"Doc awaiting signature (DOC-2026-0629-AR)",tag:"Document",done:false},
  {id:6,due:"2026-07-14",priority:"med",client:"Meridian Endowment Fund",title:"Q2 review meeting prep",detail:"Meeting 07/16 · generate one-pager and pacing update",tag:"Meeting",done:false},
  {id:7,due:"2026-07-21",priority:"low",client:"Harrington Family Office",title:"Send Q2 capital account statement",detail:"Ready once Blackstone Q2 NAV posts",tag:"Reporting",done:false},
  {id:8,due:"2026-06-30",priority:"med",client:"Castellano UHNW",title:"Follow up on missing 2025 K-1 (Tiger Global)",detail:"GP promised delivery by 06/27 — escalate",tag:"Tax",done:true},
];

const INITIAL_ALERTS = [
  {id:1,ts:"2026-07-01 06:14",severity:"warn",title:"Liquidity warning — Castellano UHNW",detail:"Pending call of $600K vs. $1.8M liquid reserve; post-call buffer falls below the 5% policy threshold."},
  {id:2,ts:"2026-07-01 06:12",severity:"info",title:"New capital activity — Blackstone feed",detail:"3 new events ingested for Blackstone RE Partners IX."},
  {id:3,ts:"2026-06-30 22:41",severity:"info",title:"New distribution notice — Carlyle Europe IV",detail:"Notice ingested via CLEAR feed; pending advisor review."},
  {id:4,ts:"2026-06-28 14:03",severity:"error",title:"Feed failure — Vista LP Gateway",detail:"401 Unauthorized. NAV and positions stale since 06/28."},
  {id:5,ts:"2026-06-27 09:00",severity:"warn",title:"NAV movement — Tiger Global PIP XIV",detail:"Quarterly NAV marked down 6.2% vs. prior quarter (threshold: 5%)."},
  {id:6,ts:"2026-06-25 11:30",severity:"warn",title:"Concentration flag — Meridian Endowment",detail:"KKR exposure at 41.7% of committed capital, above 35% single-GP policy limit."},
];

const DEADLINES = [
  {date:"2026-07-03",label:"Vista feed re-auth (data stale)",type:"Ops",client:"—"},
  {date:"2026-07-08",label:"Capital call due — Tiger Global ($600K)",type:"Capital Call",client:"Castellano UHNW"},
  {date:"2026-07-10",label:"Capital call due — TPG Growth VI ($900K)",type:"Capital Call",client:"Meridian Endowment"},
  {date:"2026-07-15",label:"Capital call due — Vista VIII ($450K)",type:"Capital Call",client:"Harrington FO"},
  {date:"2026-07-16",label:"Q2 review meeting — Meridian Endowment",type:"Meeting",client:"Meridian Endowment"},
  {date:"2026-07-20",label:"Capital call due — Ares RE V ($1.05M)",type:"Capital Call",client:"Oduya Foundation"},
  {date:"2026-07-31",label:"Q2 capital account statements out",type:"Reporting",client:"All clients"},
  {date:"2026-08-15",label:"Extended K-1 season — final GP deliveries",type:"Tax",client:"All clients"},
  {date:"2026-09-10",label:"Brookfield annual LP meeting (NYC)",type:"Meeting",client:"Meridian Endowment"},
  {date:"2026-09-30",label:"Q3 valuation window opens",type:"Reporting",client:"All clients"},
];

const DOCUMENTS_SEED = [
  {id:"DOC-2026-0630-BX",name:"Q2 2026 Capital Account Statement",fund:"Blackstone RE Partners IX",client:"Harrington Family Office",type:"Statement",period:"Q2 2026",ingested:"2026-06-30",source:"BXConnect"},
  {id:"DOC-2026-0629-AR",name:"Side Letter Amendment No. 2",fund:"Ares Real Estate Fund V",client:"Oduya Foundation",type:"Legal",period:"—",ingested:"2026-06-29",source:"Manual Upload"},
  {id:"DOC-2026-0628-KK",name:"Q2 2026 Quarterly Report",fund:"KKR Americas XII",client:"Meridian Endowment Fund",type:"Quarterly Report",period:"Q2 2026",ingested:"2026-06-28",source:"KKR API"},
  {id:"DOC-2026-0615-WP",name:"Capital Call Notice CC-2026-0720-AR",fund:"Ares Real Estate Fund V",client:"Oduya Foundation",type:"Call Notice",period:"—",ingested:"2026-06-15",source:"Ares Data Bridge"},
  {id:"DOC-2026-0412-SQ",name:"2025 Schedule K-1 (Final)",fund:"Sequoia Growth Fund VI",client:"Harrington Family Office",type:"Tax / K-1",period:"FY 2025",ingested:"2026-04-12",source:"Sequoia GP API"},
  {id:"DOC-2026-0409-CG",name:"2025 Schedule K-1 (Final)",fund:"Carlyle Europe IV",client:"Castellano UHNW",type:"Tax / K-1",period:"FY 2025",ingested:"2026-04-09",source:"CLEAR Feed"},
  {id:"DOC-2026-0330-BF",name:"Q1 2026 Distribution Notice",fund:"Brookfield Infrastructure IV",client:"Meridian Endowment Fund",type:"Distribution Notice",period:"Q1 2026",ingested:"2026-03-30",source:"Brookfield Connect"},
  {id:"DOC-2021-0512-KK",name:"Limited Partnership Agreement",fund:"KKR Americas XII",client:"Meridian Endowment Fund",type:"Legal",period:"—",ingested:"2021-05-12",source:"Manual Upload"},
  {id:"DOC-2022-0301-VE",name:"Subscription Agreement",fund:"Vista Equity Partners VIII",client:"Harrington Family Office",type:"Legal",period:"—",ingested:"2022-03-01",source:"Manual Upload"},
];

const INITIAL_WIRES = [
  {id:"WR-2026-0708",date:"2026-07-08",client:"Castellano UHNW",fund:"Tiger Global PIP XIV",amount:600_000,bank:"First Republic ····8841",status:"Callback Required",note:"New wire instructions received 06/30 — must verify via known-number callback before release."},
  {id:"WR-2026-0710",date:"2026-07-10",client:"Meridian Endowment Fund",fund:"TPG Growth VI",amount:900_000,bank:"State Street ····2210",status:"Verified",note:"Standing instructions, verified 2026-01-15. No changes."},
  {id:"WR-2026-0715",date:"2026-07-15",client:"Harrington Family Office",fund:"Vista Equity Partners VIII",amount:450_000,bank:"Northern Trust ····5137",status:"Verified",note:"Standing instructions, verified 2025-11-02."},
  {id:"WR-2026-0720",date:"2026-07-20",client:"Oduya Foundation",fund:"Ares Real Estate Fund V",amount:1_050_000,bank:"UNKNOWN — new instructions",status:"Flagged",note:"Instruction email domain differs from GP records (aresmgmt-payments.com vs aresmgmt.com). Treat as potential fraud until callback-verified."},
];

const AUDIT_SEED = [
  {ts:"2026-07-01 09:14:22",user:"schen",action:"VIEW",target:"Client: Castellano UHNW",detail:"Opened liquidity alert"},
  {ts:"2026-07-01 08:52:10",user:"system",action:"INGEST",target:"Feed: Blackstone BXConnect",detail:"3 capital activity records created"},
  {ts:"2026-06-30 17:31:44",user:"mwebb",action:"UPLOAD",target:"DOC-2026-0629-AR",detail:"Side letter amendment uploaded to vault"},
  {ts:"2026-06-30 16:05:09",user:"schen",action:"EXPORT",target:"Client: Meridian Endowment Fund",detail:"Generated Q2 pre-meeting report (PDF)"},
  {ts:"2026-06-30 11:48:33",user:"mwebb",action:"UPDATE",target:"Wire WR-2026-0720",detail:"Status set to Flagged — domain mismatch"},
  {ts:"2026-06-28 14:03:22",user:"system",action:"ERROR",target:"Feed: Vista LP Gateway",detail:"OAuth token expired — sync aborted"},
  {ts:"2026-06-27 10:20:15",user:"schen",action:"VERIFY",target:"Wire WR-2026-0710",detail:"Callback verification logged"},
];

const NAV_HISTORY = {};
CLIENTS_SEED.forEach(c=>c.funds.forEach(f=>{
  const qs=["Q1 25","Q2 25","Q3 25","Q4 25","Q1 26","Q2 26"];
  const g=(f.irr/100)/4;
  const v=f.nav/Math.pow(1+(g||0.01),5);
  NAV_HISTORY[f.id]=qs.map((q,i)=>({
    q,
    nav:i===5?f.nav:Math.round(v*Math.pow(1+(g||0.01),i)*(1+((i*7)%5-2)*0.004)),
    called:Math.round(f.called*(0.55+i*0.09)),
  }));
}));

// ── HELPERS ──────────────────────────────────────────────────────
const fmt=n=>"$"+Number(n).toLocaleString("en-US");
const fmtM=n=>"$"+(n/1_000_000).toFixed(1)+"M";
const fmtDate=s=>new Date(s).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
const TODAY=new Date("2026-07-01");
const daysUntil=s=>Math.ceil((new Date(s)-TODAY)/86400000);
const uid=()=>Math.random().toString(36).slice(2,8).toUpperCase();

// ── ATOMS ────────────────────────────────────────────────────────
function GridOverlay(){return <div className="grid-overlay"/>;}
function LogoMark({onClick}){
  return <button onClick={onClick} style={{background:"none",border:"none",fontFamily:"Fraunces,serif",
    fontSize:20,fontWeight:600,color:"var(--text-bright)",letterSpacing:"-0.03em"}}>
    Fund<span style={{color:"var(--gold)"}}>Vault</span></button>;
}
function Badge({type}){
  if(type==="advisor")return <span style={{fontSize:10,background:"var(--gold)",color:"var(--bg)",padding:"2px 8px",borderRadius:2,letterSpacing:"0.08em",fontWeight:500}}>IA</span>;
  return <span style={{fontSize:10,background:"var(--surface-2)",border:"1px solid var(--border)",padding:"2px 8px",color:"var(--text-dim)",letterSpacing:"0.08em"}}>LP</span>;
}
function StatusPill({status}){
  const map={
    connected:{c:"var(--green)",bg:"rgba(74,157,110,.12)",b:"rgba(74,157,110,.35)",label:"● Connected"},
    error:{c:"var(--red)",bg:"rgba(176,90,74,.12)",b:"rgba(176,90,74,.35)",label:"● Error"},
    syncing:{c:"var(--gold)",bg:"rgba(201,168,76,.12)",b:"var(--gold-dim)",label:"◌ Syncing"},
    pending:{c:"var(--text-dim)",bg:"var(--surface-2)",b:"var(--border)",label:"○ Pending"},
    Funded:{c:"var(--green)",bg:"rgba(74,157,110,.12)",b:"rgba(74,157,110,.35)",label:"Funded"},
    Pending:{c:"var(--gold)",bg:"rgba(201,168,76,.12)",b:"var(--gold-dim)",label:"Pending"},
    "Notice Sent":{c:"var(--blue)",bg:"rgba(90,125,176,.12)",b:"rgba(90,125,176,.35)",label:"Notice Sent"},
    Verified:{c:"var(--green)",bg:"rgba(74,157,110,.12)",b:"rgba(74,157,110,.35)",label:"✓ Verified"},
    "Callback Required":{c:"var(--gold)",bg:"rgba(201,168,76,.12)",b:"var(--gold-dim)",label:"Callback Required"},
    Flagged:{c:"var(--red)",bg:"rgba(176,90,74,.12)",b:"rgba(176,90,74,.35)",label:"⚠ Flagged"},
  };
  const s=map[status]||map.pending;
  return <span className={status==="syncing"?"sync-dot":""} style={{fontSize:10,letterSpacing:"0.06em",padding:"3px 10px",color:s.c,background:s.bg,border:`1px solid ${s.b}`,whiteSpace:"nowrap"}}>{s.label}</span>;
}
function StatCard({label,value,note,highlight,color}){
  return <div className="premium-card" style={{padding:"20px 20px"}}>
    <div style={{fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--text-dim)",marginBottom:8}}>{label}</div>
    <div style={{fontFamily:"Fraunces,serif",fontSize:"clamp(20px,3vw,28px)",fontWeight:300,color:color||(highlight?"var(--gold)":"var(--text-bright)"),lineHeight:1,marginBottom:4}}>{value}</div>
    {note&&<div style={{fontSize:11,color:"var(--text-dim)"}}>{note}</div>}
  </div>;
}
function SectionHeader({title,count}){
  return <div className="px" style={{display:"flex",alignItems:"center",justifyContent:"space-between",
    paddingTop:20,paddingBottom:20,borderBottom:"1px solid var(--border)",maxWidth:1400,margin:"0 auto"}}>
    <div style={{fontSize:11,letterSpacing:"0.16em",textTransform:"uppercase",color:"var(--gold)",display:"flex",alignItems:"center",gap:12}}>
      <span style={{display:"block",width:20,height:1,background:"var(--gold)"}}/>{title}</div>
    {count!==undefined&&<div style={{fontSize:12,color:"var(--text-dim)"}}>{count}</div>}
  </div>;
}
function GoldBtn({children,onClick,small,outline,full,disabled,danger}){
  return <button onClick={onClick} disabled={disabled} style={{
    background:outline?"transparent":danger?"var(--red)":"var(--gold)",
    color:outline?(danger?"var(--red)":"var(--gold)"):"var(--bg)",
    border:outline?`1px solid ${danger?"var(--red)":"var(--gold)"}`:"none",
    padding:small?"8px 16px":"13px 24px",fontSize:small?12:14,fontWeight:500,
    width:full?"100%":undefined,opacity:disabled?0.5:1,transition:"opacity .2s"}}
    onMouseEnter={e=>{if(!disabled)e.currentTarget.style.opacity="0.85";}}
    onMouseLeave={e=>{if(!disabled)e.currentTarget.style.opacity="1";}}>{children}</button>;
}
function EmptyState({msg}){return <div style={{textAlign:"center",padding:"56px 24px",color:"var(--text-dim)",fontSize:14}}>{msg}</div>;}
function ProgressBar({pct,color}){
  return <div style={{display:"flex",alignItems:"center",gap:8}}>
    <div style={{flex:1,height:3,background:"var(--surface-2)",borderRadius:2,overflow:"hidden"}}>
      <div style={{height:"100%",width:`${Math.min(pct,100)}%`,background:color||"linear-gradient(90deg,var(--gold-dim),var(--gold))",borderRadius:2,transition:"width .8s cubic-bezier(.22,1,.36,1)"}}/>
    </div>
    <span style={{fontSize:11,color:"var(--text-dim)",minWidth:32,textAlign:"right"}}>{pct}%</span>
  </div>;
}
const TH=({children,right})=><th style={{fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--text-dim)",
  textAlign:right?"right":"left",padding:"12px 14px",borderBottom:"1px solid var(--border)",fontWeight:400,whiteSpace:"nowrap"}}>{children}</th>;
const TD=({children,right,bright,green,red,mono,style:s})=><td className={mono?"mono":""} style={{padding:13,
  borderBottom:"1px solid rgba(255,255,255,0.04)",fontSize:mono?12:14,verticalAlign:"middle",
  textAlign:right?"right":"left",fontVariantNumeric:right?"tabular-nums":undefined,
  color:red?"var(--red)":green?"var(--green)":bright?"var(--text-bright)":undefined,...s}}>{children}</td>;
function TR({children,onClick}){
  const [h,setH]=useState(false);
  return <tr onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} onClick={onClick}
    style={{background:h?"rgba(201,168,76,.04)":"transparent",cursor:onClick?"pointer":"default",transition:"background .2s"}}>{children}</tr>;
}
function Toast({msg}){
  if(!msg)return null;
  return <div style={{position:"fixed",bottom:24,right:24,maxWidth:"calc(100vw - 48px)",
    background:"var(--gold)",color:"var(--bg)",padding:"12px 24px",fontSize:13,fontWeight:500,zIndex:9999,
    animation:"fadeIn .3s ease",boxShadow:"0 8px 30px rgba(201,168,76,.3)"}}>{msg}</div>;
}
function TabBar({tabs,active,onSelect}){
  return <div style={{display:"flex",borderBottom:"1px solid var(--border)",overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
    {tabs.map(([k,label])=>(
      <button key={k} onClick={()=>onSelect(k)} className={`tab-btn ${active===k?"active":""}`}
        style={{padding:"14px 18px",fontSize:13,background:"none",border:"none",
          color:active===k?"var(--gold)":"var(--text-dim)",transition:"color .25s",marginBottom:-1,
          fontWeight:active===k?500:400}}>{label}</button>
    ))}
  </div>;
}
function Modal({children,onClose,wide}){
  return <div style={{position:"fixed",inset:0,background:"rgba(11,14,20,.85)",backdropFilter:"blur(6px)",
    zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
    <div onClick={e=>e.stopPropagation()} className="fade-in" style={{background:"var(--surface)",
      border:"1px solid var(--gold-dim)",maxWidth:wide?720:480,width:"100%",maxHeight:"88vh",overflowY:"auto",
      padding:"clamp(20px,4vw,36px)",boxShadow:"0 24px 80px rgba(0,0,0,.6)"}}>{children}</div>
  </div>;
}
function ChartBox({title,children,h=260,right}){
  return <div className="premium-card" style={{padding:"clamp(14px,2.5vw,24px)"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8,marginBottom:16}}>
      <div style={{fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--gold)"}}>{title}</div>
      {right}
    </div>
    <div style={{height:h}}>{children}</div>
  </div>;
}
const tooltipStyle={background:"#181d2b",border:"1px solid rgba(201,168,76,.3)",fontSize:12,color:"#e8e2d5"};
function Footer({label}){
  return <footer className="px" style={{paddingTop:32,paddingBottom:32,borderTop:"1px solid var(--border)",
    display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"auto",gap:12,flexWrap:"wrap"}}>
    <div style={{fontFamily:"Fraunces,serif",fontSize:14}}>Fund<span style={{color:"var(--gold)"}}>Vault</span></div>
    <div style={{fontSize:11,color:"var(--text-dim)"}}>{label||"ILPA-aligned reporting"}</div>
  </footer>;
}
function PageHead({kicker,title,sub,children}){
  return <div className="px" style={{paddingTop:40,maxWidth:1400,margin:"0 auto"}}>
    <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
      <div style={{minWidth:0}}>
        <div style={{fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--text-dim)",marginBottom:10}}>{kicker}</div>
        <h1 className="page-title">{title}</h1>
        {sub&&<p style={{fontSize:14,color:"var(--text-dim)"}}>{sub}</p>}
      </div>
      {children}
    </div>
  </div>;
}
const Stats=({children})=><div className="stat-grid px">{children}</div>;
const Wrap=({children,style:s})=><div className="px" style={{maxWidth:1400,margin:"0 auto",paddingTop:24,paddingBottom:48,...s}}>{children}</div>;
const TabWrap=({children})=><div className="px" style={{maxWidth:1400,margin:"28px auto 0"}}>{children}</div>;
function Chip({on,onClick,children}){return <button className={`chip-btn ${on?"on":""}`} onClick={onClick}>{children}</button>;}
function Slider({label,value,onChange,min,max,step,fmt:f}){
  return <div style={{marginBottom:16}}>
    <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:8}}>
      <span style={{color:"var(--text-dim)"}}>{label}</span>
      <span className="mono" style={{color:"var(--gold)"}}>{f?f(value):value}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(Number(e.target.value))}/>
  </div>;
}
function ToggleSw({on,onClick}){
  return <button className="toggle-sw" onClick={onClick} style={{background:on?"rgba(201,168,76,.25)":"var(--surface-2)"}}>
    <span style={{background:on?"var(--gold)":"var(--text-dim)",transform:on?"translateX(20px)":"translateX(0)"}}/>
  </button>;
}
function Field({label,children}){
  return <div style={{marginBottom:14}}>
    <label style={{display:"block",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--text-dim)",marginBottom:8}}>{label}</label>
    {children}
  </div>;
}

// ── NAV BAR (responsive) ─────────────────────────────────────────
function TopNav({goTo,items,active,onSelect,user,badge,demo,onExit,exitLabel}){
  const [open,setOpen]=useState(false);
  return <>
    <nav className="top-nav" style={{position:"fixed",top:0,left:0,right:0,zIndex:100,display:"flex",
      alignItems:"center",justifyContent:"space-between",height:60,background:"rgba(11,14,20,.95)",
      backdropFilter:"blur(12px)",borderBottom:"1px solid var(--border)",gap:12}}>
      <LogoMark onClick={()=>goTo("home")}/>
      <div className="nav-desktop">
        {items.map(([k,label])=>(
          <button key={k} onClick={()=>onSelect(k)} className={`tab-btn ${active===k?"active":""}`}
            style={{padding:"20px 12px",fontSize:13,background:"none",border:"none",
              color:active===k?"var(--gold)":"var(--text-dim)",transition:"color .25s"}}>{label}</button>
        ))}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        {demo&&<div className="hide-mobile" style={{fontSize:11,background:"rgba(201,168,76,.15)",border:"1px solid var(--gold-dim)",padding:"4px 12px",color:"var(--gold)",letterSpacing:"0.06em"}}>DEMO</div>}
        <span style={{fontSize:13,color:"var(--text-dim)"}}>
          <strong className="nav-user-name" style={{color:"var(--text-bright)",fontWeight:400}}>{user}&nbsp;·&nbsp;</strong>{badge}
        </span>
        <button className="hide-mobile" onClick={onExit} style={{fontSize:12,color:"var(--text-dim)",background:"none",border:"none"}}>{exitLabel}</button>
        <button className="nav-burger" onClick={()=>setOpen(o=>!o)} aria-label="Menu"
          style={{background:"none",border:"1px solid var(--border)",color:"var(--gold)",padding:"6px 12px",fontSize:16,lineHeight:1}}>
          {open?"✕":"☰"}
        </button>
      </div>
    </nav>
    {open&&<div className="fade-in" style={{position:"fixed",top:60,left:0,right:0,zIndex:99,
      background:"rgba(11,14,20,.98)",backdropFilter:"blur(16px)",borderBottom:"1px solid var(--gold-dim)",
      padding:"12px 18px 20px",maxHeight:"70vh",overflowY:"auto"}}>
      {items.map(([k,label])=>(
        <button key={k} onClick={()=>{onSelect(k);setOpen(false);}} style={{display:"block",width:"100%",
          textAlign:"left",padding:"13px 12px",fontSize:15,background:active===k?"var(--gold-glow)":"none",
          border:"none",borderLeft:active===k?"2px solid var(--gold)":"2px solid transparent",
          color:active===k?"var(--gold)":"var(--text)"}}>{label}</button>
      ))}
      <button onClick={()=>{setOpen(false);onExit();}} style={{display:"block",width:"100%",textAlign:"left",
        padding:"13px 12px",fontSize:15,background:"none",border:"none",borderLeft:"2px solid transparent",
        color:"var(--text-dim)",marginTop:8,borderTop:"1px solid var(--border)"}}>{exitLabel}</button>
    </div>}
  </>;
}

// ── HOME ─────────────────────────────────────────────────────────
function HomeScreen({goTo}){
  const features=[
    {icon:"◈",title:"LP & Advisor Portals",desc:"Role-based dashboards with fund positions, NAV, IRR, capital calls, and distributions."},
    {icon:"⬡",title:"GP API Integrations",desc:"Direct connections to PE firm data APIs — automated NAV, capital activity, and document sync."},
    {icon:"◉",title:"Daily Workflow",desc:"Task queue, deadline calendar, alerts, wire verification, and meeting prep — your morning console."},
    {icon:"◇",title:"Analytics & Pacing",desc:"Interactive cash flow forecasts, commitment pacing models, NAV time-series, and concentration flags."},
  ];
  return <div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
    <nav className="top-nav" style={{position:"fixed",top:0,left:0,right:0,zIndex:100,height:60,display:"flex",
      alignItems:"center",justifyContent:"space-between",background:"rgba(11,14,20,.92)",
      backdropFilter:"blur(12px)",borderBottom:"1px solid var(--border)"}}>
      <LogoMark onClick={()=>goTo("home")}/>
      <div style={{display:"flex",gap:10}}>
        <GoldBtn outline small onClick={()=>goTo("login")}>Sign In</GoldBtn>
        <GoldBtn small onClick={()=>goTo("demo-advisor")}>View Demo</GoldBtn>
      </div>
    </nav>
    <div className="px" style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      paddingTop:130,paddingBottom:64,textAlign:"center",maxWidth:900,margin:"0 auto",width:"100%"}}>
      <div style={{fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:"var(--gold)",
        marginBottom:24,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",justifyContent:"center"}}>
        <span style={{width:32,height:1,background:"var(--gold)"}}/>Institutional Portfolio Management<span style={{width:32,height:1,background:"var(--gold)"}}/>
      </div>
      <h1 className="hero-title">The LP portal built for<br/><span style={{color:"var(--gold)"}}>institutional precision.</span></h1>
      <p style={{fontSize:"clamp(15px,2.5vw,18px)",color:"var(--text-dim)",maxWidth:600,lineHeight:1.7,marginBottom:40}}>
        FundVault connects to GP data APIs and turns them into a complete daily operating system for advisors and limited partners — from wire verification to pacing models.
      </p>
      <div style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center"}}>
        <GoldBtn onClick={()=>goTo("demo-advisor")}>Explore Advisor Demo →</GoldBtn>
        <GoldBtn outline onClick={()=>goTo("login")}>Sign In</GoldBtn>
      </div>
      <div style={{marginTop:20,fontSize:12,color:"var(--text-dim)",lineHeight:2}}>
        Demo: <code className="mono" style={{color:"var(--gold)",background:"var(--surface-2)",padding:"2px 8px",fontSize:11}}>advisor@demo.fundvault.com</code>
        {" "}/ <code className="mono" style={{color:"var(--text-dim)",background:"var(--surface-2)",padding:"2px 8px",fontSize:11}}>demo1234</code>
      </div>
    </div>
    <div className="px" style={{maxWidth:1200,margin:"0 auto",paddingBottom:80,width:"100%",
      display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:16}}>
      {features.map(f=>(
        <div key={f.title} className="premium-card" style={{padding:28}}>
          <div style={{fontSize:24,color:"var(--gold)",marginBottom:16}}>{f.icon}</div>
          <div style={{fontFamily:"Fraunces,serif",fontSize:18,color:"var(--text-bright)",marginBottom:10,fontWeight:300}}>{f.title}</div>
          <div style={{fontSize:13,color:"var(--text-dim)",lineHeight:1.6}}>{f.desc}</div>
        </div>
      ))}
    </div>
    <Footer label="Institutional Portfolio Portal · ILPA Standards"/>
  </div>;
}

// ── LOGIN ────────────────────────────────────────────────────────
function LoginScreen({goTo}){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [role,setRole]=useState("advisor");
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const [forgot,setForgot]=useState(false);
  const [resetSent,setResetSent]=useState(false);
  const autofill=r=>{setRole(r);setEmail(r==="advisor"?"advisor@demo.fundvault.com":"lp@demo.fundvault.com");setPassword("demo1234");setErr("");};
  const handleLogin=()=>{
    setErr("");setLoading(true);
    setTimeout(()=>{
      const acct=DEMO_ACCOUNTS[email.trim().toLowerCase()];
      if(!acct||acct.password!==password){setErr("Invalid email or password. Try the demo credentials below.");setLoading(false);return;}
      setLoading(false);goTo(acct.role==="advisor"?"portal-advisor":"portal-lp");
    },900);
  };
  return <div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
    <nav className="top-nav" style={{position:"fixed",top:0,left:0,right:0,zIndex:100,height:60,display:"flex",
      alignItems:"center",justifyContent:"space-between",background:"rgba(11,14,20,.92)",
      backdropFilter:"blur(12px)",borderBottom:"1px solid var(--border)"}}>
      <LogoMark onClick={()=>goTo("home")}/>
      <button onClick={()=>goTo("home")} style={{fontSize:12,color:"var(--text-dim)",background:"none",border:"none"}}>← Home</button>
    </nav>
    <div style={{position:"fixed",top:"20%",left:"50%",transform:"translateX(-50%)",width:600,height:400,
      background:"radial-gradient(ellipse, rgba(201,168,76,.07), transparent 70%)",pointerEvents:"none"}}/>
    <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"92px 16px 48px"}}>
      <div style={{width:"100%",maxWidth:480,animation:"fadeIn .45s cubic-bezier(.22,1,.36,1) both"}}>
        <div style={{position:"relative",padding:1,overflow:"hidden"}}>
          <div style={{position:"absolute",inset:-120,background:"conic-gradient(from 0deg, transparent 0%, var(--gold) 8%, transparent 20%, transparent 50%, var(--gold-dim) 58%, transparent 70%)",animation:"borderRotate 7s linear infinite"}}/>
          <div style={{position:"relative",background:"rgba(17,21,32,.97)",backdropFilter:"blur(20px)",padding:"clamp(24px,5vw,44px)",animation:"glowPulse 4s ease-in-out infinite"}}>
            <div style={{textAlign:"center",marginBottom:28}}>
              <div style={{fontFamily:"Fraunces,serif",fontSize:28,fontWeight:600,color:"var(--text-bright)",letterSpacing:"-0.03em",marginBottom:6}}>
                Fund<span style={{color:"var(--gold)"}}>Vault</span></div>
              <div style={{fontSize:13,color:"var(--text-dim)"}}>Secure portal access</div>
            </div>
            <div style={{display:"flex",border:"1px solid var(--border)",marginBottom:24,background:"var(--surface-2)"}}>
              {[["lp","Limited Partner"],["advisor","Investment Advisor"]].map(([r,label])=>(
                <button key={r} onClick={()=>autofill(r)} className={`tab-btn ${role===r?"active":""}`}
                  style={{flex:1,padding:"12px 4px",fontSize:12,border:"none",background:role===r?"var(--gold-glow)":"transparent",
                    color:role===r?"var(--gold)":"var(--text-dim)",transition:"all .25s",fontWeight:role===r?500:400}}>{label}</button>
              ))}
            </div>
            <Field label="Email">
              <input className="input-field" type="email" value={email} onChange={e=>{setEmail(e.target.value);setErr("");}}
                placeholder="you@example.com" onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
            </Field>
            <Field label="Password">
              <input className="input-field" type="password" value={password} onChange={e=>{setPassword(e.target.value);setErr("");}}
                placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
            </Field>
            {err&&<div style={{fontSize:12,color:"var(--red)",marginBottom:12}}>{err}</div>}
            <div style={{marginBottom:22,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:6}}>
              <button onClick={()=>{setForgot(true);setResetSent(false);}} style={{fontSize:12,color:"var(--text-dim)",background:"none",border:"none",padding:0}}>Forgot password?</button>
              <span style={{fontSize:10,color:"var(--text-dim)",letterSpacing:"0.08em"}}>256-BIT TLS · SSO READY</span>
            </div>
            <GoldBtn full onClick={handleLogin} disabled={loading||!email||!password}>{loading?"Authenticating…":"Sign In →"}</GoldBtn>
          </div>
        </div>
        <div style={{marginTop:16,background:"var(--surface-2)",border:"1px solid var(--border)",padding:"18px 20px"}}>
          <div style={{fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--gold)",marginBottom:12}}>Demo Credentials</div>
          {[{label:"Investment Advisor",email:"advisor@demo.fundvault.com",r:"advisor"},{label:"Limited Partner",email:"lp@demo.fundvault.com",r:"lp"}].map(d=>(
            <div key={d.r} style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
              <div style={{minWidth:0}}>
                <div style={{fontSize:12,color:"var(--text-bright)",marginBottom:2}}>{d.label}</div>
                <div className="mono" style={{fontSize:10,color:"var(--text-dim)",wordBreak:"break-all"}}>{d.email} · demo1234</div>
              </div>
              <button onClick={()=>autofill(d.r)} style={{fontSize:11,color:"var(--gold)",background:"none",border:"1px solid var(--gold-dim)",padding:"4px 10px",flexShrink:0}}>Use</button>
            </div>
          ))}
        </div>
      </div>
    </div>
    {forgot&&<Modal onClose={()=>setForgot(false)}>
      {!resetSent?<>
        <div style={{fontFamily:"Fraunces,serif",fontSize:22,color:"var(--text-bright)",marginBottom:8}}>Reset Password</div>
        <p style={{fontSize:13,color:"var(--text-dim)",marginBottom:20}}>Enter your email and we'll send a secure reset link. Links expire after 30 minutes.</p>
        <input className="input-field" type="email" placeholder="you@example.com" style={{marginBottom:16}}
          value={email} onChange={e=>setEmail(e.target.value)}/>
        <div style={{display:"flex",gap:8}}>
          <GoldBtn full onClick={()=>setResetSent(true)}>Send Reset Link</GoldBtn>
          <GoldBtn outline onClick={()=>setForgot(false)}>Cancel</GoldBtn>
        </div>
      </>:<>
        <div style={{fontFamily:"Fraunces,serif",fontSize:22,color:"var(--green)",marginBottom:8}}>✓ Link Sent</div>
        <p style={{fontSize:13,color:"var(--text-dim)",marginBottom:20}}>If an account exists for {email||"that address"}, a reset link is on its way. This is a demo — no email is actually sent.</p>
        <GoldBtn full onClick={()=>setForgot(false)}>Back to Sign In</GoldBtn>
      </>}
    </Modal>}
    <Footer label="Secure portal access · All data encrypted"/>
  </div>;
}

// ── TODAY ────────────────────────────────────────────────────────
function TodayView({showToast,tasks,setTasks}){
  const [tab,setTab]=useState("tasks");
  const [alerts,setAlerts]=useState(INITIAL_ALERTS);
  const [filter,setFilter]=useState("open");
  const [adding,setAdding]=useState(false);
  const [nt,setNt]=useState({title:"",client:"—",due:"2026-07-07",priority:"med",tag:"General",detail:""});
  const open=tasks.filter(t=>!t.done);
  const overdue=open.filter(t=>daysUntil(t.due)<0);
  const dueSoon=open.filter(t=>daysUntil(t.due)>=0&&daysUntil(t.due)<=7);
  const shown=filter==="open"?open:filter==="done"?tasks.filter(t=>t.done):tasks;
  const toggle=id=>{setTasks(p=>p.map(t=>t.id===id?{...t,done:!t.done}:t));showToast("Task updated");};
  const dismiss=id=>{setAlerts(p=>p.filter(a=>a.id!==id));showToast("Alert dismissed");};
  const addTask=()=>{
    if(!nt.title.trim()){showToast("Task needs a title");return;}
    setTasks(p=>[{...nt,id:Date.now(),done:false},...p]);
    setAdding(false);setNt({title:"",client:"—",due:"2026-07-07",priority:"med",tag:"General",detail:""});
    showToast("Task added to queue");
  };
  const sevColor={error:"var(--red)",warn:"var(--gold)",info:"var(--blue)"};
  const prioColor={high:"var(--red)",med:"var(--gold)",low:"var(--text-dim)"};
  const byMonth={};
  DEADLINES.forEach(d=>{const m=new Date(d.date).toLocaleDateString("en-US",{month:"long",year:"numeric"});(byMonth[m]=byMonth[m]||[]).push(d);});
  const pendingCalls=CLIENTS_SEED.flatMap(c=>c.calls).filter(c=>c.status!=="Funded");

  return <div className="fade-in">
    <PageHead kicker="Daily Console" title="Today"
      sub={`Wed, July 1, 2026 · ${open.length} open tasks · ${alerts.length} alerts`}>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        <GoldBtn small outline onClick={()=>setAdding(true)}>+ Add Task</GoldBtn>
        <GoldBtn small onClick={()=>showToast("Morning digest emailed")}>Email Digest</GoldBtn>
      </div>
    </PageHead>
    <Stats>
      <StatCard label="Open Tasks" value={open.length} note={`${overdue.length} overdue`} highlight/>
      <StatCard label="Due This Week" value={dueSoon.length} note="deadlines ≤ 7 days"/>
      <StatCard label="Active Alerts" value={alerts.length} note={`${alerts.filter(a=>a.severity==="error").length} critical`} color={alerts.some(a=>a.severity==="error")?"var(--red)":"var(--green)"}/>
      <StatCard label="Calls Pending" value={pendingCalls.length} note={fmt(pendingCalls.reduce((s,c)=>s+c.amount,0))}/>
    </Stats>
    <TabWrap><TabBar tabs={[["tasks","Task Queue"],["alerts","Alerts"],["deadlines","Deadlines"]]} active={tab} onSelect={setTab}/></TabWrap>
    <Wrap>
      {tab==="tasks"&&<div className="fade-in">
        <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
          {[["open","Open"],["done","Completed"],["all","All"]].map(([k,l])=>
            <Chip key={k} on={filter===k} onClick={()=>setFilter(k)}>{l}</Chip>)}
        </div>
        {shown.length===0?<EmptyState msg="Nothing here — enjoy the quiet."/>:
        [...shown].sort((a,b)=>new Date(a.due)-new Date(b.due)).map(t=>{
          const d=daysUntil(t.due);
          return <div key={t.id} className="premium-card" style={{padding:"16px 18px",marginBottom:10,
            display:"flex",alignItems:"flex-start",gap:14,opacity:t.done?0.5:1,flexWrap:"wrap"}}>
            <button onClick={()=>toggle(t.id)} style={{width:22,height:22,minWidth:22,borderRadius:"50%",marginTop:2,
              border:`1.5px solid ${t.done?"var(--green)":"var(--gold-dim)"}`,
              background:t.done?"rgba(74,157,110,.2)":"transparent",color:"var(--green)",fontSize:11,lineHeight:"19px"}}>
              {t.done?"✓":""}</button>
            <div style={{flex:1,minWidth:200}}>
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                <span style={{fontSize:14,color:"var(--text-bright)",textDecoration:t.done?"line-through":"none"}}>{t.title}</span>
                <span style={{fontSize:10,padding:"2px 8px",background:"var(--surface-2)",border:"1px solid var(--border)",color:"var(--text-dim)"}}>{t.tag}</span>
                <span style={{fontSize:10,color:prioColor[t.priority],letterSpacing:"0.08em",textTransform:"uppercase"}}>{t.priority}</span>
              </div>
              <div style={{fontSize:12,color:"var(--text-dim)",marginTop:2}}>{t.client!=="—"?t.client+" · ":""}{t.detail}</div>
            </div>
            <div style={{textAlign:"right",minWidth:90}}>
              <div style={{fontSize:12,color:d<0&&!t.done?"var(--red)":d<=3?"var(--gold)":"var(--text-dim)"}}>
                {t.done?"Done":d<0?`${-d}d overdue`:d===0?"Due today":`Due in ${d}d`}</div>
              <div className="mono" style={{fontSize:11,color:"var(--text-dim)"}}>{fmtDate(t.due)}</div>
            </div>
          </div>;
        })}
      </div>}
      {tab==="alerts"&&<div className="fade-in">
        {alerts.length===0?<EmptyState msg="No active alerts."/>:alerts.map(a=>(
          <div key={a.id} className="premium-card" style={{padding:"16px 18px",marginBottom:10,
            borderLeft:`3px solid ${sevColor[a.severity]}`,display:"flex",alignItems:"flex-start",gap:14,flexWrap:"wrap"}}>
            <div style={{flex:1,minWidth:220}}>
              <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                <span style={{fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:sevColor[a.severity]}}>{a.severity}</span>
                <span style={{fontSize:14,color:"var(--text-bright)"}}>{a.title}</span>
              </div>
              <div style={{fontSize:12,color:"var(--text-dim)",marginTop:4,lineHeight:1.6}}>{a.detail}</div>
              <div className="mono" style={{fontSize:11,color:"var(--text-dim)",marginTop:6}}>{a.ts} UTC</div>
            </div>
            <GoldBtn small outline onClick={()=>dismiss(a.id)}>Dismiss</GoldBtn>
          </div>
        ))}
      </div>}
      {tab==="deadlines"&&<div className="fade-in">
        {Object.entries(byMonth).map(([month,items])=>(
          <div key={month} style={{marginBottom:28}}>
            <div style={{fontSize:11,letterSpacing:"0.16em",textTransform:"uppercase",color:"var(--gold)",
              marginBottom:12,display:"flex",alignItems:"center",gap:12}}>
              <span style={{width:20,height:1,background:"var(--gold)"}}/>{month}</div>
            {items.map((d,i)=>{
              const dd=daysUntil(d.date);
              return <div key={i} className="premium-card" style={{padding:"12px 16px",marginBottom:8,
                display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
                <div style={{minWidth:52,textAlign:"center",padding:"6px 0",background:"var(--surface-2)",border:"1px solid var(--border)"}}>
                  <div style={{fontFamily:"Fraunces,serif",fontSize:18,color:dd<=7&&dd>=0?"var(--gold)":"var(--text-bright)",lineHeight:1}}>{new Date(d.date).getDate()}</div>
                  <div style={{fontSize:9,letterSpacing:"0.1em",color:"var(--text-dim)",textTransform:"uppercase"}}>{new Date(d.date).toLocaleDateString("en-US",{month:"short"})}</div>
                </div>
                <div style={{flex:1,minWidth:180}}>
                  <div style={{fontSize:14,color:"var(--text-bright)"}}>{d.label}</div>
                  <div style={{fontSize:12,color:"var(--text-dim)"}}>{d.client}</div>
                </div>
                <span style={{fontSize:10,padding:"2px 8px",background:"var(--surface-2)",border:"1px solid var(--border)",color:"var(--text-dim)"}}>{d.type}</span>
                <span style={{fontSize:11,color:dd<0?"var(--red)":dd<=7?"var(--gold)":"var(--text-dim)",minWidth:56,textAlign:"right"}}>
                  {dd<0?"passed":dd===0?"today":`in ${dd}d`}</span>
              </div>;
            })}
          </div>
        ))}
      </div>}
    </Wrap>
    {adding&&<Modal onClose={()=>setAdding(false)}>
      <div style={{fontFamily:"Fraunces,serif",fontSize:22,color:"var(--text-bright)",marginBottom:20}}>New Task</div>
      <Field label="Title"><input className="input-field" value={nt.title} onChange={e=>setNt({...nt,title:e.target.value})} placeholder="e.g. Confirm wire for KKR call"/></Field>
      <Field label="Detail"><input className="input-field" value={nt.detail} onChange={e=>setNt({...nt,detail:e.target.value})} placeholder="Optional notes"/></Field>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Field label="Client">
          <select className="input-field" value={nt.client} onChange={e=>setNt({...nt,client:e.target.value})}>
            <option>—</option>{CLIENTS_SEED.map(c=><option key={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Due Date"><input className="input-field" type="date" value={nt.due} onChange={e=>setNt({...nt,due:e.target.value})}/></Field>
        <Field label="Priority">
          <select className="input-field" value={nt.priority} onChange={e=>setNt({...nt,priority:e.target.value})}>
            <option value="high">High</option><option value="med">Medium</option><option value="low">Low</option>
          </select>
        </Field>
        <Field label="Tag">
          <select className="input-field" value={nt.tag} onChange={e=>setNt({...nt,tag:e.target.value})}>
            {["General","Capital Call","Document","Meeting","Reporting","Tax","Data Feed"].map(t=><option key={t}>{t}</option>)}
          </select>
        </Field>
      </div>
      <div style={{display:"flex",gap:8,marginTop:6}}>
        <GoldBtn full onClick={addTask}>Add Task</GoldBtn>
        <GoldBtn outline onClick={()=>setAdding(false)}>Cancel</GoldBtn>
      </div>
    </Modal>}
  </div>;
}

// ── ANALYTICS (interactive) ──────────────────────────────────────
function AnalyticsView({showToast,clients}){
  const [tab,setTab]=useState("cashflow");
  const [pacingClient,setPacingClient]=useState(clients[0].id);
  const [navFund,setNavFund]=useState(clients[0].funds[0].id);
  const [scenario,setScenario]=useState("base");
  const [showCalls,setShowCalls]=useState(true);
  const [showDists,setShowDists]=useState(true);
  const [showNet,setShowNet]=useState(false);
  const [growth,setGrowth]=useState(10);
  const [deploy,setDeploy]=useState(72);
  const [targetOverride,setTargetOverride]=useState(null);
  const [showCalled,setShowCalled]=useState(false);

  const allFunds=clients.flatMap(c=>c.funds.map(f=>({...f,client:c.name})));
  const pc=clients.find(c=>c.id===Number(pacingClient));
  const nf=allFunds.find(f=>f.id===Number(navFund))||allFunds[0];

  const scenarios={
    base:{call:[0.16,0.15,0.14,0.12,0.11,0.09,0.07,0.06],dist:[0.02,0.025,0.03,0.035,0.04,0.05,0.055,0.06],label:"Base Case"},
    slow:{call:[0.10,0.10,0.09,0.09,0.08,0.08,0.07,0.07],dist:[0.015,0.018,0.02,0.024,0.028,0.033,0.038,0.044],label:"Conservative"},
    fast:{call:[0.22,0.20,0.17,0.14,0.11,0.08,0.06,0.05],dist:[0.028,0.035,0.045,0.055,0.062,0.07,0.078,0.085],label:"Accelerated"},
  };
  const qs=["Q3 26","Q4 26","Q1 27","Q2 27","Q3 27","Q4 27","Q1 28","Q2 28"];
  const uncalled=allFunds.reduce((s,f)=>s+(f.committed-f.called),0);
  const navTot=allFunds.reduce((s,f)=>s+f.nav,0);
  const sc=scenarios[scenario];
  const forecast=qs.map((q,i)=>({q,
    calls:-Math.round(uncalled*sc.call[i]),
    dists:Math.round(navTot*sc.dist[i]),
    net:Math.round(navTot*sc.dist[i]-uncalled*sc.call[i])}));

  const currentPE=pc.funds.reduce((s,f)=>s+f.nav,0);
  const tPct=targetOverride??pc.targetPE*100;
  const targetPE=pc.aum*(tPct/100);
  const gap=targetPE-currentPE;
  const annualCommit=Math.max(0,Math.round(gap/((deploy/100)*3)/100000)*100000);
  const pacingData=[0,1,2,3,4].map(y=>({
    yr:`${2026+y}`,
    projected:Math.round(currentPE*(1+growth/100)**y + annualCommit*(deploy/100)*Math.min(y,3)),
    target:Math.round(targetPE*1.05**y),
  }));

  const totCommit=allFunds.reduce((s,f)=>s+f.committed,0);
  const byGP={},bySt={},byVin={};
  allFunds.forEach(f=>{byGP[f.gp]=(byGP[f.gp]||0)+f.committed;bySt[f.strategy]=(bySt[f.strategy]||0)+f.committed;byVin[f.vintage]=(byVin[f.vintage]||0)+f.committed;});
  const concRows=(obj,limit)=>Object.entries(obj).map(([k,v])=>({k,v,pct:v/totCommit,breach:v/totCommit>limit})).sort((a,b)=>b.v-a.v);

  return <div className="fade-in">
    <PageHead kicker="Portfolio Analytics" title="Analytics & Pacing"
      sub="Interactive forecasting, pacing, NAV performance, and concentration monitoring.">
      <GoldBtn small onClick={()=>showToast("Analytics pack exported (PDF)")}>Export Pack</GoldBtn>
    </PageHead>
    <TabWrap><TabBar tabs={[["cashflow","Cash Flow"],["pacing","Pacing Model"],["nav","NAV Performance"],["conc","Concentration"]]} active={tab} onSelect={setTab}/></TabWrap>
    <Wrap>
      {tab==="cashflow"&&<div className="fade-in">
        <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
          <span style={{fontSize:12,color:"var(--text-dim)"}}>Scenario:</span>
          {Object.entries(scenarios).map(([k,v])=><Chip key={k} on={scenario===k} onClick={()=>setScenario(k)}>{v.label}</Chip>)}
          <span style={{width:12}}/>
          <span style={{fontSize:12,color:"var(--text-dim)"}}>Series:</span>
          <Chip on={showCalls} onClick={()=>setShowCalls(v=>!v)}>Calls</Chip>
          <Chip on={showDists} onClick={()=>setShowDists(v=>!v)}>Distributions</Chip>
          <Chip on={showNet} onClick={()=>setShowNet(v=>!v)}>Net Flow</Chip>
        </div>
        <ChartBox title={`Firmwide Projected Cash Flows — ${sc.label}`} h={300}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={forecast} margin={{top:8,right:8,left:0,bottom:0}}>
              <CartesianGrid stroke="rgba(255,255,255,.05)" vertical={false}/>
              <XAxis dataKey="q" tick={{fill:"#7a7269",fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tickFormatter={v=>fmtM(v)} tick={{fill:"#7a7269",fontSize:11}} axisLine={false} tickLine={false} width={54}/>
              <Tooltip contentStyle={tooltipStyle} formatter={(v,n)=>[fmt(Math.abs(v)),n]}/>
              <Legend wrapperStyle={{fontSize:12}}/>
              <ReferenceLine y={0} stroke="rgba(255,255,255,.15)"/>
              {showCalls&&<Bar dataKey="calls" name="Projected Calls" fill="#b05a4a"/>}
              {showDists&&<Bar dataKey="dists" name="Projected Distributions" fill="#4a9d6e"/>}
              {showNet&&<Bar dataKey="net" name="Net Flow" fill="#c9a84c"/>}
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
        <div className="stat-grid" style={{margin:"16px 0 0"}}>
          <StatCard label="Uncalled (Firmwide)" value={fmt(uncalled)} note="remaining exposure" highlight/>
          <StatCard label="Next 4Q Net Flow" value={fmt(forecast.slice(0,4).reduce((s,f)=>s+f.net,0))} note={sc.label} color={forecast.slice(0,4).reduce((s,f)=>s+f.net,0)<0?"var(--red)":"var(--green)"}/>
          <StatCard label="Tightest Client" value="Castellano" note="liquidity covers 3.0x pending calls" color="var(--gold)"/>
        </div>
        <div style={{fontSize:11,color:"var(--text-dim)",marginTop:12,lineHeight:1.7}}>
          Modeled from uncalled commitments, fund age, and strategy pacing curves. Illustrative — not a guarantee of GP behavior or investment advice.
        </div>
      </div>}
      {tab==="pacing"&&<div className="fade-in">
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16,marginBottom:16}}>
          <div className="premium-card" style={{padding:20}}>
            <div style={{fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--gold)",marginBottom:16}}>Model Assumptions — drag to adjust</div>
            <Field label="Client">
              <select className="input-field" value={pacingClient} onChange={e=>{setPacingClient(e.target.value);setTargetOverride(null);}}>
                {clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Slider label="Target PE Allocation" value={tPct} onChange={setTargetOverride} min={10} max={50} step={1} fmt={v=>v.toFixed(0)+"%"}/>
            <Slider label="Assumed NAV Growth" value={growth} onChange={setGrowth} min={0} max={25} step={1} fmt={v=>v+"%/yr"}/>
            <Slider label="Deployment of New Commits" value={deploy} onChange={setDeploy} min={40} max={100} step={1} fmt={v=>v+"% over 3yr"}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,alignContent:"start"}}>
            <StatCard label="Target PE" value={fmtM(targetPE)} note={`${tPct.toFixed(0)}% of ${fmtM(pc.aum)}`} highlight/>
            <StatCard label="Current PE NAV" value={fmtM(currentPE)} note={`${((currentPE/pc.aum)*100).toFixed(1)}% of AUM`}/>
            <StatCard label="Allocation Gap" value={fmtM(gap)} note={gap>0?"underallocated":"at/above target"} color={gap>0?"var(--gold)":"var(--green)"}/>
            <StatCard label="Suggested Annual Commit" value={fmtM(annualCommit)} note="per year over ~3 vintages"/>
          </div>
        </div>
        <ChartBox title={`Projected PE NAV vs. Target — ${pc.name}`} h={280}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={pacingData} margin={{top:8,right:8,left:0,bottom:0}}>
              <CartesianGrid stroke="rgba(255,255,255,.05)" vertical={false}/>
              <XAxis dataKey="yr" tick={{fill:"#7a7269",fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tickFormatter={v=>fmtM(v)} tick={{fill:"#7a7269",fontSize:11}} axisLine={false} tickLine={false} width={54}/>
              <Tooltip contentStyle={tooltipStyle} formatter={v=>fmt(v)}/>
              <Legend wrapperStyle={{fontSize:12}}/>
              <Line type="monotone" dataKey="projected" name="Projected NAV" stroke="#c9a84c" strokeWidth={2} dot={{r:3}} activeDot={{r:6}}/>
              <Line type="monotone" dataKey="target" name="Target" stroke="#5a7db0" strokeWidth={2} strokeDasharray="6 4" dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>
        <div style={{fontSize:11,color:"var(--text-dim)",marginTop:12,lineHeight:1.7}}>
          Illustrative planning tool — outputs update live with your assumptions. Not investment advice.
        </div>
      </div>}
      {tab==="nav"&&<div className="fade-in">
        <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:16,flexWrap:"wrap"}}>
          <select className="input-field" style={{maxWidth:380}} value={navFund} onChange={e=>setNavFund(e.target.value)}>
            {allFunds.map(f=><option key={f.id} value={f.id}>{f.name} — {f.client}</option>)}
          </select>
          <Chip on={showCalled} onClick={()=>setShowCalled(v=>!v)}>Overlay Called Capital</Chip>
        </div>
        <div className="stat-grid" style={{margin:"0 0 16px"}}>
          <StatCard label="Current NAV" value={fmt(nf.nav)} highlight note={nf.source}/>
          <StatCard label="Net IRR" value={`${nf.irr.toFixed(1)}%`} color={nf.irr>=0?"var(--green)":"var(--red)"} note="since inception"/>
          <StatCard label="TVPI / DPI" value={`${nf.tvpi.toFixed(2)}x / ${nf.dpi.toFixed(2)}x`} note="value / distributed"/>
          <StatCard label="Called" value={`${Math.round(nf.called/nf.committed*100)}%`} note={`${fmtM(nf.called)} of ${fmtM(nf.committed)}`}/>
        </div>
        <ChartBox title={`Quarterly NAV — ${nf.name}`} h={280}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={NAV_HISTORY[nf.id]} margin={{top:8,right:8,left:0,bottom:0}}>
              <CartesianGrid stroke="rgba(255,255,255,.05)" vertical={false}/>
              <XAxis dataKey="q" tick={{fill:"#7a7269",fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tickFormatter={v=>fmtM(v)} tick={{fill:"#7a7269",fontSize:11}} axisLine={false} tickLine={false} width={54}/>
              <Tooltip contentStyle={tooltipStyle} formatter={v=>fmt(v)}/>
              <Legend wrapperStyle={{fontSize:12}}/>
              <Line type="monotone" dataKey="nav" name="NAV" stroke="#c9a84c" strokeWidth={2} dot={{r:3,fill:"#c9a84c"}} activeDot={{r:6}}/>
              {showCalled&&<Line type="monotone" dataKey="called" name="Called Capital" stroke="#5a7db0" strokeWidth={2} strokeDasharray="5 4" dot={false}/>}
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>
      </div>}
      {tab==="conc"&&<div className="fade-in">
        <p style={{fontSize:13,color:"var(--text-dim)",marginBottom:20,maxWidth:720}}>
          Committed-capital concentration across the book. Policy limits: single GP 35%, strategy 45%, vintage 40%. Breaches flagged in red.
        </p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
          {[["By General Partner",byGP,0.35],["By Strategy",bySt,0.45],["By Vintage Year",byVin,0.40]].map(([title,obj,limit])=>(
            <div key={title} className="premium-card" style={{padding:20}}>
              <div style={{fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--gold)",marginBottom:16}}>
                {title} <span style={{color:"var(--text-dim)"}}>· limit {(limit*100)}%</span></div>
              {concRows(obj,limit).map(r=>(
                <div key={r.k} style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4,gap:8}}>
                    <span style={{color:r.breach?"var(--red)":"var(--text-bright)"}}>{r.k}{r.breach?" ⚠":""}</span>
                    <span style={{color:"var(--text-dim)",whiteSpace:"nowrap"}}>{fmtM(r.v)} · {(r.pct*100).toFixed(1)}%</span>
                  </div>
                  <ProgressBar pct={Math.round(r.pct*100)} color={r.breach?"var(--red)":undefined}/>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="premium-card" style={{padding:20,marginTop:16,borderLeft:"3px solid var(--red)"}}>
          <div style={{fontSize:13,color:"var(--text-bright)",marginBottom:4}}>⚠ 1 active breach — Meridian Endowment single-GP limit</div>
          <div style={{fontSize:12,color:"var(--text-dim)"}}>KKR is 41.7% of Meridian's committed capital (policy: 35%). Consider pacing new commitments away from KKR vehicles or documenting a policy exception.</div>
        </div>
      </div>}
    </Wrap>
  </div>;
}

// ── DOCUMENTS ────────────────────────────────────────────────────
function DocumentsView({showToast,docs,setDocs,clients}){
  const [q,setQ]=useState("");
  const [typeF,setTypeF]=useState("All");
  const [uploading,setUploading]=useState(false);
  const [nd,setNd]=useState({name:"",client:clients[0].name,fund:"",type:"Statement",period:""});
  const types=["All",...new Set(docs.map(d=>d.type))];
  const shown=docs.filter(d=>(typeF==="All"||d.type===typeF)&&
    (d.name.toLowerCase().includes(q.toLowerCase())||d.fund.toLowerCase().includes(q.toLowerCase())||d.client.toLowerCase().includes(q.toLowerCase())));
  const upload=()=>{
    if(!nd.name.trim()){showToast("Document needs a name");return;}
    setDocs(p=>[{...nd,id:`DOC-2026-0701-${uid().slice(0,2)}`,fund:nd.fund||"—",period:nd.period||"—",ingested:"2026-07-01",source:"Manual Upload"},...p]);
    setUploading(false);setNd({name:"",client:clients[0].name,fund:"",type:"Statement",period:""});
    showToast("Document uploaded to vault · audit entry logged");
  };
  return <div className="fade-in">
    <PageHead kicker="Document Vault" title="Documents"
      sub="K-1s, statements, notices, and legal docs — from GP feeds or manual upload.">
      <GoldBtn small onClick={()=>setUploading(true)}>Upload Document</GoldBtn>
    </PageHead>
    <Wrap style={{paddingTop:28}}>
      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
        <input className="input-field" style={{maxWidth:320}} placeholder="Search documents, funds, clients…" value={q} onChange={e=>setQ(e.target.value)}/>
        <select className="input-field" style={{maxWidth:200}} value={typeF} onChange={e=>setTypeF(e.target.value)}>
          {types.map(t=><option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="table-scroll">
        <table>
          <thead><tr><TH>Document</TH><TH>ID</TH><TH>Fund</TH><TH>Client</TH><TH>Type</TH><TH>Period</TH><TH>Ingested</TH><TH></TH></tr></thead>
          <tbody>{shown.map(d=>(
            <TR key={d.id}>
              <TD bright><span style={{fontFamily:"Fraunces,serif",fontSize:14}}>{d.name}</span></TD>
              <TD mono style={{color:"var(--text-dim)"}}>{d.id}</TD>
              <TD style={{fontSize:12,color:"var(--text-dim)"}}>{d.fund}</TD>
              <TD style={{fontSize:12,color:"var(--text-dim)"}}>{d.client}</TD>
              <TD><span style={{fontSize:10,padding:"2px 8px",background:"var(--surface-2)",border:"1px solid var(--border)",color:"var(--text-dim)",whiteSpace:"nowrap"}}>{d.type}</span></TD>
              <TD style={{fontSize:12,color:"var(--text-dim)"}}>{d.period}</TD>
              <TD style={{fontSize:12,color:"var(--text-dim)"}}>{fmtDate(d.ingested)}</TD>
              <TD><GoldBtn small outline onClick={()=>showToast(`Downloading ${d.id}…`)}>Download</GoldBtn></TD>
            </TR>
          ))}</tbody>
        </table>
      </div>
      {shown.length===0&&<EmptyState msg="No documents match your filters."/>}
    </Wrap>
    {uploading&&<Modal onClose={()=>setUploading(false)}>
      <div style={{fontFamily:"Fraunces,serif",fontSize:22,color:"var(--text-bright)",marginBottom:20}}>Upload Document</div>
      <div style={{border:"1px dashed var(--gold-dim)",padding:"28px 16px",textAlign:"center",marginBottom:18,
        background:"var(--gold-glow)",fontSize:13,color:"var(--text-dim)"}}>
        Drop file here or tap to browse<br/><span style={{fontSize:11}}>(demo — file contents are not stored)</span>
      </div>
      <Field label="Document Name"><input className="input-field" value={nd.name} onChange={e=>setNd({...nd,name:e.target.value})} placeholder="e.g. Q2 2026 Statement"/></Field>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Field label="Client">
          <select className="input-field" value={nd.client} onChange={e=>setNd({...nd,client:e.target.value})}>
            {clients.map(c=><option key={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Type">
          <select className="input-field" value={nd.type} onChange={e=>setNd({...nd,type:e.target.value})}>
            {["Statement","Quarterly Report","Tax / K-1","Call Notice","Distribution Notice","Legal"].map(t=><option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Fund (optional)"><input className="input-field" value={nd.fund} onChange={e=>setNd({...nd,fund:e.target.value})} placeholder="Fund name"/></Field>
        <Field label="Period (optional)"><input className="input-field" value={nd.period} onChange={e=>setNd({...nd,period:e.target.value})} placeholder="e.g. Q2 2026"/></Field>
      </div>
      <div style={{display:"flex",gap:8,marginTop:6}}>
        <GoldBtn full onClick={upload}>Upload to Vault</GoldBtn>
        <GoldBtn outline onClick={()=>setUploading(false)}>Cancel</GoldBtn>
      </div>
    </Modal>}
  </div>;
}

// ── OPS ──────────────────────────────────────────────────────────
function OpsView({showToast,clients}){
  const [tab,setTab]=useState("wires");
  const [wires,setWires]=useState(INITIAL_WIRES);
  const [audit,setAudit]=useState(AUDIT_SEED);
  const [stmt,setStmt]=useState(null);
  const verify=id=>{
    setWires(p=>p.map(w=>w.id===id?{...w,status:"Verified",note:w.note+" Callback verification logged 2026-07-01 by schen."}:w));
    setAudit(p=>[{ts:"2026-07-01 10:02:11",user:"schen",action:"VERIFY",target:`Wire ${id}`,detail:"Callback verification logged"},...p]);
    showToast("Callback verification recorded in audit trail");
  };
  return <div className="fade-in">
    <PageHead kicker="Operations & Compliance" title="Ops Center"
      sub="Wire verification, immutable audit trail, and statement generation."/>
    <TabWrap><TabBar tabs={[["wires","Wire Verification"],["audit","Audit Trail"],["stmts","Statements"]]} active={tab} onSelect={setTab}/></TabWrap>
    <Wrap>
      {tab==="wires"&&<div className="fade-in">
        <div className="premium-card" style={{padding:"14px 18px",marginBottom:20,borderLeft:"3px solid var(--gold)"}}>
          <div style={{fontSize:12,color:"var(--text-dim)",lineHeight:1.7}}>
            <strong style={{color:"var(--text-bright)"}}>Policy:</strong> New or changed wire instructions must be verified by calling the GP's IR line at an independently known number — never a number from the instruction email — before release. Verifications are logged.
          </div>
        </div>
        {wires.map(w=>(
          <div key={w.id} className="premium-card" style={{padding:"16px 18px",marginBottom:12,
            borderLeft:`3px solid ${w.status==="Flagged"?"var(--red)":w.status==="Verified"?"var(--green)":"var(--gold)"}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
              <div style={{minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4,flexWrap:"wrap"}}>
                  <span className="mono" style={{fontSize:12,color:"var(--gold)"}}>{w.id}</span>
                  <span style={{fontFamily:"Fraunces,serif",fontSize:16,color:"var(--text-bright)"}}>{fmt(w.amount)}</span>
                  <StatusPill status={w.status}/>
                </div>
                <div style={{fontSize:13,color:"var(--text-dim)"}}>{w.client} → {w.fund} · due {fmtDate(w.date)} · {w.bank}</div>
                <div style={{fontSize:12,color:w.status==="Flagged"?"var(--red)":"var(--text-dim)",marginTop:6,maxWidth:720,lineHeight:1.6}}>{w.note}</div>
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {w.status!=="Verified"&&<GoldBtn small onClick={()=>verify(w.id)}>Log Callback Verification</GoldBtn>}
                {w.status==="Flagged"&&<GoldBtn small outline danger onClick={()=>showToast("Escalation sent to compliance and the GP's known IR contact")}>Escalate</GoldBtn>}
              </div>
            </div>
          </div>
        ))}
      </div>}
      {tab==="audit"&&<div className="fade-in">
        <div className="table-scroll">
          <table>
            <thead><tr><TH>Timestamp (UTC)</TH><TH>User</TH><TH>Action</TH><TH>Target</TH><TH>Detail</TH></tr></thead>
            <tbody>{audit.map((l,i)=>(
              <TR key={i}>
                <TD mono style={{color:"var(--text-dim)"}}>{l.ts}</TD>
                <TD mono style={{color:"var(--gold)"}}>{l.user}</TD>
                <TD><span style={{fontSize:10,letterSpacing:"0.08em",padding:"2px 8px",
                  background:l.action==="ERROR"?"rgba(176,90,74,.12)":"var(--surface-2)",
                  border:`1px solid ${l.action==="ERROR"?"rgba(176,90,74,.35)":"var(--border)"}`,
                  color:l.action==="ERROR"?"var(--red)":"var(--text-dim)"}}>{l.action}</span></TD>
                <TD bright style={{fontSize:13}}>{l.target}</TD>
                <TD style={{fontSize:12,color:"var(--text-dim)"}}>{l.detail}</TD>
              </TR>
            ))}</tbody>
          </table>
        </div>
        <div style={{fontSize:11,color:"var(--text-dim)",marginTop:16}}>Append-only · entries cannot be edited or deleted · retained 7 years per books-and-records policy.</div>
      </div>}
      {tab==="stmts"&&<div className="fade-in">
        <div className="card-grid" style={{gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,280px),1fr))"}}>
          {clients.map(c=>(
            <div key={c.id} className="premium-card" style={{padding:22}}>
              <div style={{fontFamily:"Fraunces,serif",fontSize:17,color:"var(--text-bright)",marginBottom:2}}>{c.name}</div>
              <div className="mono" style={{fontSize:11,color:"var(--text-dim)",marginBottom:14}}>{c.accountId} · Q2 2026</div>
              <div style={{fontSize:12,color:"var(--text-dim)",marginBottom:16}}>{c.funds.length} funds · NAV {fmtM(c.funds.reduce((s,f)=>s+f.nav,0))}</div>
              <div style={{display:"flex",gap:8}}>
                <GoldBtn small onClick={()=>setStmt(c)}>Preview</GoldBtn>
                <GoldBtn small outline onClick={()=>showToast(`Q2 2026 statement for ${c.name} exported`)}>Generate PDF</GoldBtn>
              </div>
            </div>
          ))}
        </div>
        {stmt&&<Modal onClose={()=>setStmt(null)} wide>
          <div style={{borderBottom:"1px solid var(--border)",paddingBottom:20,marginBottom:20}}>
            <div style={{fontFamily:"Fraunces,serif",fontSize:22,color:"var(--text-bright)"}}>Capital Account Statement — Q2 2026</div>
            <div style={{fontSize:13,color:"var(--text-dim)"}}>{stmt.name} · {stmt.accountId} · Custodian: {stmt.custodian}</div>
          </div>
          <div className="table-scroll">
            <table>
              <thead><tr><TH>Fund</TH><TH right>Committed</TH><TH right>Called</TH><TH right>Distributed</TH><TH right>NAV</TH><TH right>TVPI</TH></tr></thead>
              <tbody>{stmt.funds.map(f=>(
                <TR key={f.id}>
                  <TD bright style={{fontSize:13}}>{f.name}</TD>
                  <TD right>{fmt(f.committed)}</TD><TD right>{fmt(f.called)}</TD>
                  <TD right green>{fmt(f.distributed)}</TD><TD right bright>{fmt(f.nav)}</TD>
                  <TD right bright>{f.tvpi.toFixed(2)}x</TD>
                </TR>
              ))}</tbody>
            </table>
          </div>
          <div style={{fontSize:11,color:"var(--text-dim)",lineHeight:1.7,margin:"20px 0"}}>
            Figures are unaudited and derived from GP-reported data via connected feeds. Presented per ILPA Reporting Standards. Past performance is not indicative of future results.
          </div>
          <div style={{display:"flex",gap:8}}>
            <GoldBtn onClick={()=>{setStmt(null);showToast("Statement PDF generated and filed to vault");}}>Generate &amp; File PDF</GoldBtn>
            <GoldBtn outline onClick={()=>setStmt(null)}>Close</GoldBtn>
          </div>
        </Modal>}
      </div>}
    </Wrap>
  </div>;
}

// ── INTEGRATIONS ─────────────────────────────────────────────────
function IntegrationsView({showToast}){
  const [integrations,setIntegrations]=useState(INITIAL_INTEGRATIONS);
  const [tab,setTab]=useState("connections");
  const [connecting,setConnecting]=useState(null);
  const [apiKey,setApiKey]=useState("");
  const [clientId,setClientId]=useState("");
  const [syncingIds,setSyncingIds]=useState([]);
  const connected=integrations.filter(i=>i.status==="connected").length;
  const totalRecords=integrations.reduce((s,i)=>s+i.records,0);
  const triggerSync=id=>{
    setSyncingIds(p=>[...p,id]);
    showToast("Sync started — pulling latest capital activity…");
    setTimeout(()=>{
      setSyncingIds(p=>p.filter(x=>x!==id));
      setIntegrations(p=>p.map(i=>i.id===id?{...i,status:"connected",lastSync:"just now",records:i.records+Math.floor(Math.random()*12)+3,error:undefined}:i));
      showToast("Sync complete — portfolio database updated");
    },2200);
  };
  const handleConnect=()=>{
    if(!apiKey&&!clientId){showToast("Enter credentials to connect");return;}
    const firm=connecting;setConnecting(null);setApiKey("");setClientId("");
    showToast(`Authorizing with ${firm.firm}…`);
    setTimeout(()=>{
      setIntegrations(p=>[...p,{id:firm.firm.toLowerCase().replace(/\s/g,""),firm:firm.firm,product:firm.product,
        status:"connected",lastSync:"just now",records:Math.floor(Math.random()*400)+100,env:"Production",
        auth:firm.auth,scopes:["positions:read","capital_activity:read"],
        endpoint:`api.${firm.firm.toLowerCase().replace(/\s/g,"")}.com/v1`}]);
      showToast(`${firm.firm} connected — initial sync queued`);
    },1600);
  };
  const availableToAdd=AVAILABLE_INTEGRATIONS.filter(a=>!integrations.some(i=>i.firm===a.firm));
  return <div className="fade-in">
    <PageHead kicker="Data Infrastructure" title="GP API Integrations"
      sub={<span>Direct connections to PE firm data APIs. <span style={{color:"var(--gold)"}}>All connections in this demo are simulated.</span></span>}>
      <GoldBtn small onClick={()=>showToast("Nightly sync 06:00 UTC · Delta every 4h")}>Sync Schedule</GoldBtn>
    </PageHead>
    <Stats>
      <StatCard label="Active Connections" value={connected} note={`of ${integrations.length} configured`} highlight/>
      <StatCard label="Records Synced" value={totalRecords.toLocaleString()} note="in portfolio database"/>
      <StatCard label="Last Full Sync" value="06:12 UTC" note="today"/>
      <StatCard label="Feed Errors" value={integrations.filter(i=>i.status==="error").length} note="requires attention" color={integrations.some(i=>i.status==="error")?"var(--red)":"var(--green)"}/>
    </Stats>
    <TabWrap><TabBar tabs={[["connections","Connections"],["catalog","Add Integration"],["log","Sync Log"],["schema","Data Schema"]]} active={tab} onSelect={setTab}/></TabWrap>
    <Wrap>
      {tab==="connections"&&<div className="fade-in card-grid" style={{gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,360px),1fr))"}}>
        {integrations.map(i=>{
          const isSyncing=syncingIds.includes(i.id)||i.status==="syncing";
          return <div key={i.id} className="premium-card" style={{padding:0}}>
            <div style={{padding:"20px 20px 14px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6,gap:8}}>
                <div style={{minWidth:0}}>
                  <div style={{fontFamily:"Fraunces,serif",fontSize:18,color:"var(--text-bright)"}}>{i.firm}</div>
                  <div style={{fontSize:12,color:"var(--text-dim)"}}>{i.product}</div>
                </div>
                <StatusPill status={isSyncing?"syncing":i.status}/>
              </div>
              {i.error&&<div style={{fontSize:11,color:"var(--red)",marginBottom:8,background:"rgba(176,90,74,.08)",border:"1px solid rgba(176,90,74,.25)",padding:"6px 10px"}}>{i.error}</div>}
              <div className="mono" style={{fontSize:11,color:"var(--text-dim)",marginBottom:12,wordBreak:"break-all"}}>{i.endpoint}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
                {[["Auth",i.auth],["Env",i.env],["Records",i.records.toLocaleString()]].map(([l,v])=>(
                  <div key={l}>
                    <div style={{fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--text-dim)",marginBottom:2}}>{l}</div>
                    <div style={{fontSize:12,color:"var(--text-bright)"}}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {i.scopes.map(s=><span key={s} className="mono" style={{fontSize:10,background:"var(--surface-2)",border:"1px solid var(--border)",padding:"2px 8px",color:"var(--text-dim)"}}>{s}</span>)}
              </div>
            </div>
            <div style={{borderTop:"1px solid var(--border)",padding:"12px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,flexWrap:"wrap"}}>
              <span style={{fontSize:11,color:"var(--text-dim)"}}>Last sync: {isSyncing?<span className="sync-dot" style={{color:"var(--gold)"}}>in progress…</span>:i.lastSync}</span>
              {i.status==="error"?<GoldBtn small onClick={()=>triggerSync(i.id)}>Re-authenticate</GoldBtn>
                :<GoldBtn small outline onClick={()=>triggerSync(i.id)} disabled={isSyncing}>{isSyncing?"Syncing…":"Sync Now"}</GoldBtn>}
            </div>
          </div>;
        })}
      </div>}
      {tab==="catalog"&&<div className="fade-in">
        <div className="card-grid" style={{gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,280px),1fr))"}}>
          {availableToAdd.map(a=>(
            <div key={a.firm} className="premium-card" style={{padding:22}}>
              <div style={{fontFamily:"Fraunces,serif",fontSize:17,color:"var(--text-bright)",marginBottom:2}}>{a.firm}</div>
              <div style={{fontSize:12,color:"var(--text-dim)",marginBottom:14}}>{a.product}</div>
              <div style={{fontSize:11,color:"var(--text-dim)",marginBottom:16}}>Auth: <span style={{color:"var(--gold)"}}>{a.auth}</span></div>
              <GoldBtn small full onClick={()=>setConnecting(a)}>Connect →</GoldBtn>
            </div>
          ))}
          {availableToAdd.length===0&&<EmptyState msg="All available integrations are connected."/>}
        </div>
        {connecting&&<Modal onClose={()=>setConnecting(null)}>
          <div style={{fontFamily:"Fraunces,serif",fontSize:22,color:"var(--text-bright)",marginBottom:4}}>Connect {connecting.firm}</div>
          <div style={{fontSize:12,color:"var(--text-dim)",marginBottom:24}}>{connecting.product} · {connecting.auth}</div>
          <Field label="Client ID"><input className="input-field mono" value={clientId} onChange={e=>setClientId(e.target.value)} placeholder="fv_client_xxxxxxxx"/></Field>
          <Field label="API Key / Secret"><input className="input-field mono" type="password" value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="••••••••••••••••"/></Field>
          <div style={{fontSize:11,color:"var(--text-dim)",marginBottom:18,lineHeight:1.6,background:"var(--surface-2)",border:"1px solid var(--border)",padding:"10px 14px"}}>
            Demo — credentials are not transmitted or stored. In production, secrets live in an encrypted vault and are exchanged via {connecting.auth}.
          </div>
          <div style={{display:"flex",gap:8}}>
            <GoldBtn full onClick={handleConnect}>Authorize &amp; Connect</GoldBtn>
            <GoldBtn outline onClick={()=>setConnecting(null)}>Cancel</GoldBtn>
          </div>
        </Modal>}
      </div>}
      {tab==="log"&&<div className="fade-in table-scroll">
        <table>
          <thead><tr><TH>Timestamp (UTC)</TH><TH>Source</TH><TH>Event</TH><TH>Detail</TH></tr></thead>
          <tbody>{SYNC_LOG.map((l,i)=>(
            <TR key={i}>
              <TD mono style={{color:"var(--text-dim)"}}>{l.ts}</TD>
              <TD bright>{l.firm}</TD>
              <TD><span style={{fontSize:12,color:l.level==="error"?"var(--red)":l.level==="info"?"var(--blue)":"var(--green)"}}>{l.event}</span></TD>
              <TD style={{fontSize:12,color:"var(--text-dim)"}}>{l.detail}</TD>
            </TR>
          ))}</tbody>
        </table>
      </div>}
      {tab==="schema"&&<div className="fade-in card-grid" style={{gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,270px),1fr))"}}>
        {[
          {table:"positions",desc:"Fund positions per LP account",fields:["fund_id","client_id","committed","called","distributed","nav","irr","tvpi","dpi","as_of_date","source_feed"]},
          {table:"capital_activity",desc:"Calls & distributions",fields:["activity_id","fund_id","client_id","type","amount","currency","notice_date","due_date","status","gp_reference"]},
          {table:"nav_history",desc:"Time-series NAV per fund",fields:["fund_id","nav","valuation_date","methodology","audited","source_feed"]},
          {table:"documents",desc:"K-1s, statements, notices",fields:["doc_id","fund_id","client_id","doc_type","period","ingested_at","source_feed"]},
          {table:"tasks",desc:"Advisor workflow queue",fields:["task_id","client_id","title","tag","priority","due_date","done","created_by"]},
          {table:"wires",desc:"Wire verification workflow",fields:["wire_id","client_id","fund_id","amount","bank_ref","status","verified_by","verified_at"]},
          {table:"audit_log",desc:"Append-only audit trail",fields:["entry_id","ts","user_id","action","target","detail","ip"]},
          {table:"gp_connections",desc:"API feed registry",fields:["connection_id","firm","endpoint","auth_type","scopes","status","last_sync_at"]},
          {table:"clients",desc:"LP account master",fields:["client_id","name","type","risk_profile","custodian","advisor_id","account_id","target_pe_pct","liquidity"]},
        ].map(t=>(
          <div key={t.table} className="premium-card" style={{padding:20}}>
            <div className="mono" style={{fontSize:14,color:"var(--gold)",marginBottom:4}}>{t.table}</div>
            <div style={{fontSize:12,color:"var(--text-dim)",marginBottom:14}}>{t.desc}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {t.fields.map(f=><span key={f} className="mono" style={{fontSize:10,background:"var(--surface-2)",border:"1px solid var(--border)",padding:"2px 8px",color:"var(--text-dim)"}}>{f}</span>)}
            </div>
          </div>
        ))}
      </div>}
    </Wrap>
  </div>;
}

// ── CLIENT DETAIL ────────────────────────────────────────────────
function ClientDetail({client,onBack,showToast,notes,setNotes,onAddCall}){
  const [tab,setTab]=useState("funds");
  const [noteText,setNoteText]=useState("");
  const [newCall,setNewCall]=useState(false);
  const [nc,setNc]=useState({fund:client.funds[0].name,amount:"",due:"2026-07-30",purpose:"Portfolio Investment"});
  const comm=client.funds.reduce((s,f)=>s+f.committed,0);
  const called=client.funds.reduce((s,f)=>s+f.called,0);
  const nav=client.funds.reduce((s,f)=>s+f.nav,0);
  const dist=client.distributions.reduce((s,d)=>s+d.amount,0);
  const clientNotes=notes[client.id]||[];
  const pendingCalls=client.calls.filter(c=>c.status!=="Funded");
  const best=[...client.funds].sort((a,b)=>b.irr-a.irr)[0];
  const worst=[...client.funds].sort((a,b)=>a.irr-b.irr)[0];
  const addNote=()=>{
    if(!noteText.trim())return;
    setNotes(p=>({...p,[client.id]:[{ts:"2026-07-01",user:"schen",text:noteText.trim()},...(p[client.id]||[])]}));
    setNoteText("");showToast("Note saved");
  };
  const submitCall=()=>{
    const amt=Number(nc.amount);
    if(!amt||amt<=0){showToast("Enter a valid amount");return;}
    onAddCall(client.id,{date:nc.due,fund:nc.fund,purpose:nc.purpose,amount:amt,ref:`CC-2026-${uid()}`,status:"Notice Sent"});
    setNewCall(false);setNc({...nc,amount:""});setTab("calls");
    showToast("Capital call notice created · LP notified · task added");
  };
  return <div className="fade-in">
    <div className="px" style={{paddingTop:40,maxWidth:1400,margin:"0 auto"}}>
      <button onClick={onBack} style={{fontSize:12,color:"var(--text-dim)",background:"none",border:"none",marginBottom:16}}>← Back to Clients</button>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
        <div style={{minWidth:0}}>
          <div style={{fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--text-dim)",marginBottom:8}}>Client Account</div>
          <h1 className="page-title">{client.name}</h1>
          <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
            <span className="mono" style={{fontSize:11,color:"var(--gold)"}}>{client.accountId}</span>
            <span style={{fontSize:10,background:"var(--surface-2)",border:"1px solid var(--border)",padding:"3px 10px",color:"var(--text-dim)"}}>{client.type}</span>
            <span style={{fontSize:13,color:"var(--text-dim)"}}>Custodian: {client.custodian}</span>
            <span className="hide-mobile" style={{fontSize:13,color:"var(--text-dim)"}}>Benchmark: {client.benchmark}</span>
          </div>
        </div>
        <div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}>
          <GoldBtn outline small onClick={()=>showToast("Client report exported (PDF)")}>Export Report</GoldBtn>
          <GoldBtn small onClick={()=>setNewCall(true)}>New Call Notice</GoldBtn>
        </div>
      </div>
    </div>
    <Stats>
      <StatCard label="Client AUM" value={fmt(client.aum)} note="total assets" highlight/>
      <StatCard label="Committed / Called" value={fmtM(comm)} note={`${fmtM(called)} drawn`}/>
      <StatCard label="Portfolio NAV" value={fmt(nav)} note="latest valuations"/>
      <StatCard label="Distributed" value={fmt(dist)} note="returned to client" color="var(--green)"/>
    </Stats>
    <TabWrap><TabBar tabs={[["funds","Funds"],["calls","Capital Calls"],["distributions","Distributions"],["prep","Meeting Prep"],["notes",`Notes (${clientNotes.length})`]]} active={tab} onSelect={setTab}/></TabWrap>
    <Wrap>
      {tab==="funds"&&<div className="fade-in table-scroll">
        <table>
          <thead><tr><TH>Fund</TH><TH>Vintage</TH><TH>Strategy</TH>
            <TH right>Committed</TH><TH right>Called</TH><TH right>NAV</TH><TH right>IRR</TH><TH right>TVPI</TH><TH right>DPI</TH></tr></thead>
          <tbody>{client.funds.map(f=>(
            <TR key={f.id}>
              <TD bright><span style={{fontFamily:"Fraunces,serif",fontSize:15}}>{f.name}</span>
                <div className="mono" style={{fontSize:10,color:"var(--text-dim)"}}>{f.source}</div></TD>
              <TD><span style={{fontSize:10,background:"var(--surface-2)",border:"1px solid var(--border)",padding:"2px 8px",color:"var(--text-dim)"}}>{f.vintage}</span></TD>
              <TD style={{fontSize:12,color:"var(--text-dim)"}}>{f.strategy}</TD>
              <TD right bright>{fmt(f.committed)}</TD><TD right bright>{fmt(f.called)}</TD><TD right bright>{fmt(f.nav)}</TD>
              <TD right green={f.irr>=0} red={f.irr<0}>{f.irr.toFixed(1)}%</TD>
              <TD right bright>{f.tvpi.toFixed(2)}x</TD><TD right green>{f.dpi.toFixed(2)}x</TD>
            </TR>
          ))}</tbody>
        </table>
      </div>}
      {tab==="calls"&&<div className="fade-in table-scroll">
        <table>
          <thead><tr><TH>Date</TH><TH>Reference</TH><TH>Fund</TH><TH>Purpose</TH><TH>Status</TH><TH right>Amount</TH></tr></thead>
          <tbody>{client.calls.map((c,i)=>(
            <TR key={i}>
              <TD style={{fontSize:12,color:"var(--text-dim)"}}>{fmtDate(c.date)}</TD>
              <TD mono style={{color:"var(--text-dim)"}}>{c.ref}</TD>
              <TD><span style={{fontFamily:"Fraunces,serif",fontSize:14,color:"var(--text-bright)"}}>{c.fund}</span></TD>
              <TD style={{fontSize:12,color:"var(--text-dim)"}}>{c.purpose}</TD>
              <TD><StatusPill status={c.status}/></TD>
              <TD right bright>{fmt(c.amount)}</TD>
            </TR>
          ))}</tbody>
        </table>
      </div>}
      {tab==="distributions"&&<div className="fade-in table-scroll">
        <table>
          <thead><tr><TH>Date</TH><TH>Reference</TH><TH>Fund</TH><TH>Type</TH><TH right>Amount</TH></tr></thead>
          <tbody>{client.distributions.map((d,i)=>(
            <TR key={i}>
              <TD style={{fontSize:12,color:"var(--text-dim)"}}>{fmtDate(d.date)}</TD>
              <TD mono style={{color:"var(--text-dim)"}}>{d.ref}</TD>
              <TD><span style={{fontFamily:"Fraunces,serif",fontSize:14,color:"var(--text-bright)"}}>{d.fund}</span></TD>
              <TD><span style={{fontSize:11,background:"var(--surface-2)",border:"1px solid var(--border)",padding:"2px 8px",color:"var(--text-dim)"}}>{d.type}</span></TD>
              <TD right green>{fmt(d.amount)}</TD>
            </TR>
          ))}</tbody>
        </table>
      </div>}
      {tab==="prep"&&<div className="fade-in">
        <div className="premium-card" style={{padding:"clamp(18px,4vw,32px)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:24,borderBottom:"1px solid var(--border)",paddingBottom:20}}>
            <div>
              <div style={{fontFamily:"Fraunces,serif",fontSize:22,color:"var(--text-bright)"}}>Meeting One-Pager</div>
              <div style={{fontSize:12,color:"var(--text-dim)"}}>Auto-generated from live data · {fmtDate("2026-07-01")}</div>
            </div>
            <GoldBtn small onClick={()=>showToast("One-pager exported (PDF)")}>Export PDF</GoldBtn>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:28}}>
            <div>
              <div style={{fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--gold)",marginBottom:12}}>Portfolio Snapshot</div>
              {[["PE NAV",fmt(nav)],["% of AUM",`${((nav/client.aum)*100).toFixed(1)}% (target ${(client.targetPE*100).toFixed(0)}%)`],
                ["Committed / Called",`${fmtM(comm)} / ${fmtM(called)}`],["Uncalled exposure",fmt(comm-called)],
                ["Distributed to date",fmt(dist)],["Liquid reserves",fmt(client.liquidity)]].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",gap:8,padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,.04)",fontSize:13}}>
                  <span style={{color:"var(--text-dim)"}}>{l}</span><span style={{color:"var(--text-bright)",textAlign:"right"}}>{v}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--gold)",marginBottom:12}}>Talking Points</div>
              <ul style={{listStyle:"none",fontSize:13,lineHeight:1.8}}>
                <li style={{marginBottom:10}}>▸ <strong style={{color:"var(--green)"}}>Best performer:</strong> {best.name} at {best.irr.toFixed(1)}% IRR ({best.tvpi.toFixed(2)}x TVPI).</li>
                <li style={{marginBottom:10}}>▸ <strong style={{color:worst.irr<0?"var(--red)":"var(--text-bright)"}}>Watch item:</strong> {worst.name} at {worst.irr.toFixed(1)}% IRR{worst.irr<0?" — marked below cost":""}.</li>
                {pendingCalls.length>0&&<li style={{marginBottom:10}}>▸ <strong style={{color:"var(--gold)"}}>Upcoming calls:</strong> {pendingCalls.map(c=>`${fmt(c.amount)} (due ${fmtDate(c.date)})`).join("; ")} — confirm funding source.</li>}
                <li style={{marginBottom:10}}>▸ <strong>Pacing:</strong> {((nav/client.aum)*100).toFixed(1)}% PE vs. {(client.targetPE*100).toFixed(0)}% target — discuss 2026–2027 commitment appetite.</li>
                <li>▸ <strong>Housekeeping:</strong> K-1 receipt, wire instruction verification, notification preferences.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>}
      {tab==="notes"&&<div className="fade-in">
        <div className="premium-card" style={{padding:20,marginBottom:16}}>
          <div style={{fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--gold)",marginBottom:12}}>Add Note</div>
          <textarea className="input-field" rows={3} value={noteText} onChange={e=>setNoteText(e.target.value)}
            placeholder="Call notes, follow-ups, client preferences…" style={{resize:"vertical",marginBottom:12}}/>
          <GoldBtn small onClick={addNote}>Save Note</GoldBtn>
        </div>
        {clientNotes.length===0?<EmptyState msg="No notes yet for this client."/>:clientNotes.map((n,i)=>(
          <div key={i} className="premium-card" style={{padding:"14px 20px",marginBottom:10}}>
            <div style={{fontSize:13,lineHeight:1.7,marginBottom:6}}>{n.text}</div>
            <div className="mono" style={{fontSize:11,color:"var(--text-dim)"}}>{n.user} · {n.ts}</div>
          </div>
        ))}
      </div>}
    </Wrap>
    {newCall&&<Modal onClose={()=>setNewCall(false)}>
      <div style={{fontFamily:"Fraunces,serif",fontSize:22,color:"var(--text-bright)",marginBottom:4}}>New Capital Call Notice</div>
      <div style={{fontSize:12,color:"var(--text-dim)",marginBottom:22}}>{client.name} · notice will be sent to the LP portal and email</div>
      <Field label="Fund">
        <select className="input-field" value={nc.fund} onChange={e=>setNc({...nc,fund:e.target.value})}>
          {client.funds.map(f=><option key={f.id}>{f.name}</option>)}
        </select>
      </Field>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Field label="Amount (USD)"><input className="input-field mono" type="number" value={nc.amount} onChange={e=>setNc({...nc,amount:e.target.value})} placeholder="500000"/></Field>
        <Field label="Due Date"><input className="input-field" type="date" value={nc.due} onChange={e=>setNc({...nc,due:e.target.value})}/></Field>
      </div>
      <Field label="Purpose">
        <select className="input-field" value={nc.purpose} onChange={e=>setNc({...nc,purpose:e.target.value})}>
          {["Portfolio Investment","New Investment","Follow-on Investment","Acquisition","Fees & Expenses"].map(p=><option key={p}>{p}</option>)}
        </select>
      </Field>
      <div style={{display:"flex",gap:8,marginTop:6}}>
        <GoldBtn full onClick={submitCall}>Create &amp; Send Notice</GoldBtn>
        <GoldBtn outline onClick={()=>setNewCall(false)}>Cancel</GoldBtn>
      </div>
    </Modal>}
  </div>;
}

// ── ADVISOR PORTAL ───────────────────────────────────────────────
function AdvisorPortal({goTo,demo}){
  const [clients,setClients]=useState(CLIENTS_SEED);
  const [docs,setDocs]=useState(DOCUMENTS_SEED);
  const [view,setView]=useState("today");
  const [selClientId,setSelClientId]=useState(null);
  const [stratFilter,setStratFilter]=useState("All");
  const [search,setSearch]=useState("");
  const [toast,setToast]=useState("");
  const [tasks,setTasks]=useState(INITIAL_TASKS);
  const [notes,setNotes]=useState({1:[{ts:"2026-06-14",user:"schen",text:"James prefers quarterly Zoom reviews; son Michael joining meetings going forward as part of succession planning."}]});
  const showToast=msg=>{setToast(msg);setTimeout(()=>setToast(""),2600);};

  const selClient=clients.find(c=>c.id===selClientId);
  const addCall=(clientId,call)=>{
    const cname=clients.find(c=>c.id===clientId).name;
    setClients(p=>p.map(c=>c.id===clientId?{...c,calls:[call,...c.calls]}:c));
    setTasks(p=>[{id:Date.now(),due:call.date,priority:"high",client:cname,
      title:`Wire confirmation — ${call.fund} call ${call.ref}`,detail:`${fmt(call.amount)} due`,tag:"Capital Call",done:false},...p]);
  };

  const totalAum=clients.reduce((s,c)=>s+c.aum,0);
  const totalFunds=clients.reduce((s,c)=>s+c.funds.length,0);
  const totalNav=clients.flatMap(c=>c.funds).reduce((s,f)=>s+f.nav,0);
  const totalCommitted=clients.flatMap(c=>c.funds).reduce((s,f)=>s+f.committed,0);
  const totalDist=clients.flatMap(c=>c.distributions).reduce((s,d)=>s+d.amount,0);
  const openTasks=tasks.filter(t=>!t.done).length;

  const navItems=[["today",`Today${openTasks?` (${openTasks})`:""}`],["overview","Overview"],["clients","Clients"],["funds","Funds"],["analytics","Analytics"],["documents","Documents"],["ops","Ops"],["integrations","Integrations"]];
  const allFunds=clients.flatMap(c=>c.funds.map(f=>({...f,client:c.name})));
  const strategies=["All",...new Set(allFunds.map(f=>f.strategy))];
  const filteredFunds=stratFilter==="All"?allFunds:allFunds.filter(f=>f.strategy===stratFilter);
  const filteredClients=clients.filter(c=>c.name.toLowerCase().includes(search.toLowerCase())||c.type.toLowerCase().includes(search.toLowerCase()));
  const activeNav=view==="client-detail"?"clients":view;

  return <div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
    <Toast msg={toast}/>
    <TopNav goTo={goTo} items={navItems} active={activeNav}
      onSelect={k=>{setView(k);setSelClientId(null);}}
      user="Sarah Chen" badge={<Badge type="advisor"/>} demo={demo}
      onExit={()=>goTo(demo?"login":"home")} exitLabel={demo?"Sign In":"Sign out"}/>

    <main style={{flex:1,paddingTop:60}}>
      {view==="today"&&<TodayView showToast={showToast} tasks={tasks} setTasks={setTasks}/>}

      {view==="overview"&&<div className="fade-in">
        <PageHead kicker={`Investment Advisor Portal${demo?" · Demo":""}`} title="Advisor Overview"
          sub={`${clients.length} client relationships · ${INITIAL_INTEGRATIONS.filter(i=>i.status==="connected").length} live GP feeds`}>
          <GoldBtn outline small onClick={()=>showToast("Advisor report exported (PDF)")}>Export Report</GoldBtn>
        </PageHead>
        <Stats>
          <StatCard label="Total Client AUM" value={fmtM(totalAum)} note={`${clients.length} clients`} highlight/>
          <StatCard label="Total Committed" value={fmtM(totalCommitted)} note={`${totalFunds} positions`}/>
          <StatCard label="Portfolio NAV" value={fmtM(totalNav)} note="latest GP valuations"/>
          <StatCard label="Total Distributed" value={fmtM(totalDist)} note="returned to clients" color="var(--green)"/>
          <StatCard label="Active Funds" value={totalFunds} note="across all clients"/>
        </Stats>
        <div style={{marginTop:24}}><SectionHeader title="Client Roster" count={`${clients.length} clients`}/></div>
        <Wrap style={{paddingTop:16}}>
          <div className="table-scroll">
            <table>
              <thead><tr><TH>Client</TH><TH>Account ID</TH><TH>Type</TH>
                <TH right>AUM</TH><TH right>Committed</TH><TH right>NAV</TH><TH right>Distributed</TH><TH></TH></tr></thead>
              <tbody>{clients.map(c=>{
                const comm=c.funds.reduce((s,f)=>s+f.committed,0);
                const nv=c.funds.reduce((s,f)=>s+f.nav,0);
                const ds=c.distributions.reduce((s,d)=>s+d.amount,0);
                return <TR key={c.id} onClick={()=>{setSelClientId(c.id);setView("client-detail");}}>
                  <TD bright><span style={{fontFamily:"Fraunces,serif",fontSize:15}}>{c.name}</span></TD>
                  <TD mono style={{color:"var(--text-dim)"}}>{c.accountId}</TD>
                  <TD><span style={{fontSize:11,background:"var(--surface-2)",border:"1px solid var(--border)",padding:"2px 8px",color:"var(--text-dim)",whiteSpace:"nowrap"}}>{c.type}</span></TD>
                  <TD right bright>{fmt(c.aum)}</TD><TD right bright>{fmt(comm)}</TD>
                  <TD right bright>{fmt(nv)}</TD><TD right green>{fmt(ds)}</TD>
                  <TD><span style={{fontSize:12,color:"var(--gold)"}}>View →</span></TD>
                </TR>;
              })}</tbody>
            </table>
          </div>
        </Wrap>
      </div>}

      {view==="clients"&&<div className="fade-in">
        <PageHead kicker="Investment Advisor Portal" title="Client Accounts" sub={`${clients.length} relationships under management`}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search clients…" className="input-field" style={{maxWidth:220,marginBottom:8}}/>
        </PageHead>
        <Wrap>
          <div className="card-grid" style={{gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,300px),1fr))"}}>
            {filteredClients.map(c=>{
              const comm=c.funds.reduce((s,f)=>s+f.committed,0);
              const called=c.funds.reduce((s,f)=>s+f.called,0);
              const ds=c.distributions.reduce((s,d)=>s+d.amount,0);
              const rate=Math.round((called/comm)*100);
              return <div key={c.id} onClick={()=>{setSelClientId(c.id);setView("client-detail");}} className="premium-card" style={{cursor:"pointer"}}>
                <div style={{padding:"20px 20px 14px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4,gap:8}}>
                    <span style={{fontFamily:"Fraunces,serif",fontSize:17,color:"var(--text-bright)"}}>{c.name}</span>
                    <span style={{fontSize:10,background:"var(--surface-2)",border:"1px solid var(--border)",padding:"2px 8px",color:"var(--text-dim)",whiteSpace:"nowrap"}}>{c.type}</span>
                  </div>
                  <div className="mono" style={{fontSize:11,color:"var(--text-dim)",marginBottom:16}}>{c.accountId} · {c.custodian}</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
                    {[["AUM",fmtM(c.aum),false],["Committed",fmtM(comm),false],["Distributed",fmtM(ds),true]].map(([l,v,g])=>(
                      <div key={l}>
                        <div style={{fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--text-dim)",marginBottom:4}}>{l}</div>
                        <div style={{fontSize:13,fontWeight:500,color:g?"var(--green)":"var(--text-bright)"}}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <ProgressBar pct={rate}/>
                </div>
                <div style={{borderTop:"1px solid var(--border)",padding:"10px 20px",display:"flex",justifyContent:"flex-end"}}>
                  <span style={{fontSize:12,color:"var(--gold)"}}>View client →</span>
                </div>
              </div>;
            })}
          </div>
          {filteredClients.length===0&&<EmptyState msg="No clients match your search."/>}
        </Wrap>
      </div>}

      {view==="client-detail"&&selClient&&
        <ClientDetail client={selClient} onBack={()=>setView("clients")} showToast={showToast}
          notes={notes} setNotes={setNotes} onAddCall={addCall}/>}

      {view==="funds"&&<div className="fade-in">
        <PageHead kicker="Investment Advisor Portal" title="Fund Universe"
          sub={`${fmtM(filteredFunds.reduce((s,f)=>s+f.committed,0))} committed across the book`}>
          <select className="input-field" style={{maxWidth:200,marginBottom:8}} value={stratFilter} onChange={e=>setStratFilter(e.target.value)}>
            {strategies.map(s=><option key={s} value={s}>{s==="All"?"All Strategies":s}</option>)}
          </select>
        </PageHead>
        <Wrap>
          <div className="table-scroll">
            <table>
              <thead><tr><TH>Fund</TH><TH>Client</TH><TH>Vintage</TH><TH>Strategy</TH>
                <TH right>Committed</TH><TH right>NAV</TH><TH right>IRR</TH><TH right>TVPI</TH><TH>Call Rate</TH></tr></thead>
              <tbody>{filteredFunds.map((f,i)=>{
                const rate=Math.round((f.called/f.committed)*100);
                return <TR key={i}>
                  <TD bright><span style={{fontFamily:"Fraunces,serif",fontSize:15}}>{f.name}</span></TD>
                  <TD style={{fontSize:12,color:"var(--text-dim)"}}>{f.client}</TD>
                  <TD><span style={{fontSize:10,background:"var(--surface-2)",border:"1px solid var(--border)",padding:"2px 8px",color:"var(--text-dim)"}}>{f.vintage}</span></TD>
                  <TD style={{fontSize:12,color:"var(--text-dim)"}}>{f.strategy}</TD>
                  <TD right bright>{fmt(f.committed)}</TD><TD right bright>{fmt(f.nav)}</TD>
                  <TD right green={f.irr>=0} red={f.irr<0}>{f.irr.toFixed(1)}%</TD>
                  <TD right bright>{f.tvpi.toFixed(2)}x</TD>
                  <TD style={{minWidth:120}}><ProgressBar pct={rate}/></TD>
                </TR>;
              })}</tbody>
            </table>
          </div>
        </Wrap>
      </div>}

      {view==="analytics"&&<AnalyticsView showToast={showToast} clients={clients}/>}
      {view==="documents"&&<DocumentsView showToast={showToast} docs={docs} setDocs={setDocs} clients={clients}/>}
      {view==="ops"&&<OpsView showToast={showToast} clients={clients}/>}
      {view==="integrations"&&<IntegrationsView showToast={showToast}/>}
    </main>
    <Footer label={demo?"Investment Advisor Portal · Demo Environment":"Investment Advisor Portal"}/>
  </div>;
}

// ── LP PORTAL ────────────────────────────────────────────────────
function LpPortal({goTo}){
  const client={name:"James Harrington",entity:"Harrington Family Office",...CLIENTS_SEED[0]};
  const [page,setPage]=useState("dashboard");
  const [selFund,setSelFund]=useState(null);
  const [toast,setToast]=useState("");
  const [prefs,setPrefs]=useState({"Capital Call Notices":true,"Distribution Notices":true,"Quarterly Reports":true,"NAV Updates":false});
  const [pw,setPw]=useState({cur:"",next:""});
  const showToast=msg=>{setToast(msg);setTimeout(()=>setToast(""),2500);};
  const navItems=[["dashboard","Dashboard"],["commitments","Commitments"],["distributions","Distributions"],["documents","Documents"],["settings","Settings"]];
  const activeNav=page==="fund-detail"?"dashboard":page;
  const myDocs=DOCUMENTS_SEED.filter(d=>d.client===client.entity);

  return <div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
    <Toast msg={toast}/>
    <TopNav goTo={goTo} items={navItems} active={activeNav}
      onSelect={k=>{setPage(k);setSelFund(null);}}
      user={client.name} badge={<Badge type="lp"/>}
      onExit={()=>goTo("home")} exitLabel="Sign out"/>
    <main style={{flex:1,paddingTop:60}}>
      {page==="dashboard"&&(()=> {
        const total=client.funds.reduce((s,f)=>s+f.committed,0);
        const called=client.funds.reduce((s,f)=>s+f.called,0);
        const nav=client.funds.reduce((s,f)=>s+f.nav,0);
        const dist=client.distributions.reduce((s,d)=>s+d.amount,0);
        const pending=client.calls.filter(c=>c.status!=="Funded");
        return <div className="fade-in">
          <PageHead kicker="LP Portal" title="Investor Dashboard"
            sub={<span>{client.entity} · <span className="mono" style={{fontSize:12}}>{client.accountId}</span></span>}/>
          {pending.length>0&&<div className="px" style={{maxWidth:1400,margin:"20px auto 0"}}>
            <div className="premium-card" style={{padding:"14px 18px",borderLeft:"3px solid var(--gold)",
              display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
              <div>
                <div style={{fontSize:13,color:"var(--text-bright)"}}>Upcoming capital call: {fmt(pending[0].amount)} — {pending[0].fund}</div>
                <div style={{fontSize:12,color:"var(--text-dim)"}}>Due {fmtDate(pending[0].date)} · Ref {pending[0].ref}</div>
              </div>
              <GoldBtn small onClick={()=>showToast("Call notice opened")}>View Notice</GoldBtn>
            </div>
          </div>}
          <Stats>
            <StatCard label="Total Committed" value={fmtM(total)} note={`${client.funds.length} funds`} highlight/>
            <StatCard label="Capital Called" value={fmtM(called)} note="drawn to date"/>
            <StatCard label="Portfolio NAV" value={fmtM(nav)} note="latest valuations"/>
            <StatCard label="Distributions" value={fmtM(dist)} note="returned to LP" color="var(--green)"/>
          </Stats>
          <div style={{marginTop:24}}><SectionHeader title="Fund Portfolio" count={`${client.funds.length} funds`}/></div>
          <Wrap style={{paddingTop:16}}>
            <div className="table-scroll">
              <table>
                <thead><tr><TH>Fund</TH><TH>Vintage</TH><TH>Strategy</TH>
                  <TH right>Committed</TH><TH right>NAV</TH><TH right>IRR</TH><TH right>TVPI</TH><TH>Call Rate</TH><TH></TH></tr></thead>
                <tbody>{client.funds.map(f=>{
                  const rate=Math.round((f.called/f.committed)*100);
                  return <TR key={f.id} onClick={()=>{setSelFund(f);setPage("fund-detail");}}>
                    <TD bright><span style={{fontFamily:"Fraunces,serif",fontSize:15}}>{f.name}</span></TD>
                    <TD><span style={{fontSize:10,background:"var(--surface-2)",border:"1px solid var(--border)",padding:"2px 8px",color:"var(--text-dim)"}}>{f.vintage}</span></TD>
                    <TD style={{fontSize:12,color:"var(--text-dim)"}}>{f.strategy}</TD>
                    <TD right bright>{fmt(f.committed)}</TD><TD right bright>{fmt(f.nav)}</TD>
                    <TD right green={f.irr>=0} red={f.irr<0}>{f.irr.toFixed(1)}%</TD>
                    <TD right bright>{f.tvpi.toFixed(2)}x</TD>
                    <TD style={{minWidth:110}}><ProgressBar pct={rate}/></TD>
                    <TD><span style={{fontSize:12,color:"var(--gold)"}}>→</span></TD>
                  </TR>;
                })}</tbody>
              </table>
            </div>
            <div style={{padding:"24px 0",fontSize:11,color:"var(--text-dim)",lineHeight:1.7}}>
              Performance data ingested from GP feeds, presented per ILPA Reporting Standards. Figures are unaudited and subject to change.
            </div>
          </Wrap>
        </div>;
      })()}
      {page==="fund-detail"&&selFund&&(()=>{
        const calls=client.calls.filter(c=>c.fund===selFund.name);
        const dists=client.distributions.filter(d=>d.fund===selFund.name);
        const rate=Math.round((selFund.called/selFund.committed)*100);
        return <div className="fade-in">
          <div className="px" style={{paddingTop:40,maxWidth:1400,margin:"0 auto"}}>
            <button onClick={()=>setPage("dashboard")} style={{fontSize:12,color:"var(--text-dim)",background:"none",border:"none",marginBottom:16}}>← Dashboard</button>
            <div style={{fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--text-dim)",marginBottom:10}}>Fund Detail</div>
            <h1 className="page-title">{selFund.name}</h1>
            <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
              <span style={{fontSize:10,background:"var(--surface-2)",border:"1px solid var(--border)",padding:"3px 10px",color:"var(--text-dim)"}}>{selFund.vintage}</span>
              <span style={{fontSize:13,color:"var(--text-dim)"}}>{selFund.strategy}</span>
              <span className="mono" style={{fontSize:11,color:"var(--gold)"}}>Data: {selFund.source}</span>
            </div>
          </div>
          <Stats>
            <StatCard label="Your Commitment" value={fmtM(selFund.committed)} note={`${rate}% called`} highlight/>
            <StatCard label="Current NAV" value={fmtM(selFund.nav)} note="latest valuation"/>
            <StatCard label="Net IRR" value={`${selFund.irr.toFixed(1)}%`} note={`TVPI ${selFund.tvpi.toFixed(2)}x`} color={selFund.irr>=0?"var(--green)":"var(--red)"}/>
            <StatCard label="Distributed" value={fmtM(selFund.distributed)} note={`${dists.length} events`} color="var(--green)"/>
          </Stats>
          <Wrap style={{paddingBottom:0}}>
            <ChartBox title="Quarterly NAV" h={240}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={NAV_HISTORY[selFund.id]} margin={{top:8,right:8,left:0,bottom:0}}>
                  <CartesianGrid stroke="rgba(255,255,255,.05)" vertical={false}/>
                  <XAxis dataKey="q" tick={{fill:"#7a7269",fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tickFormatter={v=>fmtM(v)} tick={{fill:"#7a7269",fontSize:11}} axisLine={false} tickLine={false} width={52}/>
                  <Tooltip contentStyle={tooltipStyle} formatter={v=>fmt(v)}/>
                  <Line type="monotone" dataKey="nav" name="NAV" stroke="#c9a84c" strokeWidth={2} dot={{r:3,fill:"#c9a84c"}} activeDot={{r:6}}/>
                </LineChart>
              </ResponsiveContainer>
            </ChartBox>
          </Wrap>
          <div style={{marginTop:24}}><SectionHeader title="Capital Calls" count={calls.length}/></div>
          <Wrap style={{paddingTop:8,paddingBottom:16}}>
            {calls.length===0?<EmptyState msg="No capital calls recorded."/>:
            <div className="table-scroll"><table>
              <thead><tr><TH>Date</TH><TH>Reference</TH><TH>Purpose</TH><TH>Status</TH><TH right>Amount</TH></tr></thead>
              <tbody>{calls.map((c,i)=>(
                <TR key={i}>
                  <TD style={{fontSize:12,color:"var(--text-dim)"}}>{fmtDate(c.date)}</TD>
                  <TD mono style={{color:"var(--text-dim)"}}>{c.ref}</TD>
                  <TD style={{fontSize:12,color:"var(--text-dim)"}}>{c.purpose}</TD>
                  <TD><StatusPill status={c.status}/></TD>
                  <TD right bright>{fmt(c.amount)}</TD>
                </TR>
              ))}</tbody>
            </table></div>}
          </Wrap>
          <SectionHeader title="Distributions" count={dists.length}/>
          <Wrap style={{paddingTop:8}}>
            {dists.length===0?<EmptyState msg="No distributions recorded."/>:
            <div className="table-scroll"><table>
              <thead><tr><TH>Date</TH><TH>Reference</TH><TH>Type</TH><TH right>Amount</TH></tr></thead>
              <tbody>{dists.map((d,i)=>(
                <TR key={i}>
                  <TD style={{fontSize:12,color:"var(--text-dim)"}}>{fmtDate(d.date)}</TD>
                  <TD mono style={{color:"var(--text-dim)"}}>{d.ref}</TD>
                  <TD><span style={{fontSize:11,background:"var(--surface-2)",border:"1px solid var(--border)",padding:"2px 8px",color:"var(--text-dim)"}}>{d.type}</span></TD>
                  <TD right green>{fmt(d.amount)}</TD>
                </TR>
              ))}</tbody>
            </table></div>}
          </Wrap>
        </div>;
      })()}
      {page==="commitments"&&<div className="fade-in">
        <PageHead kicker="LP Portal" title="Commitment Schedule" sub="ILPA-aligned overview across all funds."/>
        <Wrap>
          <div className="table-scroll">
            <table>
              <thead><tr><TH>Fund</TH><TH>Vintage</TH><TH>Strategy</TH>
                <TH right>Committed</TH><TH right>Called</TH><TH right>Uncalled</TH><TH right>Distributed</TH><TH>Call Rate</TH></tr></thead>
              <tbody>{client.funds.map(f=>{
                const rate=Math.round((f.called/f.committed)*100);
                return <TR key={f.id} onClick={()=>{setSelFund(f);setPage("fund-detail");}}>
                  <TD bright><span style={{fontFamily:"Fraunces,serif",fontSize:15}}>{f.name}</span></TD>
                  <TD><span style={{fontSize:10,background:"var(--surface-2)",border:"1px solid var(--border)",padding:"2px 8px",color:"var(--text-dim)"}}>{f.vintage}</span></TD>
                  <TD style={{fontSize:12,color:"var(--text-dim)"}}>{f.strategy}</TD>
                  <TD right bright>{fmt(f.committed)}</TD><TD right bright>{fmt(f.called)}</TD>
                  <TD right green>{fmt(f.committed-f.called)}</TD><TD right green>{fmt(f.distributed)}</TD>
                  <TD style={{minWidth:110}}><ProgressBar pct={rate}/></TD>
                </TR>;
              })}</tbody>
            </table>
          </div>
        </Wrap>
      </div>}
      {page==="distributions"&&(()=>{
        const total=client.distributions.reduce((s,d)=>s+d.amount,0);
        return <div className="fade-in">
          <PageHead kicker="LP Portal" title="Distribution History" sub="ILPA-aligned record across all fund investments."/>
          <Stats>
            <StatCard label="Total Distributed" value={fmtM(total)} note="across all funds" color="var(--green)"/>
            <StatCard label="Events" value={client.distributions.length} note="notices"/>
            <StatCard label="Most Recent" value={fmtDate(client.distributions[0]?.date)} note={client.distributions[0]?.fund}/>
          </Stats>
          <Wrap>
            <div className="table-scroll">
              <table>
                <thead><tr><TH>Date</TH><TH>Reference</TH><TH>Fund</TH><TH>Type</TH><TH right>Amount</TH></tr></thead>
                <tbody>{client.distributions.map((d,i)=>(
                  <TR key={i}>
                    <TD style={{fontSize:12,color:"var(--text-dim)"}}>{fmtDate(d.date)}</TD>
                    <TD mono style={{color:"var(--text-dim)"}}>{d.ref}</TD>
                    <TD><span style={{fontFamily:"Fraunces,serif",fontSize:14,color:"var(--text-bright)"}}>{d.fund}</span></TD>
                    <TD><span style={{fontSize:11,background:"var(--surface-2)",border:"1px solid var(--border)",padding:"2px 8px",color:"var(--text-dim)"}}>{d.type}</span></TD>
                    <TD right green>{fmt(d.amount)}</TD>
                  </TR>
                ))}</tbody>
              </table>
            </div>
          </Wrap>
        </div>;
      })()}
      {page==="documents"&&<div className="fade-in">
        <PageHead kicker="LP Portal" title="My Documents" sub="Statements, K-1s, and notices for your account."/>
        <Wrap>
          {myDocs.length===0?<EmptyState msg="No documents available."/>:
          <div className="table-scroll">
            <table>
              <thead><tr><TH>Document</TH><TH>Fund</TH><TH>Type</TH><TH>Period</TH><TH>Date</TH><TH></TH></tr></thead>
              <tbody>{myDocs.map(d=>(
                <TR key={d.id}>
                  <TD bright><span style={{fontFamily:"Fraunces,serif",fontSize:14}}>{d.name}</span></TD>
                  <TD style={{fontSize:12,color:"var(--text-dim)"}}>{d.fund}</TD>
                  <TD><span style={{fontSize:10,padding:"2px 8px",background:"var(--surface-2)",border:"1px solid var(--border)",color:"var(--text-dim)",whiteSpace:"nowrap"}}>{d.type}</span></TD>
                  <TD style={{fontSize:12,color:"var(--text-dim)"}}>{d.period}</TD>
                  <TD style={{fontSize:12,color:"var(--text-dim)"}}>{fmtDate(d.ingested)}</TD>
                  <TD><GoldBtn small outline onClick={()=>showToast(`Downloading ${d.id}…`)}>Download</GoldBtn></TD>
                </TR>
              ))}</tbody>
            </table>
          </div>}
        </Wrap>
      </div>}
      {page==="settings"&&<div className="fade-in">
        <div className="px" style={{paddingTop:40,paddingBottom:48,maxWidth:800,margin:"0 auto"}}>
          <div style={{fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--text-dim)",marginBottom:10}}>LP Portal</div>
          <h1 className="page-title" style={{marginBottom:28}}>Account Settings</h1>
          <div className="premium-card" style={{padding:"clamp(18px,4vw,32px)",marginBottom:24}}>
            <div style={{fontFamily:"Fraunces,serif",fontSize:20,fontWeight:300,color:"var(--text-bright)",marginBottom:20}}>Profile</div>
            {[["Name",client.name],["Entity",client.entity],["Account ID",client.accountId],["Custodian",client.custodian],["Role","Limited Partner"],["Portal Access","Active"]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,padding:"14px 0",borderBottom:"1px solid var(--border)"}}>
                <span style={{fontSize:13,color:"var(--text-dim)"}}>{l}</span>
                <span style={{fontSize:14,color:"var(--text-bright)",textAlign:"right"}}>{v}</span>
              </div>
            ))}
          </div>
          <div className="premium-card" style={{padding:"clamp(18px,4vw,32px)",marginBottom:24}}>
            <div style={{fontFamily:"Fraunces,serif",fontSize:20,fontWeight:300,color:"var(--text-bright)",marginBottom:20}}>Notifications</div>
            {Object.entries(prefs).map(([p,on])=>(
              <div key={p} style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,padding:"14px 0",borderBottom:"1px solid var(--border)"}}>
                <span style={{fontSize:13,color:"var(--text-dim)"}}>{p}</span>
                <ToggleSw on={on} onClick={()=>{setPrefs(pr=>({...pr,[p]:!pr[p]}));showToast(`${p} ${!on?"enabled":"disabled"}`);}}/>
              </div>
            ))}
          </div>
          <div className="premium-card" style={{padding:"clamp(18px,4vw,32px)"}}>
            <div style={{fontFamily:"Fraunces,serif",fontSize:20,fontWeight:300,color:"var(--text-bright)",marginBottom:20}}>Change Password</div>
            <Field label="Current Password"><input type="password" placeholder="••••••••" className="input-field" style={{maxWidth:400}} value={pw.cur} onChange={e=>setPw({...pw,cur:e.target.value})}/></Field>
            <Field label="New Password"><input type="password" placeholder="••••••••" className="input-field" style={{maxWidth:400}} value={pw.next} onChange={e=>setPw({...pw,next:e.target.value})}/></Field>
            <GoldBtn disabled={!pw.cur||pw.next.length<8} onClick={()=>{setPw({cur:"",next:""});showToast("Password updated successfully");}}>
              {pw.next&&pw.next.length<8?"Min 8 characters":"Save Password"}
            </GoldBtn>
          </div>
        </div>
      </div>}
    </main>
    <Footer label="LP Portal · ILPA-aligned reporting"/>
  </div>;
}

// ── ROOT ─────────────────────────────────────────────────────────
export default function App(){
  const [screen,setScreen]=useState("home");
  const goTo=s=>setScreen(s);
  return <>
    <style>{css}</style>
    <GridOverlay/>
    {screen==="home"          && <HomeScreen goTo={goTo}/>}
    {screen==="login"         && <LoginScreen goTo={goTo}/>}
    {screen==="demo-advisor"  && <AdvisorPortal goTo={goTo} demo/>}
    {screen==="portal-lp"     && <LpPortal goTo={goTo}/>}
    {screen==="portal-advisor"&& <AdvisorPortal goTo={goTo}/>}
  </>;
}