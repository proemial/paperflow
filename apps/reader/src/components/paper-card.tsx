import assetImg1 from "./images/asset-bg-1.png";
import assetImg3 from "./images/asset-bg-3.png";
import scrollImg from "./images/scroll.svg";

type variants = "asset" | "related";
export function PaperCard({
  children,
  variant,
}: {
  children: string;
  variant?: string;
}) {
  const isAsset = variant !== "related";
  const img = isAsset ? assetImg1.src : assetImg3.src;
  const containerStyle = isAsset ? "min-h-[228px]" : "mb-4";
  const textStyle = isAsset ? "text-2xl" : "";

  return (
    <div
      className={`${containerStyle} px-4 py-8 flex flex-col justify-end items-center`}
      style={{
        backgroundImage: `url(${img})`,
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
