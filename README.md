# Count Von Count

A modern TypeScript mono-repo for a scalable counting server application.

## 🏗️ Project Structure

```
count-von-count/
├── apps/
│   ├── web/          # Next.js web application
│   └── functions/    # Serverless functions
├── packages/
│   └── shared/       # Shared utilities and types
├── supabase/         # Database migrations and config
└── .github/          # CI/CD workflows
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- Supabase CLI

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd count-von-count
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Start Supabase locally:
```bash
npx supabase start
```

5. Run the development server:
```bash
pnpm dev
```

## 📦 Workspaces

### Apps

- **`apps/web`**: Next.js web application for the frontend interface
- **`apps/functions`**: Serverless functions for API endpoints

### Packages

- **`packages/shared`**: Shared TypeScript utilities, types, and Supabase client

## 🛠️ Development

### Available Scripts

- `pnpm dev` - Start all applications in development mode
- `pnpm build` - Build all applications
- `pnpm test` - Run tests across all workspaces
- `pnpm lint` - Lint all code
- `pnpm lint:fix` - Fix linting issues
- `pnpm type-check` - Run TypeScript type checking
- `pnpm format` - Format code with Prettier
- `pnpm clean` - Clean all build artifacts

### Database

The project uses Supabase with PostgreSQL and PostGIS extension enabled.

#### Local Development

```bash
# Start Supabase locally
npx supabase start

# Apply migrations
npx supabase db reset

# Generate TypeScript types
npx supabase gen types typescript --local > packages/shared/src/types/database.ts
```

#### Migrations

Create new migrations:
```bash
npx supabase migration new <migration_name>
```

## 🚀 Deployment

### Web Application

The web application can be deployed to Vercel, Netlify, or any platform supporting Next.js.

### Functions

Serverless functions are configured for Vercel but can be adapted for AWS Lambda, Cloudflare Workers, etc.

### Database

Deploy to Supabase cloud or any PostgreSQL provider with PostGIS support.

## 🧪 Testing

Tests are configured with Vitest. Run tests with:

```bash
pnpm test
```

## 📝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 🔧 CI/CD

GitHub Actions automatically:
- Installs dependencies
- Runs type checking
- Lints code
- Runs tests
- Builds applications

Failed tests will block PR merges.

## 📄 License

[Add your license here]

