import { buildFeed } from "@/src/utils/feed";
import { getSession } from "@auth0/nextjs-auth0";
import { FeedCache } from "data/storage/feed"
import { ViewHistoryDao } from "data/storage/history";
import { PipelineDao } from "data/storage/pipeline";
import { NextResponse } from "next/server";
import {asChunks} from "utils/array"

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
    }

    const pages = asChunks(allItems, 8);
    const last = pages.length -1;
    const next = (current +1) < last ? current + 1 : undefined

    const items = pages[current];

    return NextResponse.json({items, pages: {current, next, last}});
}
