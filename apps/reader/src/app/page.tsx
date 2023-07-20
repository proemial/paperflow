"use client";
import { PaperCard } from "@/src/components/card/card.cc";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { Suspense } from "react";
import logo from "src/images/logo.png";
import { Spinner } from "../components/spinner";
import { FeedItem } from "./api/feed/route";
import { filterFeed } from "../utils/feed-filter";

export const revalidate = 1;

const queryClient = new QueryClient();

export default function HomePage() {
  const user = useUser();

  return (
    <QueryClientProvider client={queryClient}>
      {!user && (
        <main className="flex min-h-screen flex-col justify-center items-center">
          <img src={logo.src} width="50%" />
          <div className="text-4xl md:text-7xl">paperflow</div>
        </main>
      )}
      {user && (
        <main className="flex min-h-screen flex-col justify-begin">
          <Suspense fallback={<CenteredSpinner />}>
            <PageContent />
          </Suspense>
        </main>
      )}
    </QueryClientProvider>
  );
}

function PageContent() {
  const { data, isLoading } = useQuery<FeedItem[]>(["feed"], async () => {
    const res = await fetch("/api/feed");
    return await res.json();
  });

  const items = data ? filterFeed(data) : [];
  console.log(items.length);

  return (
    <>
      {isLoading && <CenteredSpinner />}
      {items.map((item, index) => (
        <PaperCard key={index} id={item.id} />
      ))}
    </>
  );
}

function CenteredSpinner() {
  return (
    <div className="flex min-h-screen flex-col justify-center">
      <Spinner />
    </div>
  );
}
