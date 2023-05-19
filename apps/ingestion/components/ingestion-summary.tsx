import { IngestionState } from "data/db/ingestion-dao";
import { PapersDao, RevisionedPaper } from "data/db/paper-dao";
import Link from "next/link";

export default async function IngestionSummary({ ingestionState }: { ingestionState?: IngestionState }) {
  const papers = ingestionState?.ids.hits ? await PapersDao.getByIds(ingestionState?.ids.hits) : [];

  const groupedPapers: {
    [key: string]: RevisionedPaper[];
  } = {};

  papers.forEach(paper => {
    const key = paper.revisions[0].parsed.category;
    if (!groupedPapers[key]) {
      groupedPapers[key] = [];
    }
    groupedPapers[key].push(paper);
  });


  return (
    <>
      {ingestionState && <>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">Ingestion</div>
          <div className="flex items-center space-x-2">
            <div className="text-sm font-bold">Date:</div>
            <div className="text-sm">{ingestionState.date}</div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold">Status:</div>
          <div className="text-sm">Total: {ingestionState.ids.newIds.length}</div>
          <div className="text-sm">Updated: {ingestionState.ids.hits.length}</div>
          <div className="text-sm">Outdated: {ingestionState.ids.misses.length}</div>
        </div>
        <div className="flex-col items-center justify-between">
          {Object.keys(groupedPapers).sort().map(key => (
            <div key={key} className="py-1">
              <div className="text-sm font-bold">{key}</div>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  {groupedPapers[key].map((paper, i) => {
                    const color = paper.status === 'summarised' ? 'text-green-500' : 'text-zinc-700';

                    return (
                      <span className="text-zinc-700" key={i}>[
                        <Link className={`${color} hover:underline`} href={`/view/${paper.id}`}>{paper.id}</Link>
                        ] </span>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
      }
    </>
  );
}