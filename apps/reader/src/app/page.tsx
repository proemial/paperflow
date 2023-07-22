"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  QueryClientProvider,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import React, { Suspense, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { PaperCard } from "src/components/card/card.cc";
import logo from "src/images/logo.png";
import { RefreshBanner } from "../components/refresh-banner";
import { Spinner } from "../components/spinner";
import { queryClient } from "../state/react-query";
import { FeedResponse } from "./api/feed/[page]/route";

export const revalidate = 1;

const showDevTools = false;

export default function HomePage() {
  const { user } = useUser();
  const ref = useRef(null);

  useEffect(() => {
    if (window.location.search.includes("reload=true")) {
      ref.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // h-[calc(100vh-120px)]
  return (
    <QueryClientProvider client={queryClient}>
      <main className="flex min-h-screen flex-col justify-begin">
        <div className="flex h-screen flex-col justify-center items-center">
          <img src={logo.src} width="50%" />
          <div className="text-3xl md:text-7xl">paperflow</div>
          <div className="text-secondary text-xl font-normal px-8 mt-4 text-center">
            Swipe up to read your daily papers
          </div>
        </div>
        <div
          ref={ref}
          className="text-xl px-4 py-6 bg-background h-full top-0 sticky shadow"
        >
          Recent papers
        </div>
        <Suspense fallback={<CenteredSpinner />}>
          <PageContent />
        </Suspense>
      </main>
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
