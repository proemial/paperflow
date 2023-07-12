import { Home, Search, Bookmark, User } from "lucide-react";

export function MainMenu() {
  return (
    <div className="flex justify-around">
      <div>
        <Home className="stroke-muted-foreground" />
      </div>
      <div>
        <Search className="stroke-muted-foreground" />
      </div>
      <div>
        <Bookmark className="stroke-muted-foreground" />
      </div>
      <div>
        <User className="stroke-muted-foreground" />
      </div>
    </div>
  );
}
