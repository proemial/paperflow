import {NextResponse} from "next/server";
import {recentPapers} from "../data";

export const runtime = 'edge';

export async function POST(req: Request) {
    const body = await req.json();
    console.log('api/feed', body);

    return NextResponse.json(recentPapers);
}
