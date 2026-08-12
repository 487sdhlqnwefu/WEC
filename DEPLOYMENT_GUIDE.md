# WEC Website — Deployment Guide

## Quick Start (Railway — Easiest Option)

### Step 1: Push to GitHub
```bash
# Create a new GitHub repo
# Then push this project:
git init
git add .
git commit -m "WEC fullstack website"
git remote add origin https://github.com/YOUR_USERNAME/wec-website.git
git push -u origin main
```

### Step 2: Deploy on Railway
1. Go to [railway.app](https://railway.app) and sign up/login
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your `wec-website` repo
4. Railway will auto-detect the Node.js app
5. Click **Add a Database** → **MySQL**
6. Railway will auto-link the database (sets `DATABASE_URL` env var)
7. Add these environment variables:

| Variable | Value | Where to Get It |
|----------|-------|-----------------|
| `STRIPE_SECRET_KEY` | `sk_live_...` | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |
| `STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |
| `FRONTEND_URL` | `https://your-railway-url.up.railway.app` | Railway provides this after deploy |
| `RESEND_API_KEY` | `re_...` | [Resend API Keys](https://resend.com/api-keys) |
| `FROM_EMAIL` | `tristan@worldespressochampionship.com` | Your domain (or use `onboarding@resend.dev` for testing) |
| `ADMIN_EMAIL` | `tristan@worldespressochampionship.com` | Where you want notifications sent |

8. Click **Deploy** — Railway builds and deploys everything automatically

### Step 3: Set Up Stripe
1. Create a [Stripe account](https://dashboard.stripe.com/register) (if you don't have one)
2. Go to **Developers** → **API Keys**
3. Copy the **Secret key** (starts with `sk_live_` for production)
4. Add it to Railway environment variables as `STRIPE_SECRET_KEY`
5. For testing, use test keys (`sk_test_...`) — no real charges

### Step 4: Set Up Resend (Email)
1. Create a [Resend account](https://resend.com)
2. Go to **API Keys** → **Create API Key**
3. Copy the key (starts with `re_`)
4. Add it to Railway as `RESEND_API_KEY`
5. **Verify your domain** (worldespressochampionship.com) in Resend:
   - Go to **Domains** → **Add Domain**
   - Follow DNS setup instructions
   - Or use `onboarding@resend.dev` for testing without domain verification

### Step 5: Connect Your Domain
1. In Railway, go to your project → **Settings** → **Domains**
2. Add `worldespressochampionship.com`
3. Follow Railway's DNS instructions (usually a CNAME record)
4. Update `FRONTEND_URL` env var to your custom domain

---

## Alternative: Deploy Frontend + Backend Separately

### Frontend on Vercel
1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. **New Project** → Import your repo
4. Framework preset: `Vite`
5. Build command: `npm run build`
6. Output directory: `dist/public`
7. Add environment variables:
   - `VITE_APP_ID` (same as in .env)
   - `VITE_KIMI_AUTH_URL` (same as in .env)
8. Deploy

### Backend on Railway
1. Create a new Railway project
2. Add a MySQL database
3. Deploy from the same GitHub repo
4. Add all environment variables (Stripe, Resend, DB URL)
5. Set `FRONTEND_URL` to your Vercel URL

---

## Cost Estimate (Railway)

| Component | Cost |
|-----------|------|
| Railway Starter Plan | ~$5/month |
| MySQL Database | Included |
| Stripe Transaction Fees | 1.5% + €0.25 per transaction (EU cards) |
| Resend Email | Free up to 3,000 emails/month, then $0.0001/email |
| **Total** | **~$5/month + transaction fees** |

---

## Environment Variables Reference

### Required (Already Configured)
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | MySQL connection string (auto-set by Railway) |
| `APP_ID` | Kimi OAuth app ID |
| `APP_SECRET` | Kimi OAuth app secret |
| `VITE_APP_ID` | Same as APP_ID (for frontend) |
| `VITE_KIMI_AUTH_URL` | Kimi auth endpoint |

### You Need to Add
| Variable | Description | Example |
|----------|-------------|---------|
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_live_...` |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_live_...` |
| `FRONTEND_URL` | Your website URL | `https://worldespressochampionship.com` |
| `RESEND_API_KEY` | Resend API key | `re_...` |
| `FROM_EMAIL` | Sender email address | `tristan@worldespressochampionship.com` |
| `ADMIN_EMAIL` | Admin notification email | `tristan@worldespressochampionship.com` |

---

## What Happens When Someone Submits a Form

1. **Registration** (Competitor/Judge/Volunteer)
   - Data saved to MySQL database
   - Admin email notification sent via Resend
   - Confirmation email sent to registrant

2. **Sponsorship Inquiry**
   - Data saved to database
   - Admin notification sent
   - Confirmation sent to sponsor

3. **Contact Form**
   - Data saved to database
   - Admin notification sent
   - Confirmation sent to user

4. **National Organiser Application**
   - Data saved to database
   - Admin notification sent

5. **Store Purchase**
   - Redirected to Stripe Checkout
   - Payment processed securely by Stripe
   - Order saved to database
   - Admin notified

---

## Admin Dashboard

Access: `/admin`

**Only users with `admin` role can access.**

To make a user an admin:
1. Sign in to the website
2. Ask me to run a database query, or
3. I can build a simple admin promotion tool

---

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type check
npm run check

# Build for production
npm run build

# Database operations
npm run db:push      # Sync schema to database
npm run db:generate  # Generate migration files
npm run db:migrate   # Apply migrations

# Seed data
npx tsx db/seed.ts
```

---

## Support

Questions? Issues? The entire codebase is in `/mnt/agents/output/app/`.
