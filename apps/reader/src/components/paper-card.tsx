import assetImg from "./images/asset-bg-1.png";
import scrollImg from "./images/scroll.svg";

export function PaperCard() {
  console.log("assetImg", assetImg.src);

  return (
    <div
      className="min-h-[256px] px-4 py-8 flex flex-col justify-center items-center"
      style={{
        backgroundImage: `url(${assetImg.src}) no-repeat`,
        backgroundSize: "cover",
      }}
    >
      <div className="text-2xl font-light">
        DR-TB patients in Bangladesh face delays due to seeking care from
        multiple informal providers
      </div>
      <div className="w-full pt-4 text-sm font-light flex justify-end items-center">
        <img src={scrollImg.src} width={16} alt="" />
        Microsummary by Paperflow{" "}
      </div>
    </div>
  );
}
