import { PipelineDao } from "data/storage/pipeline";
import { extractMetadata } from "./metadata";
import { NextResponse } from "next/server";

export const revalidate = 1;

export async function GET() {
    return await run();
}

export async function POST() {
    return await run();
}

async function run() {
    const ingestionIndex = await PipelineDao.getIngestionIndex();
    const date = ingestionIndex.at(-1) as string;

    return NextResponse.json(await extractMetadata(date));
}
