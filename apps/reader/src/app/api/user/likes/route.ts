import { getSession } from "@auth0/nextjs-auth0";
import { ViewHistoryDao } from "data/storage/history";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getSession();

    const likes = new Set<string>();
    if(session) {
        const likeHistory = await ViewHistoryDao.liked(session.user.sub);

        likeHistory.forEach(h => h.likes?.forEach(l => likes.add(l)));
    }

    return NextResponse.json([...likes]);
}

export type LikesPostRequest = {
    id: string,
    category: string,
    text: string,
    liked: boolean,
}

export async function POST(request: Request) {
    const {id, category, text, liked} = await request.json() as LikesPostRequest;

    const session = await getSession();
    if(session) {
        if(liked) {
            await ViewHistoryDao.like(session.user.sub, id, category, text);
        } else {
            await ViewHistoryDao.unlike(session.user.sub, text);
        }
    }

    return NextResponse.json({});
}
