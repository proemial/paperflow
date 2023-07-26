"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDrawerState } from "../login/state";

export function ProfileMenuItem() {
  const { push } = useRouter();
  const { user } = useUser();
  const { toggle } = useDrawerState();

  const handleBookmarks = () => {
    user ? push("/profile") : toggle();
  };

  return (
    <button type="button" onClick={handleBookmarks}>
      <User className="stroke-muted-foreground" />
    </button>
  );
}
