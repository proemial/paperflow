import { buildFeed } from "src/utils/feed";
import { getSession } from "@auth0/nextjs-auth0";
import { FeedCache } from "data/storage/feed"
import { ViewHistoryDao } from "data/storage/history";
import { PipelineDao } from "data/storage/pipeline";
import { NextResponse } from "next/server";
import {asChunks} from "utils/array"
import { cookies } from "next/dist/client/components/headers";
import { UserSettings } from "@/src/app/profile/categories";

export type FeedItem = {
    id: string,
    score: number,
    categories: string[],
    tags: string[]
};

export type FeedResponse = {
    items: FeedItem[],
    pages: {
        current: number,
        last: number,
        next: number,
    },
};

export async function GET(request: Request, { params }: { params: { page: string } }) {
    const current = Number(params.page);

    // todo: cache latestIngestedDate on the client
    const ingestionIndex = await PipelineDao.getIngestionIndex();
    const date = ingestionIndex.at(-1);

    // TODO: consider caching the username
    const session = await getSession();
    const key = session ? `${session.user.sub}:${date}` : date;

    let allItems = await FeedCache.get(key);
    if(!allItems) {
        const feedData = await buildFeed(date);
        allItems = feedData.papers;
        await FeedCache.push(key, allItems)
    }

    if(session) {
        const read = (await ViewHistoryDao.readHistory(session.user.sub)).map(p => p.paper);
        allItems = allItems.filter((item) => !read.includes(item.id));

        const categories = getCategoriesFromCookie();
        if(categories && Object.keys(categories).length > 0 && categories.length > 0) {
            allItems = allItems.filter((item) => {
                return item.categories.filter(itemCategory => {
                    return categories.filter(category => {
                        return itemCategory.startsWith(category) ||
                        (category === "physics" &&
                            (itemCategory.startsWith("astro") ||
                            itemCategory.startsWith("cond-mat") ||
                            itemCategory.startsWith("hep") ||
                            itemCategory.startsWith("gr-qc") ||
                            itemCategory.startsWith("nlin") ||
                            itemCategory.startsWith("nucl") ||
                            itemCategory.startsWith("quant")))
                    }).length > 0;

                }).length > 0;
            });
        }
    }

    const pages = asChunks(allItems, 20);
    const last = pages.length -1;
    const next = (current +1) < last ? current + 1 : undefined

    const items = pages[current];

    return NextResponse.json({items, pages: {current, next, last}});
}

function getCategoriesFromCookie(): string[] {
    const cookieStore = cookies();
    const settingsString = cookieStore.get("settings");

    if (!settingsString?.value) return [];

    const settings = JSON.parse(settingsString.value) as UserSettings;
    return Object.keys(settings).filter((key) => !!settings[key]);
  }
