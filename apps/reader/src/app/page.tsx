"use client";
import { PaperCard } from "@/src/components/card/card.cc";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { Suspense } from "react";
import logo from "src/images/logo.png";
import { Spinner } from "../components/spinner";
import { FeedItem, FeedResponse } from "./api/feed/[page]/route";
import { filterFeed } from "../utils/feed-filter";
import React from "react";

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

async function fetchPage() {
  const res = await fetch("/api/feed/1");
  return await res.json();
}

function PageContent() {
  const {
    data,
    error,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery<FeedResponse, Error>({
    queryKey: ["feed"],
    queryFn: fetchPage,
    getNextPageParam: (lastPage, pages) => lastPage.pages.next,
  });

  console.log("data", data);

  return (
    <>
      {isLoading && <CenteredSpinner />}
      {error && <div>{error.message}</div>}
      {data?.pages.map((page, index) => (
        <React.Fragment key={index}>
          {page.items?.map((item, index) => (
            <PaperCard key={index} id={item.id} />
          ))}
        </React.Fragment>
      ))}
      <div>
        {isFetchingNextPage ? (
          "Loading more..."
        ) : hasNextPage ? (
          <button type="button" onClick={() => fetchNextPage()}>
            Load More
          </button>
        ) : (
          "Nothing more to load"
        )}
      </div>
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
