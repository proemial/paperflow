'use server'
import { getSession } from "@auth0/nextjs-auth0";
import { ViewHistoryDao } from "data/storage/history";

export async function bookmark(id: string, category: string, bookmarked: boolean) {
    const session = await getSession();

    await ViewHistoryDao.bookmark(session.user.sub, id, category, bookmarked);
}

export async function like(id: string, category: string, likes: string[]) {
    const session = await getSession();

    await ViewHistoryDao.like(session.user.sub, id, category, likes);
}
