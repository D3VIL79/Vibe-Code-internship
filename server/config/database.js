import pkg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PLANS } from './plans.js';

dotenv.config();

const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// In Vercel serverless environments, write permissions are restricted to /tmp
const isVercel = Boolean(process.env.VERCEL);
const DATA_DIR = isVercel ? '/tmp/data' : path.resolve(__dirname, '../data');
const DB_FILE = path.resolve(DATA_DIR, 'sales_database.json');

// Constant user IDs for consistent demo login
export const DEMO_USERS = {
  free: {
    id: '11111111-1111-4000-8000-111111111111',
    email: 'free@salesiq.ai',
    name: 'Alex Miller',
    role: 'Junior Sales Rep',
    plan_id: 'free',
    description: 'Starter tier SDR testing basic 6KLH objection scripts.',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    tokens_used: 4800,
    tokens_limit: 10000,
    reports_generated: 2
  },
  trial: {
    id: '22222222-2222-4000-8000-222222222222',
    email: 'trial@salesiq.ai',
    name: 'Sarah Chen',
    role: 'Mid-Market Account Executive',
    plan_id: 'trial',
    description: 'Trial subscriber with active 30-day trial and custom call uploads.',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    tokens_used: 32500,
    tokens_limit: 100000,
    reports_generated: 14
  },
  monthly: {
    id: '33333333-3333-4000-8000-333333333333',
    email: 'pro@salesiq.ai',
    name: 'Marcus Vance',
    role: 'VP of Global Enterprise Sales',
    plan_id: 'monthly',
    description: 'Monthly Pro subscriber closing 6-figure enterprise deals with unlimited reports.',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    tokens_used: 142000,
    tokens_limit: 500000,
    reports_generated: 48
  },
  lifetime: {
    id: '44444444-4444-4000-8000-444444444444',
    email: 'lifetime@salesiq.ai',
    name: 'Elena Rostova',
    role: 'Founder & High-Ticket Dealmaker',
    plan_id: 'lifetime',
    description: 'Lifetime VIP Pass holder with full unlimited access and custom training.',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    tokens_used: 285000,
    tokens_limit: 500000,
    reports_generated: 112
  },
  demo: {
    id: 'bb409abb-3be9-40ca-b96e-d72ad9835ac6',
    email: 'demo@salesiq.ai',
    name: 'Demo Sales Leader',
    role: 'Sales Enablement Manager',
    plan_id: 'trial',
    description: 'Default demo account for preview and testing.',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    tokens_used: 14200,
    tokens_limit: 100000,
    reports_generated: 4
  }
};

const DEFAULT_PASSWORD_HASH = bcrypt.hashSync('password123', 10);

