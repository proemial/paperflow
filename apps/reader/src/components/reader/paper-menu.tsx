import { Bookmark, Forward } from "lucide-react";

export function PaperMenu({ className }: { className: string }) {
  return (
    <div className={`${className} flex justify-between`}>
      <button className="bg-primary">Read the full article</button>
      <div className="flex gap-4">
        <Bookmark />
        <Forward />
      </div>
    </div>
  );
}
