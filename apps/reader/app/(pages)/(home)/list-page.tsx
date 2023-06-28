import { PipelineDao } from "data/storage/pipeline";
import { CardList } from "./card-list";
import { cookies } from "next/headers";
import { UpdateIndex } from "data/adapters/redis/redis-client";
import { UserSettings } from "../profile/page";

export const revalidate = 60;

function getCategoriesFromCookie(): string[] {
  const cookieStore = cookies();
  const settingsString = cookieStore.get("settings");

  if (!settingsString?.value) return [];

  const settings = JSON.parse(settingsString.value) as UserSettings;
  return Object.keys(settings).filter(
    (key) => key !== "gpt4" && !!settings[key]
  );
}

export async function ListPage() {
  const categories = getCategoriesFromCookie();
  console.log("categories", categories);

  const filter = (index?: UpdateIndex) => {
    return categories.length === 0
      ? index?.filter((entry) => entry.category.startsWith("cs"))
      : index?.filter((entry) => {
          return (
            categories.filter(
              (category) =>
                entry.category.startsWith(category) ||
                (category === "physics" &&
                  (entry.category.startsWith("astro") ||
                    entry.category.startsWith("cond-mat") ||
                    entry.category.startsWith("hep") ||
                    entry.category.startsWith("gr-qc") ||
                    entry.category.startsWith("nlin") ||
                    entry.category.startsWith("nucl") ||
                    entry.category.startsWith("quant")))
            ).length > 0
          );
        });
  };

  const ingestionIndex = await PipelineDao.getIngestionIndex();
  const index = await PipelineDao.getIndex(ingestionIndex.at(-1));

  const latestIds = filter(index)
    .map((entry) => entry.id)
    .sort()
    .reverse();

  return (
    <CardList
      latestIds={latestIds.slice(
        0,
        latestIds.length > 20 ? latestIds.length / 4 : latestIds.length - 1
      )}
    />
  );
}
