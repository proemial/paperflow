import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "app/components/shadcn-ui/Card";
import { arXivCategory } from "data/adapters/arxiv/arxiv.models";
import { PapersDao } from "data/storage/papers";
import dayjs from "dayjs";
import { Suspense } from "react";
import Spinner from "../spinner";
import { CardLink } from "./card-link";
import { HashBadge, HashBadges } from "./hashtags";
import { sanitize } from "@/app/components/paperflow-card/sanitizer";

export async function PaperflowCard(props: { id: string }) {
  const { id } = props;

  const paper = await PapersDao.getArXivAtomPaper(id);
  const { title, authors, category, link } = paper?.parsed;

  return (
    <Card className="max-sm:w-full">
      <CardHeader>
        <CardTitle>
          <CardLink id={id} title={title} link={link?.source} />
        </CardTitle>
        <Suspense fallback={<Spinner />}>
          {/* @ts-expect-error Server Component */}
          <GptSummary id={id} category={category} />
        </Suspense>
      </CardHeader>
      <CardFooter className="flex flex-col justify-start items-start">
        <CardDescription>
          {dayjs(paper.raw.published).format("YYYY-MM-DD")}
        </CardDescription>
        <div className="flex w-full">
          <div
            className="flex-1 text-ellipsis whitespace-nowrap overflow-hidden"
            style={{ maxWidth: "60dvw" }}
          >
            {authors?.map((author) => author.split(" ").at(-1))?.join(", ")}
          </div>
          <div className="whitespace-nowrap text-sm text-blue-400 flex items-center ml-1">
            [
            <a
              href={`https://arxiv.org/abs/${id}`}
              target="_blank"
              className="underline"
            >
              arXiv
            </a>
            ][
            <a
              href={`https://arxiv.org/pdf/${id}`}
              target="_blank"
              className="underline"
            >
              pdf
            </a>
            ]
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

async function GptSummary({ id, category }: { id: string; category: string }) {
  const { text } = await PapersDao.getGptSummary(id, "sm");
  const sanitized = sanitize(text);

  return (
    <>
      <CardDescription>{sanitized.sanitized}</CardDescription>
      <div>
        <HashBadge text={arXivCategory(category)?.title} heavy />
        <HashBadges hashtags={sanitized.hashtags} />
      </div>
    </>
  );
}
