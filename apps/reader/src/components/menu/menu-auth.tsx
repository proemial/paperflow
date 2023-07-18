"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { LogIn } from "lucide-react";
import { usePathname } from "next/navigation";
import { AuthButton } from "./auth-button";

export function AuthMenuItem() {
  const pathname = usePathname();
  const { user } = useUser();

  const isHome = pathname === "/";

  return (
    <>
      {(user || !isHome) && (
        <div>
          {/* <User className="stroke-zinc-700" /> */}
          <AuthButton user={user} />
        </div>
      )}
      {!user && isHome && <LogIn className="stroke-zinc-700" />}
    </>
  );
}
