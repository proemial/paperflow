import { getSession } from "@auth0/nextjs-auth0";
import { ViewHistoryDao } from "data/storage/history";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { paperId: string } }) {
    const session = await getSession();
    const paper = await ViewHistoryDao.get(session.user.sub, params.paperId);

    return NextResponse.json(paper);
}
