import { PapersDao } from "data/storage/papers";
import { PipelineDao } from "data/storage/pipeline";
import { NextResponse } from "next/server";

export const revalidate = 1;

export async function GET(request: Request, { params }: { params: { date: string } }) {
    return await run(params.date);
}

export async function POST(request: Request, { params }: { params: { date: string } }) {
    return await run(params.date);
}

export async function run(date: string) {
    const index = await PipelineDao.getIndex(date);

    if(index.length > 0){
        const metadata = await PapersDao.buildMetadata(index.map((i) => i.id));
        await PipelineDao.pushMetadata(date, metadata);
    }

    return NextResponse.json({date, count: index.length});
}
