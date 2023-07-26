import { NextResponse } from "next/server";
import { extractMetadata } from "../metadata";

export const revalidate = 1;

export async function GET(request: Request, { params }: { params: { date: string } }) {
    return await run(params.date);
}

export async function POST(request: Request, { params }: { params: { date: string } }) {
    return await run(params.date);
}

async function run(date: string) {
    return NextResponse.json(await extractMetadata(date));
}
