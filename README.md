# Noor Ul Fityan - Next.js Web Application

A modern, full-stack web application built with Next.js 14, featuring separate user-facing frontend and admin backend sections with complete authentication and database integration.

## Features

- ✅ **User Frontend**: Protected user area with dashboard and profile
- ✅ **Admin Backend**: Secure admin panel with user management
- ✅ **Authentication**: NextAuth.js with JWT sessions
- ✅ **Database**: Prisma ORM with SQLite (easily switchable to PostgreSQL/MySQL)
- ✅ **Styling**: Tailwind CSS for modern, responsive design
- ✅ **TypeScript**: Full type safety throughout the application
- ✅ **Protected Routes**: Middleware-based route protection
- ✅ **API Routes**: RESTful API endpoints for user management

## Project Structure

```
app/
├── (user)/              # User-facing pages (route group)
│   ├── layout.tsx       # User layout with navigation
│   ├── page.tsx         # User home page
│   ├── dashboard/       # User dashboard
│   └── profile/         # User profile
├── (admin)/             # Admin pages (route group)
│   ├── layout.tsx       # Admin layout with navigation
│   ├── page.tsx         # Admin dashboard with stats
│   ├── users/           # User management table
│   └── settings/        # Admin settings
├── auth/                # Authentication pages
│   ├── login/           # Login page
│   └── register/        # Registration page
├── api/                 # API routes
│   ├── auth/            # Authentication endpoints
│   └── admin/           # Admin-only endpoints
├── lib/                 # Utility libraries
│   ├── auth.ts          # NextAuth configuration
│   └── prisma.ts        # Prisma client
├── prisma/              # Database schema
│   └── schema.prisma    # User model
└── middleware.ts        # Route protection middleware
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
```

To generate a secure `NEXTAUTH_SECRET`, run:
```bash
openssl rand -base64 32
```

3. **Set up the database:**
```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (creates database file)
npm run db:push
```

4. **Create an admin user (optional):**
You can create an admin user through the registration page, then manually update the database:
```bash
# Open Prisma Studio to manage database
npm run db:studio
```
Then edit the user's role to "admin" in Prisma Studio.

5. **Run the development server:**
```bash
npm run dev
```

6. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio (database GUI)

## Authentication

### User Registration
- Visit `/auth/register` to create a new account
- Default role is "user"
- Passwords are hashed with bcrypt

### User Login
- Visit `/auth/login` to sign in
- Sessions are managed with NextAuth.js
- JWT tokens are used for authentication

### Protected Routes
- `/user/*` - Requires authentication (any user)
- `/admin/*` - Requires admin role

## User Roles

- **user**: Regular users can access the user area
- **admin**: Admins can access both user and admin areas

## Database

The application uses Prisma with SQLite by default. To switch to PostgreSQL or MySQL:

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // or "mysql"
  url      = env("DATABASE_URL")
}
```

2. Update your `.env` file with the database connection string
3. Run `npm run db:push` to apply the schema

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Authentication**: NextAuth.js
- **Database**: Prisma ORM (SQLite by default)
- **Styling**: Tailwind CSS
- **Validation**: Zod

## Security Features

- Password hashing with bcrypt
- JWT-based sessions
- Protected API routes with role-based access control
- Input validation with Zod
- CSRF protection via NextAuth.js

## Next Steps / Customization

- Add email verification
- Implement password reset functionality
- Add more user profile fields
- Create additional admin features
- Add file upload capabilities
- Integrate with external services
- Add real-time features with WebSockets

