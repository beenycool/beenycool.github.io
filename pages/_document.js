import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Remove interest-cohort from Permissions-Policy */}
        <meta httpEquiv="Permissions-Policy" content="browsing-topics=()" />
        
        {/* Initialize critical variables as early as possible */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Initialize aV globally before any other scripts can access it
              window.aV = {};
              window.API_HELPERS = {};
              window.BACKEND_STATUS = { status: 'checking' };
              
              // Define critical API helper functions immediately
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
              }
            `
          }}
          strategy="beforeInteractive"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 