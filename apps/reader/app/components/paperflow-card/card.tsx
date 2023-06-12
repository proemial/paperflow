import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "app/components/shadcn-ui/Card";
import { arXivCategory } from "data/adapters/arxiv/arxiv.models";
import { PapersDao } from "data/storage/papers";
import dayjs from "dayjs";
import { Suspense } from 'react';
import Spinner from "../spinner";
import { CardLink } from "./card-link";
import { sanitize } from "./hashtags";

export async function PaperflowCard(props: {id: string} & { compact?: boolean; useLink?: boolean }) {
  const { id, compact, useLink } = props;

  const paper = await PapersDao.getArXivAtomPaper(id);
  const {published, title, authors, category, link} = paper?.parsed

  if(compact)
    return (
      <>
        {/* @ts-expect-error Server Component */}
        <CompactCard id={id} />
      </>
    )

  return (
    <Card className="max-sm:w-full">
      <CardHeader>
        <CardTitle>
          <CardLink id={id} title={title} link={useLink && link?.source} />
        </CardTitle>
        <Suspense fallback={<Spinner />}>
          {/* @ts-expect-error Server Component */}
          <GptSummary id={id} />
        </Suspense>
      </CardHeader>
      <CardFooter className="flex flex-col justify-start items-start">
        <CardDescription>
          {`${arXivCategory(category)?.title} ${dayjs(published).format("YYYY-MM-DD")}`}
        </CardDescription>
          <div className="w-full text-ellipsis whitespace-nowrap overflow-hidden" style={{maxWidth: '60dvw'}}>
            {authors?.map((author) => author.split(" ").at(-1))?.join(", ")}
          </div>
      </CardFooter>
    </Card>
  );
}

async function CompactCard({id}: {id: string}) {
  const {text} = await PapersDao.getGptSummary(id, 'sm');

  return (
    <Card className="max-sm:w-full">
      <CardHeader className="p-3">
        <CardDescription>
          <CardLink id={id} title={sanitize(text).sanitized} className="hover:underline" />
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

async function GptSummary({id}: {id: string}) {
  const {text} = await PapersDao.getGptSummary(id, 'sm');

  return (
    <CardDescription>
      {sanitize(text).sanitized}
    </CardDescription>
  )
}
