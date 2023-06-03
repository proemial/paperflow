import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "app/components/Card";

export type CardProps = {
  url?: string;
  pubDate?: string;
  title?: string;
  authors?: string[];
  summary: string;
  tags?: string[];
};

export function PaperflowCard({ pubDate, title, summary, authors }: CardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{summary}</CardTitle>
        <CardDescription>{title}</CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col justify-start items-start">
        <CardDescription>{pubDate}</CardDescription>
        <div className="w-full text-ellipsis whitespace-nowrap overflow-hidden">
          {authors?.join(", ")}
        </div>
      </CardFooter>
    </Card>
  );
}
