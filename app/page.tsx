import ClientWrapper from './client-wrapper';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  return (
    <>
      <main className="container flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center py-8">
        <ClientWrapper />
      </main>
      <footer className="flex justify-between items-center w-full p-4 border-t border-gray-200 dark:border-gray-700">
        <a
          href="https://github.com/beenycool/beenycool.github.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
        >
          View on GitHub
        </a>
        <ThemeToggle />
      </footer>
    </>
  );
}