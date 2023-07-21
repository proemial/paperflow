"use client";
import { PaperCard } from "@/src/components/card/card.cc";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from "@tanstack/react-query";
import React, { Suspense, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import logo from "src/images/logo.png";
import { Spinner } from "../components/spinner";
import { FeedResponse } from "./api/feed/[page]/route";

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

async function fetchPage(page: number) {
  const res = await fetch(`/api/feed/${page}`);
  return await res.json();
}

function PageContent() {
  const { ref, inView } = useInView();
  const {
    data,
    error,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery<FeedResponse, Error>({
    queryKey: ["feed"],
    queryFn: ({ pageParam = 0 }) => fetchPage(pageParam),
    getNextPageParam: (lastPage) => lastPage.pages.next,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  return (
    <>
      {isLoading && <CenteredSpinner />}
      {error && <div>{error.message}</div>}
      {data?.pages.map((page, index) => (
        <React.Fragment key={index}>
          {page.items?.map((item, index) => {
            if (page.items.length === index + 1) {
              return <PaperCard key={index} id={item.id} />;
            }
            return <PaperCard key={index} id={item.id} />;
          })}
        </React.Fragment>
      ))}
      {isFetchingNextPage && <Spinner />}
      <button
        ref={ref}
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? "Loading more..."
          : hasNextPage
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
