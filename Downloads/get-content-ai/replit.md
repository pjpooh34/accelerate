# Social Media Content AI Generator

## Overview

This project is a modern web application that leverages AI to generate optimized content for various social media platforms. The application allows users to input topic details, tone preferences, and audience information to generate tailored content for platforms like Instagram, Twitter, Facebook, and LinkedIn.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a client-server architecture with a clear separation of concerns:

1. **Frontend**: A React application using Vite as the build tool, styled with Tailwind CSS and shadcn/ui components. The application uses React Query for data fetching and state management.

2. **Backend**: An Express.js server that handles API requests, integrates with OpenAI for content generation, and manages database interactions.

3. **Database**: Uses Drizzle ORM for database operations. The schema is defined to store users and generated content. While Postgres is configured in the .replit file, the actual implementation currently uses an in-memory storage solution.

4. **API Layer**: RESTful endpoints for content generation, user management, and content storage.

## Key Components

### Frontend Components

1. **App Layout**: 
   - Main router using Wouter for navigation
   - Theme provider for light/dark mode support
   - Toast notifications system

2. **Pages**:
   - Landing page: Introduces the application features
   - Dashboard: Where users create and manage content
   - Not Found: Error page for invalid routes

3. **Dashboard Components**:
   - ContentForm: Form for user input to generate content
   - PlatformSelector: UI for selecting social media platforms
   - ContentPreview: Displays generated content in platform-specific formats
   - ContentVariations: Shows alternative versions of generated content
   - ContentHistory: Lists previously generated content

4. **UI Components**:
   - Comprehensive component library built with Radix UI primitives
   - Theme-aware components that support both light and dark mode

### Backend Components

1. **API Routes**: 
   - Content generation endpoints
   - User management endpoints
   - Content storage and retrieval endpoints

2. **OpenAI Integration**: 
   - Service for generating social media content using the OpenAI API

3. **Data Storage**: 
   - Schema-defined storage for users and content
   - Currently uses in-memory solution, with database support ready to implement

## Data Flow

1. User submits content generation request through the ContentForm component
2. Frontend sends API request to the `/api/generate` endpoint
3. Backend validates the request using Zod schemas
4. Backend calls OpenAI service to generate content
5. Generated content is stored in the database and returned to the frontend
6. Frontend displays the content in the ContentPreview component and shows variations in the ContentVariations component
7. User can select variations, modify content, or generate new content

## External Dependencies

### Frontend Dependencies
- **React**: Core UI library
- **Wouter**: Lightweight routing
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Component library built on Radix UI
- **React Query**: Data fetching and state management
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation
- **Lucide React**: Icon library

### Backend Dependencies
- **Express**: Web server framework
- **OpenAI**: AI content generation
- **Drizzle ORM**: Database ORM
- **Drizzle-zod**: Integration between Drizzle and Zod for schema validation

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

1. **Development**: 
   ```
   npm run dev
   ```
   This runs the Express server with Vite in development mode, enabling hot-reloading.

2. **Production Build**:
   ```
   npm run build
   ```
   This builds the frontend with Vite and bundles the server using esbuild.

3. **Production Start**:
   ```
   npm run start
   ```
   This runs the bundled application in production mode.

The deployment is configured to use autoscaling with port 5000 mapped to external port 80.

## Database Setup

The application is configured to use PostgreSQL, but it's not fully implemented yet. The schema includes:

1. **Users table**: For user authentication and account management
   - id (primary key)
   - username (unique)
   - password

2. **Contents table**: For storing generated content
   - id (primary key)
   - title
   - content
   - platform
   - contentType
   - createdAt
   - userId (foreign key to users)

To set up the database:
1. Ensure PostgreSQL is running
2. Set the DATABASE_URL environment variable
3. Run `npm run db:push` to apply the schema to the database

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `DATABASE_URL`: Your PostgreSQL connection string
4. Run the development server with `npm run dev`
5. Access the application at http://localhost:5000

## Common Tasks

- **Adding a new API endpoint**: Add a new route in `server/routes.ts`
- **Creating a new UI component**: Add component to `client/src/components`
- **Modifying the database schema**: Update `shared/schema.ts` and run `npm run db:push`
- **Changing OpenAI parameters**: Modify the functions in `server/openai.ts`