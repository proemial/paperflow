import { getSession } from "@auth0/nextjs-auth0";
import { FeedCache } from "data/storage/feed";
import { NextResponse } from "next/server";

export async function POST() {
    const session = await getSession();

    if(session) {
        await FeedCache.delete(session.user.sub);
    }

    return NextResponse.json({});
}
