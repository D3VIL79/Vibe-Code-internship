# 🚀 SalesIQ — Sales Objections Handling Assistant (SaaS)

> **AI-Powered Sales Intelligence Platform** by Manuj Bajaj | Powered by Google Gemini AI  
> Subscription-based SaaS with token metering, Razorpay payments, and video transcript training.

---

## 📋 Overview

SalesIQ converts the [Sales Objections Handling Assistant](https://sales-intelligence-tool-869368851430.asia-southeast1.run.app/) into a full subscription-based SaaS product with:

- **4 Subscription Tiers**: Always Free, Free Trial (1 month), Monthly (₹999), One-Time Lifetime (₹9,999)
- **Token-Based Usage**: Gemini API tokens consumed from buyer's account
- **Video Training**: Upload transcripts from your videos to personalize AI responses
- **Secure Backend**: API keys proxied server-side, JWT authentication

## 🏗️ Architecture

```
┌─────────────────────┐     ┌─────────────────────┐     ┌──────────────┐
│   React Frontend    │────▶│  Node.js Backend     │────▶│  PostgreSQL  │
│   (Vite + Tailwind) │     │  (Express + JWT)     │     │  Database    │
└─────────────────────┘     └──────────┬───────────┘     └──────────────┘
                                       │
                            ┌──────────┼───────────┐
                            ▼          ▼           ▼
                      ┌──────────┐ ┌────────┐ ┌──────────┐
                      │ Gemini   │ │Razorpay│ │Transcript│
                      │ API      │ │Payment │ │Processor │
                      └──────────┘ └────────┘ └──────────┘
```

## 📁 Project Structure

```
vibe-code-internship/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── common/         # LoadingSpinner, UpgradePrompt
│   │   │   ├── dashboard/      # TokenMeter, SubscriptionBadge, UsageChart
│   │   │   ├── layout/         # Navbar, Footer
│   │   │   ├── pricing/        # PricingCard, PricingSection
│   │   │   └── training/       # TranscriptUploader, YouTubeImporter
│   │   ├── contexts/           # AuthContext, SubscriptionContext
│   │   ├── pages/              # All page components
│   │   ├── services/           # Axios API client
│   │   ├── App.jsx             # Router + providers
│   │   └── main.jsx            # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js Backend
│   ├── config/                 # Database + plans config
│   ├── controllers/            # Auth, Reports, Subscriptions, Training
│   ├── middleware/              # JWT auth, rate limiter, token meter
│   ├── migrations/             # PostgreSQL schema
│   ├── routes/                 # Express routes
│   ├── services/               # Gemini AI, Razorpay, Transcript processing
│   ├── index.js                # Server entry point
│   └── package.json
│
├── docker-compose.yml          # Full-stack Docker setup
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (or use Docker)
- Google AI Studio API Key ([get one here](https://aistudio.google.com/apikey))
- Razorpay Account ([sign up](https://razorpay.com/)) — for payment features

### Option 1: Docker (Recommended)

```bash
# Clone and navigate
cd "vibe code internship"

# Set environment variables
cp server/.env.example server/.env
# Edit server/.env with your GEMINI_API_KEY and Razorpay credentials

# Start everything
docker-compose up -d

# Frontend: http://localhost:5173
# Backend:  http://localhost:3001
# Database: localhost:5432
```

### Option 2: Manual Setup

**1. Start PostgreSQL** and create a database:
```sql
CREATE DATABASE salesiq;
```

**2. Run the migration:**
```bash
psql -U your_user -d salesiq -f server/migrations/001_initial_schema.sql
```

**3. Configure the backend:**
```bash
cd server
cp .env.example .env
# Edit .env with your credentials:
#   DATABASE_URL=postgresql://user:pass@localhost:5432/salesiq
#   GEMINI_API_KEY=your_google_ai_key
#   JWT_SECRET=your_random_secret
#   RAZORPAY_KEY_ID=your_razorpay_key
#   RAZORPAY_KEY_SECRET=your_razorpay_secret
npm install
npm run dev
```

**4. Start the frontend:**
```bash
cd client
npm install
npm run dev
```

**5. Open** http://localhost:5173 🎉

## 💳 Subscription Tiers

| Feature | Always Free | Free Trial (1mo) | Monthly ₹999 | Lifetime ₹9,999 |
|---|:---:|:---:|:---:|:---:|
| Reports/month | 3 | 50 | Unlimited | Unlimited |
| Token limit | 10K | 100K | 500K | 500K |
| Stab & Twist | Basic | Full | Full | Full |
| 6KLH Breakdown | ❌ | ✅ | ✅ | ✅ |
| PDF Export | ❌ | ✅ | ✅ | ✅ |
| Video Training | ❌ | 3 uploads | Unlimited | Unlimited |
| Report History | Last 5 | Last 30 | Unlimited | Unlimited |
| WhatsApp/Email | ❌ | ✅ | ✅ | ✅ |

## 🎬 Video Training

Users can train the AI assistant with their own sales content:

1. **Paste Transcript**: Copy-paste video transcript text
2. **YouTube URL**: Submit a YouTube video URL for transcript extraction
3. Training data is injected into the Gemini system prompt for personalized responses

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Current user info

### Reports
- `POST /api/reports/generate` — Generate sales intelligence report
- `GET /api/reports` — List user's reports
- `GET /api/reports/:id` — Get specific report
- `DELETE /api/reports/:id` — Delete report

### Subscriptions
- `GET /api/subscriptions/plans` — List all plans
- `GET /api/subscriptions/status` — Current subscription
- `POST /api/subscriptions/checkout` — Create payment order
- `POST /api/subscriptions/verify` — Verify payment

### Training
- `POST /api/training/upload-transcript` — Upload transcript
- `GET /api/training` — List training data
- `DELETE /api/training/:id` — Delete training data

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| AI | Google Gemini API |
| Payments | Razorpay |
| Auth | JWT + bcrypt |
| Icons | Lucide React |
| Charts | Recharts |

## 📝 License

Built for Manuj Bajaj Sales Coach Systems. All rights reserved.

---

*"The prospect's silence is not a rejection; it is an unvoiced doubt that they are waiting for you to call out."* — Manuj Bajaj
