"use client";
import { User } from "lucide-react";
import { Logo } from "../icons/logo";
import Drawer from "../login/drawer";
import { useDrawerState } from "../login/state";
import { Button } from "../shadcn-ui/button";
import { Toaster } from "../shadcn-ui/toaster";
import { BookmarksMenuItem } from "./menu-bookmarks";
import { HistoryMenuItem } from "./menu-history";
import { HomeMenuItem } from "./menu-home";

export function MainMenu() {
  const { open, toggle } = useDrawerState();

  return (
    <div className="z-[1000]">
      <div className="pb-4 pt-2">
        <div
          className="flex justify-around"
          style={{ boxShadow: "0px -8px 8px 4px rgba(0, 0, 0, 0.85)" }}
        >
          <HomeMenuItem />
          <HistoryMenuItem />
          <BookmarksMenuItem />
          {/* <AuthMenuItem /> */}
          <button type="button" onClick={toggle}>
            <User className="stroke-muted-foreground" />
          </button>
        </div>
      </div>
      <Drawer isOpen={open} onClose={toggle}>
        <div className="flex flex-col gap-2">
          <div className="text-center text-base">Please log in to continue</div>
          <LoginButton variant="google" />
          <LoginButton variant="twitter" />
          <LoginButton variant="github" />
          <div className="text-xxs text-center text-foreground/70">
            Paperflow is a non-profit foundation dedicated to promoting academic
            discourse and knowledge sharing. By using Paperflow, you consent to
            our <Link variant="privacy" /> and <Link variant="privacy" />.
          </div>
        </div>
      </Drawer>
      <Toaster />
    </div>
  );
}

type Props = {
  variant: "google" | "twitter" | "github";
};

function LoginButton({ variant }: Props) {
  const provider =
    variant === "google"
      ? "Google"
      : variant === "twitter"
      ? "Twitter"
      : "GitHub";

  return (
    <Button onClick={() => (window.location.href = `/api/auth/login`)}>
      <Logo variant={variant} className="mr-2" />
      Continue using {provider}
    </Button>
  );
}

function Link({ variant }: { variant: "privacy" | "terms" }) {
  const url = variant === "privacy" ? "/privacy" : "/terms";
  const text = variant === "privacy" ? "Privacy Policy" : "Terms of Service";

  return (
    <a href={url} className="text-primary-light">
      {text}
    </a>
  );
}
