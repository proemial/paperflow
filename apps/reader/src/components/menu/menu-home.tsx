"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Home } from "lucide-react";
import { useRouter } from "next/navigation";

export function HomeMenuItem() {
  const { push } = useRouter();
  const { user } = useUser();

  const handleHome = () => {
    push("/?reload=true");
  };

  return (
    <>
      {user && (
        <button type="button" onClick={handleHome}>
          <Home className="stroke-muted-foreground" />
        </button>
      )}
      {!user && <Home className="stroke-zinc-700" />}
    </>
  );
}
