# Mark Restelli Luxury Real Estate Website

## Overview

This is a luxury real estate portfolio website for Mark Restelli, a REALTOR® at Coldwell Banker Realty in Cranberry Township, PA. The site features a high-end visual design with a gold-and-black luxury color palette, property listings, service descriptions, and a contact inquiry form. It also includes an invoice generation page. The application follows a full-stack architecture with a React frontend and Express backend, backed by PostgreSQL.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side router)
- **Styling**: Tailwind CSS v4 with CSS variables for theming, using a luxury palette (gold primary `hsl(45 40% 50%)`, light grey background, black foreground)
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives
- **Fonts**: Playfair Display (serif headings), Lato (sans body text), Great Vibes (cursive logo)
- **Animations**: Framer Motion for scroll-triggered animations and hero carousel
- **State Management**: TanStack React Query for server state
- **Build Tool**: Vite with path aliases (`@/` → `client/src/`, `@shared/` → `shared/`, `@assets/` → `attached_assets/`)

### Backend
- **Framework**: Express 5 on Node.js
- **Language**: TypeScript, executed via `tsx`
- **API Design**: RESTful JSON API under `/api/` prefix
  - `POST /api/inquiries` — submit a contact inquiry
  - `GET /api/properties` — retrieve property listings
  - `GET /api/properties/:slug` — retrieve a single property by slug
- **Validation**: Zod schemas generated from Drizzle table definitions via `drizzle-zod`
- **Development**: Vite dev server middleware integrated into Express for HMR

### Data Storage
- **Database**: PostgreSQL (required via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `node-postgres` driver
- **Schema Location**: `shared/schema.ts` — shared between frontend and backend
- **Tables**:
  - `inquiries` — contact form submissions (id, firstName, lastName, email, message, createdAt)
  - `properties` — real estate listings (id, title, slug, address, price, bedrooms, bathrooms, sqft, imageUrl, images[], description, fullDescription, status, mlsNumber, taxes, lotSize, propertyType, yearBuilt, style, schoolDistrict, county)
- **Migrations**: Drizzle Kit with `drizzle-kit push` for schema sync
- **Seeding**: `server/seed.ts` populates 3 sample luxury properties

### Storage Pattern
- `server/storage.ts` defines an `IStorage` interface with a `DatabaseStorage` implementation
- Single exported `storage` instance used throughout the server
- This pattern allows easy swapping of storage backends if needed

### Build & Deployment
- **Dev**: `npm run dev` starts the Express server with Vite middleware (port 5000)
- **Build**: `npm run build` runs a custom script that builds the Vite client to `dist/public/` and bundles the server with esbuild to `dist/index.cjs`
- **Production**: `npm start` serves the built assets via Express static middleware with SPA fallback
- Server dependencies are bundled via an allowlist in `script/build.ts` to reduce cold start times

### Pages
- `/` — Home page with Hero carousel, About section, Featured Listings, Services, quote section, Contact form, and footer
- `/property/:slug` — Property detail page with image gallery (30 photos for 809 Mount Pleasant), lightbox, full listing details, and contact inquiry form
- `/buying` — Buying tips page with content from markrestelli.com
- `/selling` — Selling tips page with content from markrestelli.com
- `/admin` — Admin dashboard with property CRUD, URL scraper, image management, and featured toggle (password-protected)
- `/invoice` — Printable invoice page for billing clients (hosting, domain, AI tokens, database, dev platform)
- 404 — Not found fallback page

## External Dependencies

### Required Services
- **PostgreSQL Database**: Connected via `DATABASE_URL` environment variable. Uses `pg` (node-postgres) driver with connection pooling. Session store uses `connect-pg-simple`.

### Key NPM Packages
- **drizzle-orm** + **drizzle-kit**: Database ORM and migration tooling
- **express**: HTTP server framework (v5)
- **@tanstack/react-query**: Async state management for API calls
- **framer-motion**: Page animations
- **wouter**: Client-side routing
- **zod** + **drizzle-zod**: Schema validation
- **zod-validation-error**: Human-readable validation error messages
- **shadcn/ui ecosystem**: Radix UI primitives, class-variance-authority, clsx, tailwind-merge

### Replit-Specific Integrations
- `@replit/vite-plugin-runtime-error-modal`: Runtime error overlay in development
- `@replit/vite-plugin-cartographer`: Dev tooling (dev only)
- `@replit/vite-plugin-dev-banner`: Dev environment banner (dev only)
- Custom `vite-plugin-meta-images`: Auto-updates OpenGraph meta tags with Replit deployment URLs

### Google Fonts (CDN)
- Playfair Display, Lato, Great Vibes loaded via Google Fonts in `index.html`