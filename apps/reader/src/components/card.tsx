import assetImg1 from "src/images/asset-bg-1.png";
import assetImg2 from "src/images/asset-bg-2.png";
import assetImg3 from "src/images/asset-bg-3.png";
import { Heart } from "lucide-react";
import { CardLink } from "./card-link";
import { Badge } from "./badge";

const images = [assetImg1, assetImg2, assetImg3];

type Props = {
  paper: {
    id: string;
    text: string;
    category: string;
    tags: string[];
    published: string;
  };
};

export function PaperCard({ paper }: Props) {
  return (
    <div
      className="p-4 pt-8 flex flex-col justify-end items-center shadow-[inset_0_-48px_48px_rgba(0,0,0,0.9)]"
      style={{
        backgroundImage: `url(${image(paper.id)})`,
        backgroundSize: "cover",
      }}
    >
      <CardLink>{paper.text}</CardLink>
      <div className="w-full pt-6 text-xs flex justify-begin gap-2 overflow-scroll no-scrollbar">
        {paper.tags.map((tag, index) => (
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
