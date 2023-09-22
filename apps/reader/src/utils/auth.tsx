import { useUser } from "@auth0/nextjs-auth0/client";

export function useRole(role: string) {
  const { user } = useUser();
  const roles = (user && user["https://paperflow.ai/roles"] as string[]) || [];

  return roles.includes(role);
}