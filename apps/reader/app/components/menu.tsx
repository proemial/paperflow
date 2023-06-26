"use client";
import { UserProfile, useUser } from "@auth0/nextjs-auth0/client";
import { Toaster } from "./shadcn-ui/Toaster";
import { LockClosedIcon } from "@radix-ui/react-icons";
import { Button } from "./shadcn-ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./shadcn-ui/Tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "./shadcn-ui/Avatar";

export function Menu() {
  const { user } = useUser();

  return (
    <>
      <div className="flex p-2 h-full justify-end md:flex-col gap-1">
        <AuthButton user={user} />
      </div>
      <Toaster />
    </>
  );
}

function AuthButton({ user }: { user?: UserProfile }) {
  const tooltip = user ? "Profile" : "Log in";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <>
            {!user && (
              <Button
                variant="outline"
                onClick={() => (window.location.href = `/api/auth/login`)}
                style={{ width: 40, padding: 0 }}
              >
                <LockClosedIcon />
              </Button>
            )}
            {user && (
              <Button
                variant="link"
                onClick={() => (window.location.href = `/profile`)}
                style={{ width: 40, padding: 0 }}
              >
                <UserProfile user={user} />
              </Button>
            )}
          </>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function UserProfile({ user }: { user: UserProfile }) {
  console.log("user.picture", user.picture);
  const initials = user.name.split(" ").map((name) => name.charAt(0));

  return (
    <Avatar>
      <AvatarImage src={user.picture} alt="avatar" />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