const buildInitialStore = () => {
  const users = Object.values(DEMO_USERS).map(u => ({
    id: u.id,
    email: u.email,
    password_hash: DEFAULT_PASSWORD_HASH,
    name: u.name,
    google_id: null,
    avatar_url: u.avatar_url,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString()
  }));

  const plans = Object.values(PLANS).map(p => ({
    id: p.id,
    name: p.name,
    price_inr: p.price_inr,
    billing_cycle: p.billing_cycle,
    token_limit: p.token_limit,
    report_limit: p.report_limit,
    features: p.features,
    is_active: p.is_active
  }));

  const subscriptions = Object.values(DEMO_USERS).map(u => ({
    id: randomUUID(),
    user_id: u.id,
    plan_id: u.plan_id,
    status: 'active',
    razorpay_subscription_id: u.plan_id === 'monthly' ? 'sub_live_monthly_999' : null,
    tokens_used: u.tokens_used,
    tokens_limit: u.tokens_limit,
    reports_generated: u.reports_generated,
    created_at: new Date(Date.now() - 25 * 86400000).toISOString()
  }));

  const reports = [
    // Free User Reports
    {
      id: randomUUID(),
      user_id: DEMO_USERS.free.id,
      product: 'SalesIQ CRM Starter',
      industry: 'B2B Tech',
      tokens_used: 1200,
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      report_data: {
        summary: "Strategic 6KLH Sales Playbook for SalesIQ CRM Starter in B2B Tech sector.",
        objections: [
          {
            category: "Pricing & Budget",
            items: [
              {
                objection: "We already use basic Google Sheets and Free Notion for CRM.",
                stab: "Completely understand; free tools are comfortable and have zero up-front software bill.",
                twist: "However, our audits show sales reps spend 6.4 hours weekly manually copying leads, losing 1 in 4 deals to forgotten follow-ups.",
                six_klh_breakdown: "Re-anchor from software cost to reclaimed deal revenue.",
                closing_offer_pitch: "Let us import your first 50 leads today with zero risk."
              }
            ]
          }
        ]
      }
    },
    // Trial User Reports
    {
      id: randomUUID(),
      user_id: DEMO_USERS.trial.id,
      product: 'SOC-2 Compliance Cloud',
      industry: 'Cybersecurity & FinTech',
      tokens_used: 2400,
      created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      report_data: {
        summary: "Enterprise sales playbook tackling compliance audit delays and implementation resistance.",
        objections: [
          {
            category: "Timing & Urgency",
            items: [
              {
                objection: "We are not planning to start SOC-2 until Q4 when our next audit happens.",
                stab: "Audit schedules dictate priorities, and no team wants audit preparation earlier than necessary.",
                twist: "Enterprise buyers now demand SOC-2 reports during initial RFPs; delaying certification disqualifies your deals before you reach procurement.",
                six_klh_breakdown: "1. Know: Enterprise security gate criteria. 2. Trust: Continuous audit readiness without engineering crunch.",
                closing_offer_pitch: "Let us conduct a 1-day automated readiness scan so you know your gap score today."
              }
            ]
          }
        ]
      }
    },
    // Monthly Pro Reports
    {
      id: randomUUID(),
      user_id: DEMO_USERS.monthly.id,
      product: 'AI Supply Chain Intelligence ($140k ARR)',
      industry: 'Logistics & Manufacturing',
      tokens_used: 3200,
      created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      report_data: {
        summary: "High-ticket objection mastery for Chief Procurement Officers and VP Operations.",
        objections: [
          {
            category: "Executive Risk Aversion",
            items: [
              {
                objection: "Our ERP vendor SAP promised to release their own predictive module next year.",
                stab: "Consolidating software with SAP is an attractive goal that every CIO hopes for.",
                twist: "ERP modules are generalized databases; specialized supply chain predictability requires domain-trained algorithms. Waiting 12 months costs $420k in stockout losses.",
                six_klh_breakdown: "Differentiate point solution intelligence from generic transactional record systems.",
                closing_offer_pitch: "We integrate directly with SAP in 48 hours without disrupting existing workflows."
              }
            ]
          }
        ]
      }
    },
    // Lifetime VIP Reports
    {
      id: randomUUID(),
      user_id: DEMO_USERS.lifetime.id,
      product: 'Private Equity Value Acceleration Platform',
      industry: 'Financial Services & PE',
      tokens_used: 4100,
      created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
      report_data: {
        summary: "Board-level objection defense for Managing Partners handling portfolio company performance optimization.",
        objections: [
          {
            category: "Fee Justification & Multiples",
            items: [
              {
                objection: "We already employ operating partners to fix sales performance.",
                stab: "Your operating partners possess incredible macro vision and deal structuring expertise.",
                twist: "Operating partners cannot listen to 500 Gong calls per week across 12 portfolio companies; our AI system identifies revenue leaks in real time.",
                six_klh_breakdown: "Position tool as force-multiplier for operating partners, driving EBITDA multiple expansion.",
                closing_offer_pitch: "Deploy on one test asset for 60 days to evaluate revenue lift before portfolio-wide rollout."
              }
            ]
          }
        ]
      }
    },
    // Demo user sample report
    {
      id: randomUUID(),
      user_id: DEMO_USERS.demo.id,
      product: 'SaaS Platform CRM',
      industry: 'B2B Software',
      tokens_used: 1850,
      created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      report_data: {
        summary: "Strategic 6KLH sales playbook countering competitor discounting and price anchoring.",
        objections: [
          {
            category: "Pricing & Budget Constraints",
            items: [
              {
                objection: "Your solution is significantly more expensive than our current tool.",
                stab: "I appreciate that budget scrutiny is top-of-mind, and every line item must justify itself.",
                twist: "What our clients found is that cheaper tools lacked real-time objection coaching, causing reps to miss quota by 18% on average.",
                six_klh_breakdown: "Re-frame pricing into ROI of closing just one additional deal per rep per month.",
                closing_offer_pitch: "Let us run a 14-day team pilot on 3 live opportunities to demonstrate win-rate impact."
              }
            ]
          }
        ]
      }
    }
  ];

  const training_data = [
    {
      id: randomUUID(),
      user_id: DEMO_USERS.trial.id,
      source_type: 'text',
      title: 'Q3 Enterprise Objection Calls - Handling Budget Stalls',
      content: 'Excerpts from top rep calls dealing with CFO budget freeze objections in SaaS contracts.',
      processed: true,
      created_at: new Date(Date.now() - 10 * 86400000).toISOString()
    },
    {
      id: randomUUID(),
      user_id: DEMO_USERS.monthly.id,
      source_type: 'youtube',
      title: 'Manuj Bajaj 6KLH Masterclass Video Notes',
      content: 'https://youtube.com/watch?v=sample-6klh-mastery - Deep dive into Stab & Twist psychology.',
      processed: true,
      created_at: new Date(Date.now() - 14 * 86400000).toISOString()
    },
    {
      id: randomUUID(),
      user_id: DEMO_USERS.lifetime.id,
      source_type: 'text',
      title: 'C-Level Pitch Deck Rebuttal Playbook',
      content: 'Proven scripts for handling board objections, multiple compression, and valuation scrutiny.',
      processed: true,
      created_at: new Date(Date.now() - 20 * 86400000).toISOString()
    }
  ];

  return {
    users,
    plans,
    subscriptions,
    reports,
    training_data,
    token_usage: []
  };
};

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    console.warn('[Database] Could not create data directory:', e.message);
  }
}

