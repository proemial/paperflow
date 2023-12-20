"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import logo from "src/images/logo.png";
import { queryClient } from "../state/react-query";
import { PaperFeed } from "./feed";

export const revalidate = 1;

export default function HomePage() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className={`min-h-[calc(100dvh-48px)] flex flex-col justify-begin`}>
        <div
          className={`h-[calc(100dvh-48px)] max-h-screen flex flex-col justify-center items-center bg-zinc-900`}
        >
          <div className="h-[10%]"></div>
          <div className="h-[50%] w-full flex flex-col justify-center items-center">
            <img src={logo.src} style={{ maxHeight: "40%" }} alt="" />
            <div className="text-3xl md:text-7xl">Paperflow</div>
          </div>
            <div className="h-[40%] w-full flex justify-center items-center">
                <div className="text-secondary text-xl font-normal px-8 mt-4 text-center">
                    Swipe up to get started
                </div>
            </div>
        </div>
        <PaperFeed/>
      </main>
    </QueryClientProvider>
  );
}
