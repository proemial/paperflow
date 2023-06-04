import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "app/components/shadcn-ui/Card";
import { SummarisedPaper } from "data/db/ingestion-dao";
import dayjs from "dayjs";
import { CardLink } from "./card-link";

export function PaperflowCard({
  id,
  published,
  title,
  summary,
  authors,
  category,
  link,
}: SummarisedPaper) {
  return (
    <Card className="max-sm:w-full">
      <CardHeader>
        <CardTitle>
          <CardLink id={id} title={title} link={link} />
        </CardTitle>
        <CardDescription>{summary}</CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col justify-start items-start">
        <CardDescription>
          {`${category.title} ${dayjs(published).format("YYYY-MM-DD")}`}
        </CardDescription>
        <div className="w-full text-ellipsis whitespace-nowrap overflow-hidden">
          {authors.map(author => author.split(' ').at(-1))?.join(", ")}
        </div>
      </CardFooter>
    </Card>
  );
}
