# Sidenode Human Security Dashboard - Setup Guide

## Project Overview

This is a breach monitoring and identity security dashboard for individuals, built as part of the Sidenode ecosystem.

### Stack
- **Frontend**: React + TypeScript + Vite
- **Backend**: Cloudflare Pages Functions (serverless)
- **Database**: Supabase (PostgreSQL) or Cloudflare D1
- **Deployment**: Cloudflare Pages
- **APIs**: XposedOrNot (free breach monitoring) or HaveIBeenPwned ($3.50/month)

## Quick Start (Local Development)

### 1. Clone & Install

```bash
git clone https://github.com/Halema-org/sidenode-human-security.git
cd sidenode-human-security
npm install
```

### 2. Create Project Structure

Create these files and folders:

```
sidenode-human-security/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── BreachList.tsx
│   │   ├── RiskBadge.tsx
│   │   └── TaskChecklist.tsx
│   ├── api/
│   │   └── breachService.ts
│   └── types.ts
├── functions/
│   └── api/
│       └── breach-lookup.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .env.local
```

### 3. Environment Variables

Create `.env.local`:

```
VITE_API_URL=http://localhost:8788
BREACH_API_KEY=your_key_here
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

## Deployment to Cloudflare Pages

### 1. Connect GitHub to Cloudflare

1. Go to https://dash.cloudflare.com
2. Pages → Create a project → Connect to Git
3. Select `Halema-org/sidenode-human-security`

### 2. Build Configuration

- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/`

### 3. Environment Variables (Production)

Add in Cloudflare Dashboard:
- `BREACH_API_KEY`: Your XposedOrNot or HIBP API key

### 4. Custom Domain

In Cloudflare Pages settings:
- Add custom domain: `sidenode.org/human-security` (as a route)

## API Integration

### Option 1: XposedOrNot API (FREE)

```typescript
const response = await fetch(
  `https://api.xposedornot.com/v1/check-email/${email}`
);
```

### Option 2: HaveIBeenPwned ($3.50/month)

```typescript
const response = await fetch(
  `https://haveibeenpwned.com/api/v3/breachedaccount/${email}`,
  { headers: { 'hibp-api-key': process.env.BREACH_API_KEY } }
);
```

## Data Model

### Core Entities

```typescript
interface Person {
  id: string;
  primaryEmail: string;
  createdAt: Date;
}

interface BreachEvent {
  id: string;
  personId: string;
  source: string;
  breachDate: Date;
  exposedDataTypes: string[];
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'OPEN' | 'REMEDIATED';
}

interface RemediationTask {
  id: string;
  personId: string;
  type: string;
  recommendedAction: string;
  status: 'OPEN' | 'COMPLETED';
}
```

## Next Steps

1. **Create React components** in `src/components/`
2. **Build API routes** in `functions/api/`
3. **Set up Supabase** (or D1) for data storage
4. **Integrate breach API** of your choice
5. **Deploy to Cloudflare Pages**

## Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [XposedOrNot API](https://github.com/XposedOrNot/XposedOrNot-API)
- [HaveIBeenPwned API](https://haveibeenpwned.com/API/v3)
- [Supabase Docs](https://supabase.com/docs)

## Support

For questions, open an issue on GitHub or contact via Sidenode.org.
