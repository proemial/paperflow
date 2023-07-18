"use client";
import { toast } from "src/components/shadcn-ui/toast-hook";
import { Forward } from "lucide-react";
import { Analytics } from "@/src/components/analytics";

export function ShareButton() {
  const handleClick = () => {
    navigator.clipboard.writeText(window.location.href);
    Analytics.track("click:share", { url: window.location.href });

    toast({
      title: "It's on your clipboard, now go share it 🙏",
    });
  };

  return (
    <button type="button" onClick={() => handleClick()}>
      <Forward />
    </button>
  );
}
