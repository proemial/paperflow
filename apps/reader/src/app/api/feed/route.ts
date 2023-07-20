import { buildFeed } from "@/src/utils/feed";
import { getSession } from "@auth0/nextjs-auth0";
import { FeedCache } from "data/storage/feed"
import { ViewHistoryDao } from "data/storage/history";
import { PipelineDao } from "data/storage/pipeline";
import { NextResponse } from "next/server";

export type FeedItem = {
    id: string,
    score: number,
    categories: string[],
    tags: string[]
};

export async function GET() {
    const ingestionIndex = await PipelineDao.getIngestionIndex();
    const date = ingestionIndex.at(-1);

    const session = await getSession();
    const key = session ? `${session.user.sub}:${date}` : date;

    let paperIds = await FeedCache.get(key);
    if(!paperIds) {
        const feedData = await buildFeed(date);
        paperIds = feedData.papers;
        await FeedCache.push(key, paperIds)
    }

    if(session) {
        const read = (await ViewHistoryDao.readHistory(session.user.sub)).map(p => p.paper);
        paperIds = paperIds.filter((item) => !read.includes(item.id));
    }

    return NextResponse.json(paperIds);
}
