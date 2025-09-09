# Overview

This is a modern real estate website called "Island Properties" built as a full-stack React application. The application features a comprehensive property listing system with categorized properties (houses, land, condos, beachfront, commercial, and agriculture), testimonials, and a clean minimalistic design using shadcn/ui components with Tailwind CSS.

The application follows a monorepo structure with separate client and server directories, shared schemas, and a PostgreSQL database for data persistence. It's designed to showcase real estate properties with professional presentation and user-friendly navigation.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **State Management**: TanStack Query for server state management and API data fetching
- **Forms**: React Hook Form with Zod validation resolvers
- **Design System**: Azure-inspired color palette with minimalistic aesthetic, custom fonts (Inter/Poppins), and responsive design

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with structured error handling and request logging middleware
- **Development Server**: Vite dev server integration for full-stack development experience
- **Build Process**: ESBuild for server bundling, Vite for client bundling

## Data Storage Solutions
- **Database**: PostgreSQL using Neon serverless database
- **ORM**: Drizzle ORM with type-safe queries and migrations
- **Schema Management**: Shared TypeScript schemas using Drizzle Zod integration
- **Development Storage**: In-memory storage implementation for development/testing
- **Data Models**: Users, Properties (with category-specific fields), and Testimonials

## Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **User Model**: Basic username/password authentication structure
- **Security**: Environment-based configuration, secure session handling

## External Dependencies

### Core Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connectivity
- **ORM**: drizzle-orm and drizzle-kit for database operations and migrations
- **UI Framework**: Complete Radix UI component suite (@radix-ui/react-*)
- **State Management**: @tanstack/react-query for server state
- **Form Handling**: @hookform/resolvers for form validation
- **Styling**: tailwindcss, autoprefixer, postcss for styling infrastructure

### Development Tools
- **Build Tools**: Vite for development and building, esbuild for server bundling
- **TypeScript**: Full TypeScript support across client, server, and shared code
- **Development Utilities**: @replit/vite-plugin-runtime-error-modal and @replit/vite-plugin-cartographer for Replit integration

### UI and UX Libraries
- **Component Variants**: class-variance-authority for component styling variants
- **Utility Libraries**: clsx for conditional classNames, date-fns for date handling
- **Interactive Components**: cmdk for command palette, embla-carousel-react for carousels
- **Icons**: lucide-react for consistent iconography

The architecture prioritizes type safety, developer experience, and maintainability with a clear separation between client, server, and shared code. The use of modern tools like Drizzle ORM and TanStack Query provides excellent TypeScript integration and developer productivity.