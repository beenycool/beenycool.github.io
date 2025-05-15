export default function DebugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <div className="bg-yellow-500 text-yellow-950 py-1 px-4 text-center text-sm font-medium">
        Debug Mode - For Development Use Only
      </div>
      {children}
    </div>
  );
} 