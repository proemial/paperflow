"use client";
import { useParams } from "next/navigation";
import { Button } from "./Button";
import { Toaster } from "./Toaster";
import { useToast } from "./ToastHook";
import { ToastAction } from "./Toast";

export function Menu() {
  const router = useParams();
  const { toast } = useToast();

  const handleClick = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "It's on your clipboard, now go share it 🙏",
    });
  };

  return (
    <>
      <div className="flex justify-end p-2 h-full items-end">
        <Button variant="outline" onClick={handleClick}>
          Share
        </Button>
      </div>
      <Toaster />
    </>
  );
}
