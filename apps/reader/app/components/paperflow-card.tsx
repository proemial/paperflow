import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "app/components/Card";
import dayjs from "dayjs";

export type CardProps = {
  link?: string;
  published?: Date;
  title?: string;
  authors?: string[];
  summary: string;
  tags?: string[];
};

export function PaperflowCard({
  published,
  title,
  summary,
  authors,
}: CardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{summary}</CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col justify-start items-start">
        <CardDescription>
          {dayjs(published).format("YYYY-MM-DD")}
        </CardDescription>
        <div className="w-full text-ellipsis whitespace-nowrap overflow-hidden">
          {authors?.join(", ")}
        </div>
      </CardFooter>
    </Card>
  );
}
