import { PaperflowCard } from "@/app/components/paperflow-card/card";
import { PapersDao } from "data/db/paper-dao";

export async function RelatedResearch({
  id,
  category,
}: {
  id: string;
  category: { key: string; title: string; category: string };
}) {
  const related = await PapersDao.getByCategory(id, category.key, 5);

  return (
    <div className="flex flex-col gap-2">
      {related?.map((revisionedPaper, i) => {
        const paper = revisionedPaper.revisions.at(-1);
        const { published, title, authors, abstract } = paper.parsed;

        const data = {
          id: paper.parsed.id,
          published: `${published}`,
          title,
          summary: paper.summary,
          authors,
          category,
          link: paper.parsed.link.source,
          ingestionDate: `${revisionedPaper.lastUpdated}`,
          abstract,
        };

        return <PaperflowCard key={i} {...data} compact />;
      })}
    </div>
  );
}
