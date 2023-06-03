import { PaperflowCard } from "app/components/paperflow-card";
import { PapersDao } from "data/db/paper-dao";

export default async function ReaderPage({
  params,
}: {
  params: { id: string };
}) {
  const versionedPaper = await PapersDao.getById(params.id);

  const latest = versionedPaper.revisions.at(-1);

  const { id, link, published, title, authors } = latest.parsed;
  const { summary } = latest;

  const data = {
    id,
    published,
    title,
    summary,
    authors: authors.map((author) => author.split(" ").at(-1)),
    link: link.source,
  };

  return (
    <div>
      <PaperflowCard {...data} />
    </div>
  );
}
