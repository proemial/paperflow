"use client";
import { PaperCard } from "src/components/card/card.cc";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Env } from "data/adapters/env";
import React, { Suspense, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import logo from "src/images/logo.png";
import { RefreshBanner } from "../components/refresh-banner";
import { Spinner } from "../components/spinner";
import { FeedResponse } from "./api/feed/[page]/route";
import { queryClient } from "../state/react-query";

export const revalidate = 1;

const showDevTools = false;

export default function HomePage() {
  const { user } = useUser();

  return (
    <QueryClientProvider client={queryClient}>
      {!user && (
        <main className="flex min-h-full flex-col justify-center items-center">
          <img src={logo.src} width="50%" />
          <div className="text-4xl md:text-7xl">paperflow</div>
        </main>
      )}
      {user && (
        <main className="flex min-h-screen flex-col justify-begin">
          <div className="text-xl px-4 py-6 bg-background h-full top-0 sticky shadow">
            Recent papers
          </div>
          <Suspense fallback={<CenteredSpinner />}>
            <PageContent />
          </Suspense>
        </main>
      )}
      {Env.isDev && showDevTools && (
        // @ts-ignore
        <ReactQueryDevtools position="bottom-right" />
      )}
    </QueryClientProvider>
  );
}

async function fetchPage(page: number) {
  const res = await fetch(`/api/feed/${page}`);
  return await res.json();
}

function useLikes() {
  return useQuery<string[], Error>(["likes"], async () => {
    const res = await fetch(`/api/user/likes`);
    return await res.json();
  });
}

function useFeed() {
  return useInfiniteQuery<FeedResponse, Error>({
    queryKey: ["feed"],
    queryFn: ({ pageParam = 0 }) => fetchPage(pageParam),
    getNextPageParam: (lastPage) => lastPage.pages.next,
  });
}

function PageContent() {
  const { ref, inView } = useInView();
  const likes = useLikes();
  const feed = useFeed();

  useEffect(() => {
    if (inView && feed.hasNextPage) {
      console.log("Fetching ...");

      feed.fetchNextPage();
    }
  }, [inView, feed.fetchNextPage, feed.hasNextPage]);

  return (
    <>
      <RefreshBanner likes={likes.data} />
      {(feed.isLoading || likes.isLoading) && <CenteredSpinner />}
      {(feed.error || likes.error) && (
        <div>
          {feed.error?.message} {likes.error?.message}
        </div>
      )}
      {feed.data?.pages.map((page, index) => (
        <React.Fragment key={index}>
          {page.items?.map((item, index) => (
            <PaperCard key={index} id={item.id} likes={likes.data || []} />
          ))}
        </React.Fragment>
      ))}
      {feed.isFetchingNextPage && <Spinner />}
      <button
        ref={ref}
        onClick={() => feed.fetchNextPage()}
        disabled={!feed.hasNextPage || feed.isFetchingNextPage}
      >
        {feed.isFetchingNextPage
          ? "Loading more..."
          : feed.hasNextPage
          ? "Load Newer"
          : "Nothing more to load"}
      </button>
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
