import { CardLink } from "@/app/components/paperflow-card/card-link";
import { sanitize } from "@/app/components/paperflow-card/sanitizer";
import { SkeletonCard } from "@/app/components/paperflow-card/skeleton";
import {
  Card,
  CardDescription,
  CardHeader,
} from "@/app/components/shadcn-ui/Card";
import { PapersDao } from "data/storage/papers";
import { PipelineDao } from "data/storage/pipeline";
import { Suspense } from "react";

export async function RelatedResearch({
  id,
  category,
}: {
  id: string;
  category: string;
}) {
  const index = await PipelineDao.getIngestionIndex();
  const ingested = await PipelineDao.getIndex(index?.at(-1));
  const filtered = ingested?.filter(
    (entry) => entry.id !== id && entry.category === category
  );

  return (
    <div className="flex flex-col gap-2">
      {filtered?.map((entry, i) => (
        <>
          <Suspense fallback={<SkeletonCard />}>
            {/* @ts-expect-error Server Component */}
            <PaperCard key={i} id={entry.id} />
          </Suspense>
        </>
      ))}
    </div>
  );
}

async function PaperCard({ id }: { id: string }) {
  const { text } = await PapersDao.getGptSummary(id, "sm");

  return (
    <Card className="max-sm:w-full">
      <CardHeader className="p-3">
        <CardDescription>
          <CardLink
            id={id}
            title={sanitize(text).sanitized}
            className="hover:underline"
          />
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
