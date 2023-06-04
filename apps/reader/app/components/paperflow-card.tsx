import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "app/components/shadcn-ui/Card";
import dayjs from "dayjs";
import Link from "next/link";
import { arxivCategories } from "data/adapters/arxiv/arxiv.models";
import { SummarisedPaper } from "data/db/ingestion-dao";

export function PaperflowCard({
  id,
  published,
  title,
  summary,
  authors,
  category,
}: SummarisedPaper) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          <Link href={`/read/${id}`} className="underline">
            {title}
          </Link>
        </CardTitle>
        <CardDescription>{summary}</CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col justify-start items-start">
        <CardDescription>
          {category.title}
          {dayjs(published).format("YYYY-MM-DD")}
        </CardDescription>
        <div className="w-full text-ellipsis whitespace-nowrap overflow-hidden">
          {authors?.join(", ")}
        </div>
      </CardFooter>
    </Card>
  );
}
