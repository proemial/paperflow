"use client";
import { PaperCard } from "@/src/components/card/card.cc";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import React, { Suspense, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import logo from "src/images/logo.png";
import { Spinner } from "../components/spinner";
import { FeedResponse } from "./api/feed/[page]/route";

export const revalidate = 1;

const queryClient = new QueryClient();

export default function HomePage() {
  const { user } = useUser();
  console.log("user", user);

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
  const qLikes = useLikes();
  const qFeed = useFeed();

  useEffect(() => {
    if (inView && qFeed.hasNextPage) {
      qFeed.fetchNextPage();
    }
  }, [inView, qFeed.fetchNextPage, qFeed.hasNextPage]);

  return (
    <>
      {(qFeed.isLoading || qLikes.isLoading) && <CenteredSpinner />}
      {(qFeed.error || qLikes.error) && (
        <div>
          {qFeed.error?.message} {qLikes.error?.message}
        </div>
      )}
      {qFeed.data?.pages.map((page, index) => (
        <React.Fragment key={index}>
          {page.items?.map((item, index) => {
            if (page.items.length === index + 1) {
              return (
                <PaperCard key={index} id={item.id} likes={qLikes.data || []} />
              );
            }
            return (
              <PaperCard key={index} id={item.id} likes={qLikes.data || []} />
            );
          })}
        </React.Fragment>
      ))}
      {qFeed.isFetchingNextPage && <Spinner />}
      <button
        ref={ref}
        onClick={() => qFeed.fetchNextPage()}
        disabled={!qFeed.hasNextPage || qFeed.isFetchingNextPage}
      >
        {qFeed.isFetchingNextPage
          ? "Loading more..."
          : qFeed.hasNextPage
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
