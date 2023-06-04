"use client";
import { Button } from "./shadcn-ui/Button";
import { Toaster } from "./shadcn-ui/Toaster";
import { useToast } from "./shadcn-ui/ToastHook";
import { Share1Icon } from "@radix-ui/react-icons";
import { Analytics } from "./utils/AnalyticsClient";

export function Menu() {
  const { toast } = useToast();

  const handleClick = () => {
    navigator.clipboard.writeText(window.location.href);
    Analytics.track('Share', {path: window.location.href});
    toast({
      title: "It's on your clipboard, now go share it 🙏",
    });
  };

  return (
    <>
      <div className="flex justify-end p-2 h-full items-end">
        <Button variant="outline" onClick={handleClick}>
          <Share1Icon />
        </Button>
      </div>
      <Toaster />
    </>
  );
}
