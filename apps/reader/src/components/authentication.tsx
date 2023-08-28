"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useDrawerState } from "./login/state";
import { getCookie } from "cookies-next";
import { usePathname, useRouter } from "next/navigation";

export function useAuthActions() {
  const { push } = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const { toggle } = useDrawerState();

  const status = getCookie("status") as "waitlist" | "member" | undefined;
  const isHome = pathname === "/";
  const isWaitlist = pathname === "/waitlist";
  const disableMenu = (isHome || isWaitlist) && status !== "member";

  const color = disableMenu ? "stroke-[#444444]" : "stroke-muted-foreground";

  const toggleDrawer = !user && !disableMenu ? toggle : () => {};
  const goto = user ? push : toggleDrawer;

  return { user, goto, toggleDrawer, status, color, isHome };
}
