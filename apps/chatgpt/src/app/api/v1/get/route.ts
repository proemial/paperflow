import {NextResponse} from "next/server";
import {specificPapers} from "../data";

export const runtime = 'edge';

export async function POST(req: Request) {
    const body = await req.json();
    console.log('api/get', body);

    return NextResponse.json(specificPapers[0]);
}
