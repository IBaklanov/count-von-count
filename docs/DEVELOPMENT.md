# Development Guide

## Getting Started

This guide will help you set up the development environment and understand the project structure.

## Prerequisites

- **Node.js**: Version 18 or higher
- **pnpm**: Version 8 or higher (recommended package manager)
- **Supabase CLI**: For local database development

## Project Architecture

### Mono-repo Structure

This project uses pnpm workspaces to manage multiple packages:

- **Root**: Contains shared configuration and scripts
- **apps/web**: Next.js frontend application
- **apps/functions**: Serverless functions for API endpoints
- **packages/shared**: Shared utilities, types, and configurations

### Technology Stack

- **TypeScript**: Type-safe JavaScript
- **Next.js**: React framework for the web application
- **Supabase**: Backend-as-a-Service with PostgreSQL
- **PostGIS**: Spatial database extension
- **pnpm**: Fast, disk space efficient package manager
- **ESLint + Prettier**: Code linting and formatting
- **Vitest**: Testing framework

## Development Workflow

### 1. Environment Setup

```bash
# Clone and install
git clone <repo-url>
cd count-von-count
pnpm install

# Copy environment variables
cp .env.example .env.local
```

### 2. Database Setup

```bash
# Start Supabase locally
npx supabase start

# This will:
# - Start PostgreSQL with PostGIS
# - Apply migrations
# - Start Supabase Studio (http://localhost:54323)
```

### 3. Development Server

```bash
# Start all applications in development mode
pnpm dev

# Or start individual applications:
pnpm --filter @count-von-count/web dev
pnpm --filter @count-von-count/functions dev
```

### 4. Code Quality

```bash
# Type checking
pnpm type-check

# Linting
pnpm lint
pnpm lint:fix

# Formatting
pnpm format
pnpm format:check
```

## Working with Workspaces

### Adding Dependencies

```bash
# Add to root (dev dependencies)
pnpm add -D <package> -w

# Add to specific workspace
pnpm --filter @count-von-count/web add <package>
pnpm --filter @count-von-count/shared add <package>
```

### Running Commands

```bash
# Run in all workspaces
pnpm -r <command>

# Run in specific workspace
pnpm --filter <workspace-name> <command>

# Run in parallel
pnpm -r --parallel <command>
```

## Database Development

### Migrations

```bash
# Create new migration
npx supabase migration new <name>

# Apply migrations
npx supabase db reset

# Generate types
npx supabase gen types typescript --local > packages/shared/src/types/database.ts
```

### Supabase Studio

Access the local Supabase Studio at http://localhost:54323 to:
- View and edit data
- Manage database schema
- Test SQL queries
- Monitor real-time subscriptions

## Testing

```bash
# Run all tests
pnpm test

# Run tests in specific workspace
pnpm --filter @count-von-count/shared test

# Run tests in watch mode
pnpm --filter @count-von-count/shared test --watch
```

## Building

```bash
# Build all applications
pnpm build

# Build specific workspace
pnpm --filter @count-von-count/web build
```

## Troubleshooting

### Common Issues

1. **pnpm install fails**: Ensure you're using pnpm version 8+
2. **Supabase start fails**: Check if Docker is running
3. **Type errors**: Run `pnpm type-check` to see detailed errors
4. **Build fails**: Ensure all dependencies are installed with `pnpm install`

### Useful Commands

```bash
# Clean all node_modules and reinstall
pnpm clean && pnpm install

# Reset Supabase database
npx supabase db reset

# Check workspace dependencies
pnpm list --depth=0

# Update all dependencies
pnpm update -r
```

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run tests and linting: `pnpm test && pnpm lint`
4. Commit with conventional commit format
5. Push and create a pull request

The CI pipeline will automatically run tests and block merges if they fail.

