import { getSession } from "@auth0/nextjs-auth0";
import { ViewHistoryDao } from "data/storage/history";
import { PapersDao } from "data/storage/papers";
import assetImg1 from "src/images/asset-bg-1.png";
import assetImg2 from "src/images/asset-bg-2.png";
import assetImg3 from "src/images/asset-bg-3.png";
import { sanitize } from "utils/sanitizer";
import { Badge } from "./badge";
import { Bookmark } from "./bookmark";
import { CardLink } from "./card-link";
import { PubDate } from "./pub-date";

const images = [assetImg1, assetImg2, assetImg3];

export async function PaperCard({ id }: { id: string }) {
  const { text } = await PapersDao.getGptSummary(id, "sm");
  const { parsed } = await PapersDao.getArXivAtomPaper(id);
  const sanitized = sanitize(text);
  const session = await getSession();
  const history = await ViewHistoryDao.get(session?.user.sub, id);

  return (
    <div
      className="shadow-[inset_0_-48px_48px_rgba(0,0,0,0.9)]"
      style={{
        backgroundImage: `url(${image(id)})`,
        backgroundSize: "cover",
      }}
    >
      <div className="p-4 pt-8 flex flex-col justify-end text-lg font-medium items-center ">
        <div className="w-full flex justify-evenly">
          <div className="w-full flex items-end text-sm text-primary-light text-shadow-purple">
            <PubDate
              paper={{
                updated: `${parsed.updated}`,
                published: `${parsed.published}`,
              }}
            />
          </div>
          <div className="w-full flex justify-end pb-4">
            <Bookmark
              id={id}
              category={parsed.category}
              bookmarked={!!history?.bookmarked}
            />
          </div>
        </div>
        <div>
          {/* @ts-ignore */}
          <CardLink id={id} text={sanitized.sanitized} />
        </div>
        <div className="w-full pt-6 pb-1 text-xs tracking-wider flex justify-begin gap-2 overflow-scroll no-scrollbar">
          {sanitized.hashtags.map((tag, index) => (
            <Badge
              key={index}
              id={id}
              category={parsed.category}
              text={tag.slice(1)}
              likes={history?.likes}
            />
          ))}
        </div>
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
