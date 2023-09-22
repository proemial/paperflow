
type SuggestionsPayload = { id: string, title: string; abstract: string };

// TODO: DELETE
export async function generateSuggestions(payload: SuggestionsPayload) {
  const result = await fetch("/api/bot/suggestions", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return (await result.json()) as string[];
}
