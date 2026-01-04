# replit.md

## Overview

This is a Gmail-clone mobile email application built with a React frontend and Express backend. The app displays an email inbox with features like starring emails, viewing email details, and composing new messages. It follows a dark theme design inspired by Gmail's mobile interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Build Tool**: Vite for development and production builds

The frontend follows a pages-based structure:
- `Inbox` - Main email list view with sidebar navigation
- `EmailDetail` - Individual email view with full content
- Custom hooks in `/hooks` for data fetching (`use-emails.ts`)

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL
- **API Design**: REST endpoints with Zod validation schemas
- **Session Storage**: PostgreSQL-based sessions via connect-pg-simple

The backend uses a storage abstraction pattern (`IStorage` interface) allowing different implementations. Routes are defined in `shared/routes.ts` with type-safe schemas shared between client and server.

### Data Model
Single `emails` table with fields for:
- Sender information (name, avatar, color)
- Email content (subject, snippet)
- Status flags (unread, starred, attachments)
- JSONB columns for attachments and labels

### Shared Code
The `shared/` directory contains:
- `schema.ts` - Drizzle table definitions and Zod schemas
- `routes.ts` - API route definitions with input/output types

This enables type safety across the full stack.

### Build System
- Development: Vite dev server with HMR proxied through Express
- Production: Vite builds static assets to `dist/public`, esbuild bundles server to `dist/index.cjs`
- Database migrations: Drizzle Kit with `db:push` command

## External Dependencies

### Database
- **PostgreSQL** - Primary data store, connected via `DATABASE_URL` environment variable
- Uses `pg` driver with connection pooling

### UI Framework Dependencies
- **Radix UI** - Headless accessible component primitives (dialogs, dropdowns, tooltips, etc.)
- **shadcn/ui** - Pre-styled component library configured in `components.json`
- **Tailwind CSS** - Utility-first CSS framework with custom theme configuration
- **Lucide React** - Icon library

### Key Runtime Libraries
- **@tanstack/react-query** - Server state management and caching
- **react-hook-form** with **@hookform/resolvers** - Form handling with Zod validation
- **date-fns** - Date formatting utilities
- **zod** - Schema validation for API inputs/outputs
- **drizzle-zod** - Automatic Zod schema generation from Drizzle tables

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal** - Error overlay in development
- **@replit/vite-plugin-cartographer** - Development tooling (dev only)