'use server'
import { getSession } from "@auth0/nextjs-auth0";
import { ViewHistoryDao } from "data/storage/history";

export async function clearBookmarks() {
    const session = await getSession();

    await ViewHistoryDao.clearBookmarks(session.user.sub);
}

export async function clearLikes() {
    const session = await getSession();

    await ViewHistoryDao.clearLikes(session.user.sub);
}
