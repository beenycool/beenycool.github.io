import './globals.css';
import { PostHogProvider } from './providers/PostHogProvider';
// ... any other existing imports

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>GCSE AI Marker | Intelligent Exam Grading</title>
        <meta name="description" content="AI-powered GCSE exam grading and feedback tool" />
      </head>
      <body>
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
} 