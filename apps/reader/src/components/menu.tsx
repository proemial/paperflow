import { Home, Search, Bookmark, KeyRound } from "lucide-react";

export function MainMenu() {
  return (
    <div className="flex justify-around">
      <div>
        <Home />
      </div>
      <div>
        <Search />
      </div>
      <div>
        <Bookmark />
      </div>
      <div>
        <KeyRound />
      </div>
    </div>
  );
}
