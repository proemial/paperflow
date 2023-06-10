import { IngestionLogger } from "data/storage/ingestion-log";
import { PipelineDao } from "data/storage/pipeline";
import { NextResponse } from "next/server";
import { DateMetrics } from "utils/date";
import { normalizeError } from "utils/error";
import { dateFromParams } from "@/app/api/utils";

export const revalidate = 1;

export async function GET(request: Request, { params }: { params: { date: string } }) {
  return await run(params);
}
export async function POST(request: Request, { params }: { params: { date: string } }) {
  return await run(params);
}

async function run(params: { date: string }) {
  const begin = DateMetrics.now();
  let result = '';

  const date = dateFromParams(params);

  try {
    // const config = await ConfigDao.get();
    const pipeline = await PipelineDao.get(date);

    result = `workers: `;
    return NextResponse.json({result});
  } catch (e) {
    console.error(e);
    result = '[ERROR]' + normalizeError(e).message;
    return new NextResponse(normalizeError(e).message, { status: 500 });
  } finally {
    console.log(`[${DateMetrics.elapsed(begin)}] /api/scheduler/workers`);
    await IngestionLogger.log(date, `[workers][${DateMetrics.elapsed(begin)}] ${result}`);
  }
}
