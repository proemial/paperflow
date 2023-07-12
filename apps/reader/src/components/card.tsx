import assetImg1 from "src/images/asset-bg-1.png";
import assetImg2 from "src/images/asset-bg-2.png";
import assetImg3 from "src/images/asset-bg-3.png";
import { Badge } from "./badge";
import { CardLink } from "./card-link";
import { PapersDao } from "data/storage/papers";
import { sanitize } from "./sanitizer";

const images = [assetImg1, assetImg2, assetImg3];

export async function PaperCard({ id }: { id: string }) {
  const { text } = await PapersDao.getGptSummary(id, "sm");
  const paper = await PapersDao.getArXivAtomPaper(id);
  const sanitized = sanitize(text);

  return (
    <div
      className="p-4 pt-8 flex flex-col justify-end items-center shadow-[inset_0_-48px_48px_rgba(0,0,0,0.9)]"
      style={{
        backgroundImage: `url(${image(id)})`,
        backgroundSize: "cover",
      }}
    >
      <CardLink>{sanitized.sanitized}</CardLink>
      <div className="w-full pt-6 text-xs flex justify-begin gap-2 overflow-scroll no-scrollbar">
        {sanitized.hashtags.map((tag, index) => (
          <Badge key={index} text={tag.slice(1)} />
        ))}
      </div>
    </div>
  );
}

function image(id: string) {
  const lastNum = Number(id.charAt(id.length - 1));
  if (lastNum < 3) return images[0].src;
  if (lastNum < 6) return images[1].src;
  return images[2].src;
}
