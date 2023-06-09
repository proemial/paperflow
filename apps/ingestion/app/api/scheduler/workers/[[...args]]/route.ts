import { IngestionLogger } from "data/storage/ingestion-log";
import { PipelineDao } from "data/storage/pipeline";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import { DateMetrics } from "utils/date";
import { normalizeError } from "utils/error";

export const revalidate = 1;

export async function GET(request: Request, { params }: { params: { args: string[] } }) {
  return await run(params.args);
}
export async function POST(request: Request, { params }: { params: { args: string[] } }) {
  return await run(params.args);
}

async function run(args: string[]) {
  const begin = DateMetrics.now();
  let result = '';

  const date = args
    ? dayjs().format(args[0])
    : dayjs().subtract(1, 'day').format("YYYY-MM-DD");

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
