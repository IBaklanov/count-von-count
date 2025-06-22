# Development Guide

## Overview

This is the modernized Count Von Count project, transformed from a Ruby-based counting server into a TypeScript mono-repo with modern tooling and cloud infrastructure.

## Architecture

The project is structured as a pnpm workspace with the following packages:

- **`apps/web`** - Next.js frontend application
- **`apps/functions`** - Serverless functions for API endpoints
- **`packages/shared`** - Shared types, utilities, and configurations

## Prerequisites

- Node.js 18+
- pnpm 8+
- Supabase CLI (for local development)

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set up Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual Supabase credentials.

### 3. Start Supabase (Local Development)

```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Start local Supabase instance
supabase start
```

This will start:

- PostgreSQL database with PostGIS extension
- Supabase Studio (http://localhost:54323)
- API server (http://localhost:54321)

### 4. Run the Development Server

```bash
# Start all packages in development mode
pnpm dev
```

This will start:

- Web app at http://localhost:3000
- Functions in watch mode

## Available Scripts

### Root Level

- `pnpm dev` - Start all packages in development mode
- `pnpm build` - Build all packages
- `pnpm lint` - Lint all packages
- `pnpm test` - Run tests for all packages
- `pnpm type-check` - Type check all packages
- `pnpm format` - Format code with Prettier
- `pnpm clean` - Clean build artifacts

### Package-Specific

Navigate to any package directory and run:

- `pnpm dev` - Start package in development mode
- `pnpm build` - Build the package
- `pnpm lint` - Lint the package
- `pnpm type-check` - Type check the package

## Database Schema

The database includes the following main tables:

- **`counters`** - Stores counter data with metadata
- **`leaderboards`** - Stores ordered sets for leaderboard functionality
- **`counter_logs`** - Audit log of all counter changes

Key functions:

- `increment_counter(name, increment)` - Atomically increment a counter
- `get_counter(name)` - Get current counter value
- `reset_counter(name)` - Reset counter to zero
- `cleanup_expired_counters()` - Remove expired counters

## API Endpoints

### POST /api/count

Increment or get counter values.

**Request Body:**

```json
{
  "action": "increment" | "get" | "reset",
  "counter_name": "string",
  "increment": 1
}
```

**Response:**

```json
{
  "counter_name": "string",
  "count": 123,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Migration from Ruby

This project maintains the core functionality of the original Ruby Count Von Count while modernizing the technology stack:

### What's Preserved

- Core counting functionality
- Real-time counter updates
- Leaderboard/ordered sets support
- Metadata tracking
- High-performance counting

### What's New

- TypeScript for type safety
- Modern React frontend
- Supabase for database and real-time features
- Serverless functions for scalability
- Modern CI/CD with GitHub Actions
- PostGIS for geospatial features

## Testing

```bash
# Run all tests
pnpm test

# Run tests for specific package
cd apps/web && pnpm test
```

## Deployment

### Supabase Setup

1. Create a new Supabase project
2. Run migrations: `supabase db push`
3. Update environment variables with production URLs

### Vercel Deployment (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

## Contributing

1. Create a feature branch
2. Make your changes
3. Ensure tests pass: `pnpm test`
4. Ensure linting passes: `pnpm lint`
5. Create a pull request

## Troubleshooting

### Supabase Issues

- Ensure Supabase is running: `supabase status`
- Check logs: `supabase logs`
- Reset database: `supabase db reset`

### Build Issues

- Clear cache: `pnpm clean`
- Reinstall dependencies: `rm -rf node_modules && pnpm install`
- Check TypeScript errors: `pnpm type-check`

### Development Server Issues

- Check port conflicts (3000, 54321, 54322, 54323)
- Restart development servers
- Check environment variables
