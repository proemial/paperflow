import { Bookmark, Forward } from "lucide-react";
import { Button } from "src/components/shadcn-ui/button";

export function ActionsMenu({ className }: { className: string }) {
  return (
    <div
      className={`${className} w-full flex justify-between items-center shadow`}
    >
      <Button>Read the full article</Button>
      <div className="flex gap-4">
        <Bookmark />
        <Forward />
      </div>
    </div>
  );
}
