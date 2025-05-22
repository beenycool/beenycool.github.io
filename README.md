# Beenycool AI GCSE Marker

A unified web application for GCSE exam grading and feedback using AI, with integrated analytics.

## Features

- AI-powered exam grading and feedback
- Admin dashboard for user management and analytics
- Chess game functionality
- Todo list management
- PostHog analytics integration for tracking user behavior

## Architecture

This application uses a unified server architecture:

- **Frontend**: Next.js React application
- **Backend**: Express.js server
- **Database**: PostgreSQL
- **Analytics**: PostHog
- **Authentication**: JWT-based auth system
- **Socket.IO**: For real-time features like chess games

Both frontend and backend run on the same server, simplifying deployment and management.

## Setup

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- PostHog account (for analytics)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Database Configuration
DATABASE_URL=postgres://user:password@localhost:5432/dbname
DB_HOST=localhost
DB_PORT=5432
DB_NAME=beenycool
DB_USER=postgres
DB_PASSWORD=postgres

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
PORT=3000

# PostHog Analytics
POSTHOG_API_KEY=your_posthog_api_key
POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_public_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Node Environment
NODE_ENV=development
```

### Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Build the frontend:
   ```
   npm run build
   ```

3. Create admin user:
   ```
   node backend/src/scripts/create-admin.js
   ```

4. Start the unified server:
   ```
   npm start
   ```

### Development

For development, you can run both frontend and backend in watch mode:

```
npm run unified-dev
```

## Deployment

### Render Deployment

This application is designed to be deployed on Render. Use the following settings:

1. **Build Command**: `npm run build`
2. **Start Command**: `npm start`

Set all the required environment variables in the Render dashboard.

## Analytics

This application uses PostHog for analytics. Key events tracked include:

- Page views
- User logins/registrations
- Admin actions
- Feature usage

## Admin Access

Access the admin dashboard at `/admin` with the following credentials:

- Username: beeny
- Password: Beeny1234!?

## License

This project is proprietary and confidential. 