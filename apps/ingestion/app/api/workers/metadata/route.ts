import { PipelineDao } from "data/storage/pipeline";
import { run as runMetadataExtraction } from "./[date]/route";

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

    return await runMetadataExtraction(date);
}