// Load or initialize store from disk
let inMemoryStore;

const loadStoreFromDisk = () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.users) && parsed.users.length > 0) {
        console.log(`[Database] Loaded persistent database from ${DB_FILE} with ${parsed.users.length} users`);
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[Database] Failed to read db file, initializing defaults:', err.message);
  }

  const initial = buildInitialStore();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    console.log(`[Database] Initialized new persistent database file at ${DB_FILE}`);
  } catch (err) {
    console.warn('[Database] Failed to write initial db file:', err.message);
  }
  return initial;
};

inMemoryStore = loadStoreFromDisk();

// Helper to persist store to disk
let saveTimeout = null;
export const persistStore = () => {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(inMemoryStore, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Database] Error saving to disk:', err.message);
    }
  }, 100);
};

// Standalone, self-contained database engine with zero external database dependencies.
// All users, subscriptions, training transcripts, and reports are managed purely in-code and local storage.
let pool = null;
let useDatabaseUrl = false;

// If a valid remote PostgreSQL database URL is explicitly passed and desired, optional pool can be enabled.
// By default, no external database server is required.
if (process.env.ENABLE_POSTGRES_DB === 'true' && process.env.DATABASE_URL) {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 2000,
      ssl: process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL.includes('localhost') && !process.env.DATABASE_URL.includes('127.0.0.1')
        ? { rejectUnauthorized: false }
        : false
    });
    useDatabaseUrl = true;
  } catch (err) {
    console.log('[Database] Running in pure code-based mode.');
    pool = null;
    useDatabaseUrl = false;
  }
} else {
  console.log('[Database] Pure code-based in-memory & file storage mode active. No external DB needed.');
}

/**
 * Handle in-memory query execution for local/preview environment
 */
