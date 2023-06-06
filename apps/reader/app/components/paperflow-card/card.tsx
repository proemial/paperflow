import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "app/components/shadcn-ui/Card";
import { SummarisedPaper } from "data/db/ingestion-models";
import dayjs from "dayjs";
import { CardLink } from "./card-link";
import { sanitize } from "./hashtags";

export function PaperflowCard(props: SummarisedPaper & { compact?: boolean; useLink?: boolean }) {
  const { id, published, title, summary, authors, category, link, compact, useLink } = props;
  
  if(compact)
    return <CompactCard {...props} />

  return (
    <Card className="max-sm:w-full">
      <CardHeader>
        <CardTitle>
          <CardLink id={id} title={title} link={useLink && link} />
        </CardTitle>
        <CardDescription>
          {sanitize(summary).sanitized}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col justify-start items-start">
        <CardDescription>
          {`${category?.title} ${dayjs(published).format("YYYY-MM-DD")}`}
        </CardDescription>
          <div className="w-full text-ellipsis whitespace-nowrap overflow-hidden" style={{maxWidth: '60dvw'}}>
            {authors?.map((author) => author.split(" ").at(-1))?.join(", ")}
          </div>
      </CardFooter>
    </Card>
  );
}

function CompactCard({
  id,
  published,
  title,
  summary,
  link,
  useLink,
}: SummarisedPaper & { useLink?: boolean }) {
  return (
    <Card className="max-sm:w-full">
      <CardHeader className="p-3">
        <CardTitle>
          <CardLink id={id} title={title} link={useLink && link} />
        </CardTitle>
        <CardDescription>
          {sanitize(summary).sanitized}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col justify-start items-end pb-3">
        <CardDescription>
          {` ${dayjs(published).format("YYYY-MM-DD")}`}
        </CardDescription>
      </CardFooter>
    </Card>
  );
}
