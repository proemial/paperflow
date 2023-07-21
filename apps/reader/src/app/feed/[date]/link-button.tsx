"use client";
export function LinkButton({ id }: { id: string }) {
  const idParts = id.split(".");
  return (
    <div
      onClick={() => (window.location.href = `/arxiv/${id}`)}
      className="text-purple-500 cursor-pointer"
    >
      <span className="font-medium">{idParts[0]}</span>.
      <span className="font-light">{idParts[1]}</span>
    </div>
  );
}