const executeInMemoryQuery = (text, params = []) => {
  const normalized = text.replace(/\s+/g, ' ').trim();
  const lower = normalized.toLowerCase();

  // 1. Check if user exists by email
  if (lower.includes('from users') && lower.includes('where email = $1')) {
    const email = params[0];
    const user = inMemoryStore.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
    return {
      rows: user ? [user] : [],
      rowCount: user ? 1 : 0
    };
  }

  // 2. Select user by ID
  if (lower.includes('from users') && lower.includes('where id = $1')) {
    const id = params[0];
    const user = inMemoryStore.users.find(u => u.id === id);
    if (!user) return { rows: [], rowCount: 0 };
    return {
      rows: [{
        id: user.id,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url || null
      }],
      rowCount: 1
    };
  }

  // 3. Insert user
  if (lower.startsWith('insert into users')) {
    const id = randomUUID();
    let email, passwordHash, name, googleId, avatarUrl;

    if (params.length >= 5) {
      [email, passwordHash, name, googleId, avatarUrl] = params;
    } else {
      [email, passwordHash, name] = params;
    }

    const newUser = {
      id,
      email,
      password_hash: passwordHash,
      name: name || email.split('@')[0],
      google_id: googleId || null,
      avatar_url: avatarUrl || null,
      created_at: new Date().toISOString()
    };
    inMemoryStore.users.push(newUser);
    persistStore();

    return {
      rows: [{
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        avatar_url: newUser.avatar_url
      }],
      rowCount: 1
    };
  }

  // 4. Subscriptions for user
  if (lower.includes('from subscriptions') && lower.includes('where s.user_id = $1')) {
    const userId = params[0];
    const sub = inMemoryStore.subscriptions
      .filter(s => s.user_id === userId && s.status === 'active')
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

    if (!sub) return { rows: [], rowCount: 0 };
    const plan = inMemoryStore.plans.find(p => p.id === sub.plan_id) || PLANS.free;

    return {
      rows: [{
        ...sub,
        plan_name: plan.name,
        features: plan.features,
        report_limit: plan.report_limit
      }],
      rowCount: 1
    };
  }

  // 5. Insert subscription
  if (lower.startsWith('insert into subscriptions')) {
    const id = randomUUID();
    let userId, planId, status, razorpaySubId, tokensLimit;

    if (lower.includes('razorpay_subscription_id')) {
      [userId, planId, status, razorpaySubId, tokensLimit] = params;
    } else {
      [userId, planId, tokensLimit] = params;
      status = 'active';
    }

    const newSub = {
      id,
      user_id: userId,
      plan_id: planId,
      status: status || 'active',
      razorpay_subscription_id: razorpaySubId || null,
      tokens_used: 0,
      tokens_limit: tokensLimit ?? 10000,
      reports_generated: 0,
      created_at: new Date().toISOString()
    };
    inMemoryStore.subscriptions.push(newSub);
    persistStore();

    return {
      rows: [newSub],
      rowCount: 1
    };
  }

  // 6. Cancel subscriptions
  if (lower.startsWith('update subscriptions set status = \'cancelled\'')) {
    const userId = params[0];
    let count = 0;
    inMemoryStore.subscriptions.forEach(s => {
      if (s.user_id === userId) {
        s.status = 'cancelled';
        count++;
      }
    });
    persistStore();
    return { rows: [], rowCount: count };
  }

  // 7. Update tokens_used
  if (lower.startsWith('update subscriptions set tokens_used = tokens_used + $1')) {
    const [tokensUsed, subId] = params;
    const sub = inMemoryStore.subscriptions.find(s => s.id === subId);
    if (sub) {
      sub.tokens_used = (sub.tokens_used || 0) + Number(tokensUsed);
      sub.reports_generated = (sub.reports_generated || 0) + 1;
      persistStore();
    }
    return { rows: sub ? [sub] : [], rowCount: sub ? 1 : 0 };
  }

  // 8. Insert token_usage
  if (lower.startsWith('insert into token_usage')) {
    const [userId, subId, tokens, action] = params;
    inMemoryStore.token_usage.push({
      id: randomUUID(),
      user_id: userId,
      subscription_id: subId,
      tokens_consumed: tokens,
      action,
      created_at: new Date().toISOString()
    });
    persistStore();
    return { rows: [], rowCount: 1 };
  }

  // 9. Training Data Queries
  if (lower.includes('from training_data') && lower.includes('where user_id = $1 and processed = true')) {
    const userId = params[0];
    const rows = inMemoryStore.training_data.filter(t => t.user_id === userId && t.processed);
    return { rows, rowCount: rows.length };
  }

  if (lower.includes('from training_data') && lower.includes('where user_id = $1')) {
    const userId = params[0];
    const rows = inMemoryStore.training_data
      .filter(t => t.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return { rows, rowCount: rows.length };
  }

  if (lower.startsWith('insert into training_data')) {
    const [userId, title, content] = params;
    const isYoutube = lower.includes("'youtube'");
    const newDoc = {
      id: randomUUID(),
      user_id: userId,
      source_type: isYoutube ? 'youtube' : 'text',
      title,
      content,
      processed: true,
      created_at: new Date().toISOString()
    };
    inMemoryStore.training_data.push(newDoc);
    persistStore();
    return { rows: [newDoc], rowCount: 1 };
  }

  if (lower.startsWith('delete from training_data') && lower.includes('where id = $1 and user_id = $2')) {
    const [id, userId] = params;
    const index = inMemoryStore.training_data.findIndex(t => t.id === id && t.user_id === userId);
    if (index !== -1) {
      inMemoryStore.training_data.splice(index, 1);
      persistStore();
      return { rows: [{ id }], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // 10. Reports Queries
  if (lower.startsWith('insert into reports')) {
    const [userId, product, industry, reportData, tokensUsed] = params;
    const newReport = {
      id: randomUUID(),
      user_id: userId,
      product,
      industry,
      report_data: reportData,
      tokens_used: tokensUsed || 0,
      created_at: new Date().toISOString()
    };
    inMemoryStore.reports.push(newReport);
    persistStore();
    return { rows: [newReport], rowCount: 1 };
  }

  if (lower.includes('from reports') && lower.includes('where user_id = $1 order by created_at desc')) {
    const userId = params[0];
    const rows = inMemoryStore.reports
      .filter(r => r.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 50);
    return { rows, rowCount: rows.length };
  }

  if (lower.includes('from reports') && lower.includes('where id = $1 and user_id = $2')) {
    const [id, userId] = params;
    const report = inMemoryStore.reports.find(r => r.id === id && r.user_id === userId);
    return { rows: report ? [report] : [], rowCount: report ? 1 : 0 };
  }

  if (lower.startsWith('delete from reports') && lower.includes('where id = $1 and user_id = $2')) {
    const [id, userId] = params;
    const idx = inMemoryStore.reports.findIndex(r => r.id === id && r.user_id === userId);
    if (idx !== -1) {
      inMemoryStore.reports.splice(idx, 1);
      persistStore();
      return { rows: [{ id }], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  return { rows: [], rowCount: 0 };
};

/**
 * Execute a query on the database or fallback store.
 */
export const query = async (text, params = []) => {
  if (pool && useDatabaseUrl) {
    try {
      return await pool.query(text, params);
    } catch (err) {
      const isConnectionError =
        err.code === 'ECONNREFUSED' ||
        err.code === 'ENOTFOUND' ||
        err.code === 'ETIMEDOUT' ||
        err.code === 'EHOSTUNREACH' ||
        err.message?.includes('ECONNREFUSED');

      if (isConnectionError) {
        useDatabaseUrl = false;
        if (pool) {
          pool.end().catch(() => {});
          pool = null;
        }
        console.log(`[Database] PostgreSQL host unreachable (${err.message}). Switched to persistent fallback database.`);
      } else {
        console.warn('[Database] Query failed on PostgreSQL, executing fallback:', err.message);
      }
      return executeInMemoryQuery(text, params);
    }
  }
  return executeInMemoryQuery(text, params);
};

export const dbFallbackStore = inMemoryStore;

export default {
  query,
  connect: async () => ({
    query,
    release: () => {}
  })
};
