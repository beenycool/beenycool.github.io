# BeenyCool AI GCSE Marker

AI-powered feedback and grading for GCSE exam questions.

## Important Notice for Static Export

This application uses Next.js with static export, which does not support API routes. All API calls are redirected to the remote backend at https://beenycool-github-io.onrender.com.

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Run the development server:
   ```
   npm run dev
   ```

3. Build for production:
   ```
   npm run build
   ```

4. To serve the static export locally:
   ```
   npx serve@latest out
   ```

## Notes on API Routes

- In development mode (`npm run dev`), API routes work normally
- In production/static export, API routes are disabled and calls are redirected to the remote backend
- The app displays simulated "online" status for GitHub Pages deployments

## Common Issues

If you encounter the error:
```
Error: "next start" does not work with "output: export" configuration. Use "npx serve@latest out" instead.
```

This means you're trying to use `npm run start` with a static export. Instead, use:
```
npx serve@latest out
```

## Environment Configuration

The application uses these environment variables:
- `NEXT_PUBLIC_API_BASE_URL`: API backend URL (default: https://beenycool-github-io.onrender.com)
- `IS_STATIC_EXPORT`: Set to 'true' in production builds 