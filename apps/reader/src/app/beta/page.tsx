"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect } from "react";
import { Button } from "src/components/shadcn-ui/button";
import logo from "src/images/logo.png";

export const revalidate = 1;

export default function BetaPage() {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      window.location.href = "/";
    }
  }, [user]);

  return (
    <main className="flex min-h-full flex-col justify-center items-center">
      <img src={logo.src} width="50%" />
      <div className="text-4xl md:text-7xl">paperflow</div>
      <Button
        variant="secondary"
        className="mt-8"
        onClick={() => (window.location.href = `/api/auth/login`)}
      >
        Try Now
      </Button>
    </main>
  );
}
