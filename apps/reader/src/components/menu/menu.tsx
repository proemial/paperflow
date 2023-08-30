"use client";
import { useEffect, useState } from "react";
import { Logo } from "../icons/logo";
import Drawer from "../login/drawer";
import { useDrawerState } from "../login/state";
import { Button } from "../shadcn-ui/button";
import { Toaster } from "../shadcn-ui/toaster";
import { BookmarksMenuItem } from "./menu-bookmarks";
import { HistoryMenuItem } from "./menu-history";
import { HomeMenuItem } from "./menu-home";
import { ProfileMenuItem } from "./menu-profile";
import { X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import base64url from "base64url";

export function MainMenu() {
  const { isOpen, close } = useDrawerState();
  const accessToken = getAccessToken();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="z-[1000]">
      <div className="pb-4 pt-2">
        <div
          className="flex justify-around"
          style={{ boxShadow: "0px -8px 8px 4px rgba(0, 0, 0, 0.85)" }}
        >
          {/* @ts-ignore */}
          <HomeMenuItem />
          {/* @ts-ignore */}
          <HistoryMenuItem />
          {/* @ts-ignore */}
          <BookmarksMenuItem />
          {/* @ts-ignore */}
          <ProfileMenuItem />
        </div>
      </div>
      {isMounted && (
        <Drawer isOpen={isOpen || !!accessToken} onClose={close}>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center my-2">
              <div className="w-2"></div>
              <div className="text-center text-base">
                Please log in to continue
              </div>
              <button
                type="button"
                onClick={close}
                className="border rounded-xl bg-primary border-primary p-1"
              >
                <X className="h-4 w-4 stroke-[4]" />
              </button>
            </div>
            <LoginButton variant="google" />
            <LoginButton variant="twitter" />
            <LoginButton variant="github" />
            <div className="text-xxs text-center text-foreground/70">
              Paperflow is a non-profit foundation dedicated to promoting
              academic discourse and knowledge sharing. By using Paperflow, you
              consent to our <Link variant="privacy" /> and{" "}
              <Link variant="privacy" />.
            </div>
          </div>
        </Drawer>
      )}
      <Toaster />
    </div>
  );
}

function getAccessToken() {
  const token = useSearchParams().get("token");
  const isValid = token && base64url.decode(token) !== "~�";

  return isValid && token;
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
