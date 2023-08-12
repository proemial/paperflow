import dayjs from "dayjs";

type Props = {
  paper: {
    updated: string;
    published: string;
  };
};

export function PubDate({ paper }: Props) {
  const today = dayjs();
  const publishedAt = dayjs(paper.published);
  const updatedAt = dayjs(paper.updated);

  const diff = today.diff(publishedAt, "days");
  const text =
    diff <= 5 // days
      ? `Published on ${publishedAt.format("MMM DD, YYYY")}`
      : `Edited on ${updatedAt.format("MMM DD, YYYY")}`;

  return (
    <div className="flex items-end text-sm text-primary-light text-shadow-purple">
      {text}
    </div>
  );
}
