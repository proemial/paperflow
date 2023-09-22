"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useQuery } from "@tanstack/react-query";
import { Conversation } from "data/storage/conversations";

export function useConversation(id: string) {
  const { user } = useUser();
  const userId = user?.sub;
  const headers = (userId && { "X-User": userId }) || undefined;

  return useQuery<Conversation, Error>(
    ["conversations", id, userId],
    async () => {
      console.log("Fetching conversation", id, userId);

      const res = await fetch(`/api/conversations/${id}`, { headers });
      return await res.json();
    }
  );
}
