"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import logo from "src/images/logo.png";
import { useAuthActions } from "../components/authentication";
import { Button } from "../components/shadcn-ui/button";
import { queryClient } from "../state/react-query";
import { PaperFeed } from "./feed";
import dynamic from "next/dynamic";

export const revalidate = 1;

const screenMinusMenu = "calc(100dvh-48px)";

export default function HomePage() {
  return (
    <QueryClientProvider client={queryClient}>
      <main
        className={`min-h-[${screenMinusMenu}] flex flex-col justify-begin`}
      >
        <div
          className={`h-[${screenMinusMenu}] max-h-screen flex flex-col justify-center items-center bg-zinc-900`}
        >
          <div className="h-[10%]"></div>
          <div className="h-[50%] w-full flex flex-col justify-center items-center">
            <img src={logo.src} style={{ maxHeight: "40%" }} />
            <div className="text-3xl md:text-7xl">Paperflow</div>
          </div>
          <div className="h-[40%] w-full flex justify-center items-center">
            {/* @ts-ignore */}
            <LoggedinGreeting />
            {/* @ts-ignore */}
            <LoggedoutNudge />
          </div>
        </div>
        {/* @ts-ignore */}
        <PaperFeed />
      </main>
    </QueryClientProvider>
  );
}

const LoggedinGreeting = dynamic(
  () =>
    Promise.resolve(() => {
      const { status } = useAuthActions();

      if (status !== "member") return undefined;

      return (
        <div className="text-secondary text-xl font-normal px-8 mt-4 text-center">
          Swipe up to get started
        </div>
      );
    }),
  { ssr: false }
);

const LoggedoutNudge = dynamic(
  () =>
    Promise.resolve(() => {
      const { status } = useAuthActions();

      switch (status) {
        case "member":
          return undefined;
        case "waitlist":
          return <div>You are on the waitlist.</div>;
        default:
          return (
            <Button
              variant="secondary"
              onClick={() => (window.location.href = `/waitlist`)}
            >
              Join the waitlist
            </Button>
          );
      }
    }),
  {
    ssr: false,
  }
);
