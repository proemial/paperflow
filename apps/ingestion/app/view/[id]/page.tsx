import { PapersDao } from 'data/db/paper-dao';
import dayjs from 'dayjs';
import Link from 'next/link';

export default async function Page({ params }: { params: { id: string } }) {
  const paper = await PapersDao.getById(params.id);

  const removeQuotes = (text: string) => text.replace('"', '');

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-white">
        <div className="space-y-3">
          {paper &&
            <div>
              <div className="text-right text-2xs">{dayjs(paper.revisions[0].parsed.updated).format("YYYY-MM-DD HH:mm:ss")}</div>
              <Link href={paper.revisions[0].raw.id} target="_blank" className="text-2xl font-bold hover:underline">{paper.revisions[0].parsed.title}</Link>
              <div className="text-xs font-extralight">
                {paper.revisions[0].parsed.authors.join(', ')}
              </div>
              {paper.revisions[0].summary &&
                <div className="my-4 p-2 italic rounded-xl border border-zinc-800 text-green-500">&quot;{removeQuotes(paper.revisions[0].summary)}&quot;</div>
              }
              <div className="my-2 text-2xs font-extralight">
                {paper.revisions[0].parsed.abstract}
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
}
