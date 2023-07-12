import assetImg from "./images/asset-bg-1.png";

export function PaperCard() {
  console.log("assetImg", assetImg.src);

  return (
    <div
      className="min-h-[256px] px-4 py-8"
      style={{
        backgroundImage: `url(${assetImg.src}) no-repeat`,
        backgroundSize: "cover",
      }}
    >
      DR-TB patients in Bangladesh face delays due to seeking care from multiple
      informal providers
      <div className="flex justify-end">Microsummary by Paperflow </div>
    </div>
  );
}
