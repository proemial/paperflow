"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { History } from "lucide-react";
import { useRouter } from "next/navigation";

export function HistoryMenuItem() {
  const { push } = useRouter();
  const { user } = useUser();

  const handleClick = () => {
    push("/history");
  };

  return (
    <>
      {user && (
        <button type="button" onClick={handleClick}>
          <History className="stroke-muted-foreground" />
        </button>
      )}
      {!user && <History className="stroke-zinc-700" />}
    </>
  );
}
