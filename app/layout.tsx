import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { NavigationHeader } from "@/components/navigation-header";
import dynamic from 'next/dynamic';

// Import APIInitializer component with dynamic import to ensure it only runs on client
const APIInitializer = dynamic(
  () => import('@/components/api-initializer').then(mod => mod.APIInitializer),
  { ssr: false }
);

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" }
  ]
};

export const metadata: Metadata = {
  title: "GCSE AI Marker | Intelligent Exam Grading",
  description: "Improve your GCSE exam preparation with AI-powered grading and feedback. Get instant assessment for all GCSE subjects.",
  keywords: "GCSE, exam preparation, AI grading, study tool, revision, exam feedback, education technology",
  authors: [{ name: "GCSE AI Marker Team" }],
  generator: "Next.js",
  applicationName: "GCSE AI Marker",
  creator: "GCSE AI Marker",
  publisher: "GCSE AI Marker",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "GCSE AI Marker | Intelligent Exam Grading",
    description: "Improve your GCSE exam preparation with AI-powered grading and feedback",
    url: "https://beenycool.github.io",
    siteName: "GCSE AI Marker",
    images: [
      {
        url: "https://beenycool.github.io/og-image.png",
        width: 1200,
        height: 630,
        alt: "GCSE AI Marker Preview",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GCSE AI Marker | Intelligent Exam Grading",
    description: "AI-powered GCSE exam preparation tool with instant feedback",
    images: ["https://beenycool.github.io/og-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GCSE AI Marker",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta httpEquiv="Permissions-Policy" content="browsing-topics=()" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Immediately initialize critical variables to prevent TDZ issues
              window.aV = window.aV || {};
              window.API_HELPERS = window.API_HELPERS || {};
              window.BACKEND_STATUS = window.BACKEND_STATUS || { status: 'checking' };
              
              // Define critical API helper functions to avoid temporal dead zone issues
              if (typeof window !== 'undefined') {
                const DEFAULT_BACKEND_URL = 'https://beenycool-github-io.onrender.com';
                
                // Define these functions before any module loading happens
                window.API_HELPERS.getApiBaseUrl = window.getApiBaseUrl = function() {
                  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                    ? 'http://localhost:3000'
                    : DEFAULT_BACKEND_URL;
                };
                
                window.API_HELPERS.isGitHubPages = window.isGitHubPages = function() {
                  return window.location.hostname.includes('github.io');
                };
                
                window.API_HELPERS.constructApiUrl = window.constructApiUrl = function(endpoint) {
                  const apiBaseUrl = window.getApiBaseUrl();
                  const isGH = window.isGitHubPages();
                  
                  // Normalize the endpoint
                  if (!endpoint.startsWith('/api/') && !endpoint.startsWith('api/')) {
                    endpoint = 'api/' + endpoint;
                  } else if (endpoint.startsWith('/api/')) {
                    endpoint = endpoint.substring(1);
                  }
                  
                  // For GitHub Pages, special handling
                  if (isGH && endpoint.startsWith('api/')) {
                    endpoint = endpoint.substring(4);
                  }
                  
                  return apiBaseUrl + '/' + endpoint;
                };
                
                // Initialize any other critical variables that might be needed early
                window.API_BASE_URL = window.getApiBaseUrl();
                window.IS_GITHUB_PAGES = window.isGitHubPages();
                
                console.log('Critical API helpers and variables initialized in <head>');
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NavigationHeader />
          {children}
          <APIInitializer />
        </ThemeProvider>
      </body>
    </html>
  );
}
