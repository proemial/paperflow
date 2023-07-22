import assetImg1 from "src/images/asset-bg-1.png";
import assetImg2 from "src/images/asset-bg-2.png";
import assetImg3 from "src/images/asset-bg-3.png";
import dayjs from "dayjs";

const images = [assetImg1, assetImg2, assetImg3];

type Props = {
  id: string;
  date: Date;
  children: string | React.ReactNode;
};

export function PaperCard({ id, date, children }: Props) {
  return (
    <div
      className={`min-h-[228px] px-4 pb-4 pt-16 flex flex-col justify-end items-begin`}
      style={{
        backgroundImage: `url(${image(id)})`,
        backgroundSize: "cover",
        boxShadow: "inset 0 -40px 60px -10px #000000",
      }}
    >
      <div className="mb-2 text-sm text-primary-light text-shadow-purple">
        Preprint published on ArXiv, {dayjs(date).format("MMM DD, YYYY")}
      </div>
      <div className={`text-3xl text-shadow-shine`}>{children}</div>
    </div>
  );
}

function image(id: string) {
  const lastNum = Number(id.charAt(id.length - 1));
  if (lastNum < 3) return images[0].src;
  if (lastNum < 6) return images[1].src;
  return images[2].src;
}
