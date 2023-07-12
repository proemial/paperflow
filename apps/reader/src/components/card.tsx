import assetImg1 from "src/images/asset-bg-1.png";
import assetImg2 from "src/images/asset-bg-2.png";
import assetImg3 from "src/images/asset-bg-3.png";
import scrollImg from "src/images/scroll.svg";
import { CardLink } from "./card-link";

const images = [assetImg1, assetImg2, assetImg3];

type Props = {
  children: string;
  id: string;
};

export function PaperCard({ children }: Props) {
  return (
    <div
      className={`px-4 py-8 flex flex-col justify-end items-center border rounded-lg border-zinc-700`}
      style={{
        backgroundImage: `url(${image()})`,
        backgroundSize: "cover",
      }}
    >
      <CardLink>{children}</CardLink>
      <div className="w-full pt-4 text-sm font-light flex justify-end items-center">
        <img src={scrollImg.src} width={16} alt="" />
        Microsummary by Paperflow{" "}
      </div>
    </div>
  );
}

function image() {
  return images[random(0, 2)].src;
}

function random(minInclusive: number, maxInclusive: number) {
  return Math.floor(
    Math.random() * (maxInclusive - minInclusive + 1) + minInclusive
  );
}
