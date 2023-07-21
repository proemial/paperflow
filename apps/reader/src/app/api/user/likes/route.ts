import { getSession } from "@auth0/nextjs-auth0";
import { ViewHistoryDao } from "data/storage/history";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getSession();

    let likes = undefined;
    if(session) {
        const likeHistory = await ViewHistoryDao.liked(session.user.sub);

        likes = new Set<string>();
        likeHistory.forEach(h => h.likes?.forEach(l => likes.add(l)));
    }

    return NextResponse.json([...likes]);
}
