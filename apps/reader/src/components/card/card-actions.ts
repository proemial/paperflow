'use server'
import { getSession } from "@auth0/nextjs-auth0";
import { FeedCache } from "data/storage/feed";
import { ViewHistoryDao } from "data/storage/history";

export async function bookmark(id: string, category: string, bookmarked: boolean) {
    const session = await getSession();

    await ViewHistoryDao.bookmark(session.user.sub, id, category, bookmarked);
}

export async function like(id: string, category: string, text: string, liked: boolean) {
    const session = await getSession();

    if(liked) {
        await ViewHistoryDao.like(session.user.sub, id, category, text);
    } else {
        await ViewHistoryDao.unlike(session.user.sub, text);
    }
    await FeedCache.delete(session.user.sub);
}
