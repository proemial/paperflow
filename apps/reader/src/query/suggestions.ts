import { Message } from "data/storage/conversations";

type SuggestionsPayload = { id: string, title: string; abstract: string };

// TODO: DELETE
export async function generateSuggestions(payload: SuggestionsPayload) {
  const result = await fetch("/api/bot/suggestions", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const json = (await result.json()) as string[];
  return json.map(text => ({
    text,
    createdAt: new Date().toString(),
  } as Message));
}
