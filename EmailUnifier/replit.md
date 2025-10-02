# Email Signature Generator

## Overview

This is a full-stack web application built with React (frontend) and Express.js (backend) that generates professional email signatures for Better World Advertising. The application allows staff members to input their contact information and generates HTML email signatures that exactly match the corporate signature format with precise spacing, colors, and layout consistency.

## User Preferences

Preferred communication style: Simple, everyday language.
Priority: Exact consistency in signature formatting - appearance including color, spacing, and placement must be identical across all team signatures.
Layout: Mobile-first design with single column layout maintained across all screen sizes.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Layout**: Mobile-first responsive design with centered single column layout
- **State Management**: React Hook Form for form handling, TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL sessions with connect-pg-simple
- **Development**: Hot reload with tsx

### Build and Deployment
- **Development**: Vite dev server for frontend, tsx for backend hot reload
- **Production**: Vite builds the frontend, esbuild bundles the backend
- **Static Assets**: Frontend builds to `dist/public`, backend to `dist/index.js`

## Key Components

### Frontend Components
1. **SignatureGenerator** (`client/src/pages/signature-generator.tsx`): Main application page with form and signature preview
2. **UI Components** (`client/src/components/ui/`): Complete shadcn/ui component library
3. **Form Handling**: React Hook Form with Zod validation
4. **Toast Notifications**: Radix UI toast system for user feedback

### Backend Components
1. **Server Setup** (`server/index.ts`): Express server with middleware and error handling
2. **Routes** (`server/routes.ts`): API route registration (currently empty, ready for expansion)
3. **Storage Layer** (`server/storage.ts`): Database abstraction with in-memory fallback
4. **Vite Integration** (`server/vite.ts`): Development server integration

### Database Schema
- **Users Table**: Basic user authentication (id, username, password)
- **Signatures Table**: Signature data (id, name, title, email, phone)
- **Schema Validation**: Zod schemas for type safety and validation

## Data Flow

1. **User Input**: Form data collected via React Hook Form
2. **Real-time Preview**: Signature HTML generated dynamically as user types
3. **Validation**: Zod schemas validate input on both client and server
4. **Storage**: Ready for API integration to save signatures to PostgreSQL
5. **Copy to Clipboard**: Generated HTML can be copied for use in email clients

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React, React DOM, React Hook Form
- **UI Framework**: Radix UI primitives, shadcn/ui components
- **Styling**: Tailwind CSS, clsx, class-variance-authority
- **State Management**: TanStack Query for server state
- **Form Validation**: Zod with Hookform resolvers
- **Icons**: Lucide React icons
- **Utilities**: date-fns for date handling

### Backend Dependencies
- **Server**: Express.js with TypeScript support
- **Database**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon Database serverless driver
- **Session Management**: connect-pg-simple for PostgreSQL sessions
- **Development**: tsx for TypeScript execution, esbuild for bundling

### Development Dependencies
- **Build Tools**: Vite, esbuild, TypeScript
- **Database Tools**: Drizzle Kit for migrations and schema management
- **Replit Integration**: Vite plugins for Replit development environment

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with HMR at root `/client`
- **Backend**: tsx with hot reload for API server
- **Database**: Neon Database with connection pooling
- **Environment**: Replit-optimized with cartographer and error overlay plugins

### Production Build
- **Frontend Build**: `vite build` outputs to `dist/public`
- **Backend Build**: `esbuild` bundles server to `dist/index.js`
- **Database**: Production PostgreSQL via DATABASE_URL environment variable
- **Deployment**: Single Node.js process serving both API and static assets

### Database Management
- **Migrations**: Drizzle Kit manages schema changes in `./migrations`
- **Schema**: Centralized in `shared/schema.ts` for type safety
- **Push Strategy**: `db:push` command for development schema updates

The application is structured as a monorepo with shared types and schemas, enabling full-stack type safety and efficient development workflows.

## Recent Changes

### Simplified Deployment Setup (July 14, 2025)
- **AUTHENTICATION REMOVED**: Simplified to deploy directly without security complexity
- **OPEN ACCESS**: Tool now accessible to anyone with the deployment link
- **CLEAN INTERFACE**: Professional header with BWA branding and streamlined navigation
- **DEPLOYMENT READY**: Optimized for simple team distribution via link sharing

### Signature Layout and Color Refinements (July 12, 2025)
- **HAIRLINE CENTERING RESOLVED**: Implemented responsive table-based layout for consistent vertical line positioning
- Achieved flexible column widths that adapt to any name length using white-space: nowrap
- **OPTIMIZED TEXT CONTRAST**: Applied progressive color darkening for maximum readability
  - Name text: #6f6f6f (significantly darker for prominence)
  - Company text: #606060 (darkest grey for company branding)  
  - Supporting text (title, address, phone): #5e5e5e (enhanced contrast)
- Unified preview window with actual Gmail output for pixel-perfect accuracy
- Eliminated layout inconsistencies with variable text lengths through responsive table approach
- **USER VALIDATION**: Confirmed excellent appearance and functionality across all signature variations

### Gmail Logo Embedding Solution (July 12, 2025)
- **CORE FUNCTIONALITY ACHIEVED**: BWA logo now embeds properly in Gmail signatures
- Implemented server-hosted logo approach via `/api/logo/bwa-30th.png` endpoint
- Replaced failed base64 embedding with reliable hosted URL method
- Maintains exact 150px width scaling and professional image quality
- Two-column signature layout renders correctly in Gmail with proper spacing
- User testing confirmed successful logo display in Gmail compose window

### Logo Management System Implementation (January 12, 2025)
- Replaced instruction section with comprehensive drag-and-drop logo replacement tool
- Added automatic logo scaling to 189px width with proportional height
- Implemented logo archival system with "_v2" suffix for version control
- Enhanced UI with collapsible logo management section
- Integrated real-time preview updates when logos are changed
- Added file validation and upload progress feedback
- Updated database schema to support logo management with versioning
- Streamlined interface by removing lengthy instructions in favor of functional tools

### Input Validation and Address Updates (July 12, 2025)
- **PHONE INPUT RESTRICTIONS**: Limited phone field to numbers and spaces only for consistent formatting
- **ADDRESS STANDARDIZATION**: Updated all instances to "1010 B Street, Suite 328, San Rafael CA 94901"
- **DOM STRUCTURE FIXES**: Added proper `<tbody>` elements to all tables for validation compliance
- **PREVIEW SYNCHRONIZATION**: Ensured both visual preview and generated HTML show identical formatting
- **USER CONFIRMATION**: All changes successfully implemented and verified working correctly

### Email Security Optimization (July 12, 2025)
- **SIGNATURE LENGTH ISSUE RESOLVED**: Replaced base64 embedding with optimized hosted approach to prevent Gmail "signature too long" errors
- **ENHANCED SERVER HEADERS**: Added proper Content-Type, cache control, and security headers for better email client compatibility
- **REDUCED IMAGE WARNINGS**: Optimized image serving to minimize external image security prompts in email clients
- **GMAIL COMPATIBILITY**: Maintained compact signature format while ensuring reliable logo display across email platforms