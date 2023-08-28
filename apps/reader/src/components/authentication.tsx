"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useDrawerState } from "./login/state";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export function useAuthActions() {
  const { push: goto } = useRouter();
  const { user } = useUser();
  const { toggle: toggleDrawer } = useDrawerState();
  const status = getCookie("status") as "waitlist" | "member" | undefined;
  const color =
    status === "member" ? "stroke-muted-foreground" : "stroke-[#444444]";

  return { user, goto, toggleDrawer, status, color };
}
