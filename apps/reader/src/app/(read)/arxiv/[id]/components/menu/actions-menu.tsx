import { Bookmark } from "lucide-react";
import { ArxivButton } from "./arxiv-button";
import { ShareButton } from "./share-button";

type Props = {
  id: string;
  className: string;
};

export function ActionsMenu({ id, className }: Props) {
  return (
    <div
      className={`${className} w-full flex justify-between items-center shadow`}
    >
      <ArxivButton id={id} />
      <div className="flex gap-4">
        <Bookmark />
        <ShareButton />
      </div>
    </div>
  );
}
