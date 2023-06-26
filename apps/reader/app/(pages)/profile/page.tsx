"use client";
import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/shadcn-ui/Card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/shadcn-ui/Avatar";
import { Bot } from "lucide-react";
import { Switch } from "@/app/components/shadcn-ui/Switch";
import { Checkbox } from "@/app/components/shadcn-ui/Checkbox";
import { Button } from "@/app/components/shadcn-ui/Button";
import { useUser } from "@auth0/nextjs-auth0/client";
import { setCookie, getCookie } from "cookies-next";

// https://github.com/auth0/nextjs-auth0/tree/beta/example-app
const categories = [
  { key: "cs", label: "Computer Science" },
  { key: "econ", label: "Economics" },
  { key: "eess", label: "Electrical Engineering and Systems Science" },
  { key: "math", label: "Mathematics" },

  { key: "physics", label: "Physics" },
  // astro: Astrophysics
  // cond-mat: Condensed Matter
  // hep: High Energy Physics
  // gr-qc: General Relativity and Quantum Cosmology
  // nlin: Nonlinear Sciences
  // nucl: Nuclear Physics
  // quant: Quantum Physics

  { key: "q-bio", label: "Quantitative Biology" },
  { key: "q-fin", label: "Quantitative Finance" },
  { key: "stat", label: "Statistics" },
];

export type UserSettings = {
  [key: string]: boolean;
};

export default function Page() {
  const { user } = useUser();
  const initials = user?.name.split(" ").map((name) => name.charAt(0));

  const settings = getCookie("settings") as string | undefined;
  const [state, setState] = React.useState<UserSettings>(
    settings ? JSON.parse(settings) : {}
  );

  const handleSave = () => {
    setCookie("settings", JSON.stringify(state));
    window.location.href = `/`;
  };

  const handleLogout = () => {
    window.location.href = `/api/auth/logout`;
  };

  return (
    <div className="flex flex-col gap-1 m-2">
      <Card className="max-w-[800px]">
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <div>
            <CardTitle>Profile</CardTitle>
            <CardDescription>{user?.name}</CardDescription>
          </div>
          <Avatar>
            <AvatarImage src={user?.picture} alt="avatar" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-4">
          {user && (
            <>
              <div className=" flex items-center space-x-4 rounded-md border p-4">
                <Bot />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">GPT-4</p>
                  <p className="text-sm text-muted-foreground">
                    Use GPT-4 for <i>&apos;Ask a question&apos;</i>.
                  </p>
                </div>
                <Switch
                  checked={!!state?.gpt4}
                  onCheckedChange={() =>
                    setState({ ...state, gpt4: !state.gpt4 })
                  }
                />
              </div>

              <div className=" flex items-center space-x-4 rounded-md border p-4">
                <div className="flex-1 space-y-1">
                  <h1>Paper categories</h1>
                  {categories.map((cat, i) => (
                    <div key={i}>
                      <Checkbox
                        checked={!!state[cat.key]}
                        onCheckedChange={() =>
                          setState({ ...state, [cat.key]: !state[cat.key] })
                        }
                        id={cat.key}
                      />
                      <label
                        htmlFor={cat.key}
                        className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {cat.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleLogout}>
            Log out
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
