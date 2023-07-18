'use server'
import { getSession } from "@auth0/nextjs-auth0";
import { ViewHistoryDao } from "data/storage/history";

export async function bookmark(id: string, bookmarked: boolean) {
    const session = await getSession();

    await ViewHistoryDao.bookmark(session.user.sub, id, bookmarked);
}
