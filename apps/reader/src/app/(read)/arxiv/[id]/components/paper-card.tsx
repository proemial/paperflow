import assetImg1 from "src/images/asset-bg-1.png";
import assetImg2 from "src/images/asset-bg-2.png";
import assetImg3 from "src/images/asset-bg-3.png";
import dayjs from "dayjs";

const images = [assetImg1, assetImg2, assetImg3];

export function PaperCard({
  id,
  date,
  children,
}: {
  id: string;
  date: Date;
  children: string | React.ReactNode;
}) {
  return (
    <div
      className={`min-h-[228px] px-4 py-8 flex flex-col justify-end items-begin`}
      style={{
        backgroundImage: `url(${image(id)})`,
        backgroundSize: "cover",
      }}
    >
      <div className="text-purple-500">
        Preprint published on ArXiv, {dayjs(date).format("MMM DD, YYYY")}
      </div>
      <div className={`text-2xl font-light`}>{children}</div>
    </div>
  );
}

function image(id: string) {
  const lastNum = Number(id.charAt(id.length - 1));
  if (lastNum < 3) return images[0].src;
  if (lastNum < 6) return images[1].src;
  return images[2].src;
}
