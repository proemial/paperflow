import { sanitize } from "utils/sanitizer";
import { PapersDao } from "data/storage/papers";
import Markdown from "src/components/markdown";

type Props = {
  id: string;
  size: "sm" | "md";
};

export async function GptAbstract({ id, size }: Props) {
  const { text } = await PapersDao.getGptSummary(id, size);
  const sanitized = sanitize(text);

  return <Markdown>{sanitized.sanitized}</Markdown>;
}
