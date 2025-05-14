import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta httpEquiv="Permissions-Policy" content="interest-cohort=(), browsing-topics=()" />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
