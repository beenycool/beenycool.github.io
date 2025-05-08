import AIMarker from "@/app/aimarker";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="container flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center py-8">
        <AIMarker />
      </main>
    </>
  );
}