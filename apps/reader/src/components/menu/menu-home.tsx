"use client";
import { Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDrawerState } from "../login/state";

export function HomeMenuItem() {
  const { push } = useRouter();
  const { close } = useDrawerState();

  const handleHome = () => {
    close();
    push("/?reload=true");
  };

  return (
    <>
      <button type="button" onClick={handleHome}>
        <Home className="stroke-muted-foreground" />
      </button>
    </>
  );
}
