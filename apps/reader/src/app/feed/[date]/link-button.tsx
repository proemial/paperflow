"use client";
export function LinkButton({ id }: { id: string }) {
  return (
    <button
      onClick={() => (window.location.href = `/arxiv/${id}`)}
      className="text-purple-500"
    >
      {id}
    </button>
  );
}
