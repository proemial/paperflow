import { Logo } from "ui";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-start">
      <div className="h-32">SM Summary</div>
      <div className="py-4 top-0 sticky bg-background">Paper menu</div>
      <div className="h-32">MD Summary</div>
      <div className="h-64">Metadata</div>
      <div className="h-64">Answer-bot with prebuilt questions</div>
      <div className="h-64">Recent papers from same sub-category</div>
    </main>
  );
}
