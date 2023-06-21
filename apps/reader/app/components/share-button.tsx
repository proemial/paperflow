"use client";
import { Share2Icon } from "@radix-ui/react-icons";
import { Button } from "./shadcn-ui/Button";
import { useToast } from "./shadcn-ui/ToastHook";
import { Analytics } from "./utils/AnalyticsClient";

export function ShareButton({ className }: { className?: string }) {
  const { toast } = useToast();

  const handleClick = () => {
    navigator.clipboard.writeText(window.location.href);
    Analytics.track("use:share", { path: window.location.href });
    toast({
      title: "It's on your clipboard, now go share it 🙏",
    });
  };

  return (
    <Button variant="outline" onClick={handleClick} className={className}>
      <Share2Icon />
    </Button>
  );
}
