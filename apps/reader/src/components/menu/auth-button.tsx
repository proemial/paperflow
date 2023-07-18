import { UserProfile } from "@auth0/nextjs-auth0/client";
// import { useUser } from "@auth0/nextjs-auth0/client";
// import { Button } from "./shadcn-ui/button";
import { LogOut, LogIn } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "./shadcn-ui/Avatar";

export function AuthButton({ user }: { user?: UserProfile }) {
  //   const tooltip = user ? "Profile" : "Log in";

  return (
    <>
      {!user && (
        <LogIn
          onClick={() => (window.location.href = `/api/auth/login`)}
          className="stroke-muted-foreground"
        />
      )}
      {user && (
        <LogOut
          onClick={() => (window.location.href = `/api/auth/logout`)}
          className="stroke-muted-foreground"
        />
        // <Button
        //   variant="link"
        //   onClick={() => (window.location.href = `/api/auth/logout`)}
        // >
        //   <UserProfile user={user} />
        // </Button>
      )}
    </>
  );
}

// function UserProfile({ user }: { user: UserProfile }) {
//   console.log("user.picture", user.picture);
//   const initials = user.name.split(" ").map((name) => name.charAt(0));

//   return (
//     <Avatar>
//       <AvatarImage src={user.picture} alt="avatar" />
//       <AvatarFallback>{initials}</AvatarFallback>
//     </Avatar>
//   );
// }
