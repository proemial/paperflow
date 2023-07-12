import { Home, Search, Bookmark, User } from "lucide-react";

export function MainMenu() {
  return (
    <div
      className="flex justify-around"
      style={{ boxShadow: "0px -24px 0 rgba(0, 0, 0, 0.85)" }}
    >
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
