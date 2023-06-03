import { CardProps, PaperflowCard } from "app/components/paperflow-card";
import Link from "next/link";

export function CardList({ data }: { data?: CardProps[] }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="max-sm:flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-2 flex-1">
        {data?.map((entry, i) => (
          <PaperflowCard key={i} {...entry} />
        ))}
      </div>
      {data && (
        <div className="flex items-end justify-end">
          <Link href="">Load more</Link>
        </div>
      )}
    </div>
  );
}
