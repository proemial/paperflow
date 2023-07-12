import assetImg1 from "src/images/asset-bg-1.png";
import assetImg2 from "src/images/asset-bg-2.png";
import assetImg3 from "src/images/asset-bg-3.png";
import scrollImg from "src/images/scroll.svg";

const images = [assetImg1, assetImg2, assetImg3];

type variants = "asset" | "related";
export function PaperCard({
  id,
  children,
  variant,
}: {
  id: string;
  children: string | React.ReactNode;
  variant?: string;
}) {
  const isAsset = variant !== "related";
  const containerStyle = isAsset ? "min-h-[228px]" : "mb-4";
  const textStyle = isAsset ? "text-2xl" : "";

  return (
    <div
      className={`${containerStyle} px-4 py-8 flex flex-col justify-end items-center`}
      style={{
        backgroundImage: `url(${image(id)})`,
        backgroundSize: "cover",
      }}
    >
      <div className={`${textStyle} font-light`}>{children}</div>
      <div className="w-full pt-4 text-sm font-light flex justify-end items-center">
        <img src={scrollImg.src} width={16} alt="" />
        Microsummary by Paperflow{" "}
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
