# TikTok Clone - Video Platform

A modern video sharing platform built with Next.js 15, featuring TikTok-like video feed, user authentication, email verification, and video management.

## 🚀 Features

### Core Features

- **TikTok-style Video Feed**: Vertical scrolling video feed with auto-play
- **User Authentication**: Sign up, sign in with email verification
- **Video Upload**: Upload videos with Cloudinary integration
- **Video Management**: Manage your uploaded videos with delete functionality
- **Like/Dislike System**: Interactive like and dislike buttons
- **Comments**: Add and view comments on videos
- **Responsive Design**: Works on desktop and mobile devices

### Technical Features

- **Next.js 15**: Latest Next.js with App Router
- **TypeScript**: Full type safety
- **Drizzle ORM**: Type-safe database queries
- **PostgreSQL**: NeonDB for database
- **NextAuth.js**: Authentication with JWT
- **Tailwind CSS**: Modern styling
- **Form Validation**: React Hook Form with Zod
- **Email Verification**: Nodemailer integration
- **Cloudinary**: Video and image hosting

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm**
- **PostgreSQL** database (or NeonDB account)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd tiktok-assignment
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="your-postgresql-connection-string"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email (for verification)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### 4. Database Setup

#### Option A: Using NeonDB (Recommended)

1. Create a free account at [NeonDB](https://neon.tech)
2. Create a new project
3. Copy the connection string to your `.env.local`

#### Option B: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a new database
3. Update the `DATABASE_URL` in your `.env.local`

### 5. Run Database Migrations

```bash
# Generate migration files
npm run db:generate

# Push migrations to database
npm run db:push

# (Optional) View database in Drizzle Studio
npm run db:studio
```

### 6. Cloudinary Setup

1. Create a free account at [Cloudinary](https://cloudinary.com)
2. Get your cloud name, API key, and API secret
3. Add them to your `.env.local` file

### 7. Email Setup

For email verification to work:

1. Use Gmail with App Password
2. Or configure other SMTP providers
3. See `EMAIL_SETUP.md` for detailed instructions

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (home)/            # Home page route group
│   ├── auth/              # Authentication pages
│   ├── upload/            # Video upload page
│   ├── videos-management/ # Video management page
│   └── api/               # API routes
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── video/            # Video-related components
│   ├── ui/               # Reusable UI components
│   └── layout/           # Layout components
├── lib/                  # Utility libraries
│   ├── actions/          # Server actions
│   ├── db/               # Database configuration
│   ├── email/            # Email services
│   └── cloudinary.ts     # Cloudinary integration
└── types/                # TypeScript type definitions
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npm run db:generate      # Generate Drizzle migrations
npm run db:push          # Push migrations to database
npm run db:migrate       # Run migrations
npm run db:studio        # Open Drizzle Studio
```

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Error**

   - Check your `DATABASE_URL` in `.env.local`
   - Ensure your database is running
   - Run `npm run db:push` to sync schema

2. **Email Not Sending**

   - Verify SMTP settings in `.env.local`
   - Check Gmail App Password setup
   - See `EMAIL_SETUP.md` for detailed instructions

3. **Video Upload Fails**

   - Verify Cloudinary credentials
   - Check file size limits
   - Ensure video format is supported

4. **Authentication Issues**
   - Check `NEXTAUTH_SECRET` and `NEXTAUTH_URL`
   - Ensure email verification is working
   - Clear browser cookies if needed

### Development Tips

- Use `npm run db:studio` to inspect your database
- Check browser console for client-side errors
- Monitor server logs for backend issues
- Use Next.js DevTools for debugging

---

**Happy coding! 🚀**
