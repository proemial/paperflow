import { IngestionLogger } from "data/storage/ingestion-log";
import { PipelineDao } from "data/storage/pipeline";
import { NextResponse } from "next/server";
import { DateMetrics } from "utils/date";
import { normalizeError } from "utils/error";
import { dateFromParams } from "@/app/api/utils";
import { ConfigDao } from "data/storage/config";
import { QStash } from "data/adapters/qstash/qstash-client"
import { ArxivAtomWorker, GptSummaryWorker, PipelineStage, PipelineStageConfig, WorkerStatus } from "data/adapters/redis/redis-client";

export const revalidate = 1;

export async function GET(request: Request, { params }: { params: { args: string[] } }) {
  return await run(params);
}
export async function POST(request: Request, { params }: { params: { args: string[] } }) {
  return await run(params);
}

async function run(params: { args: string[] }) {
  const begin = DateMetrics.now();
  let result = '';

  const date = dateFromParams(params);
  console.log('date', date);

  try {
    const config = await ConfigDao.getPipelineConfig();
    const pipeline = await PipelineDao.getPipeline(date);

    const scheduledArxivAtomWorkers = await scheduleArxivAtomWorker(date, pipeline.stages.arxivAtom);
    const scheduledGptSummaryWorkers = await scheduleGptSummaryWorkers(date, pipeline.stages.gptSummary, config.stages.gptSummary);

    let scheduledMetadataWorkers = 0;
    if(isDone(pipeline.stages.gptSummary)) {
      scheduledMetadataWorkers = await scheduleMetadataWorker(date, scheduledGptSummaryWorkers.length);
    }

    result = `ArxivAtom: ${scheduledArxivAtomWorkers}, GptSummary: ${scheduledGptSummaryWorkers.length}, Metadata: ${scheduledMetadataWorkers}`;
    return NextResponse.json({result});
  } catch (e) {
    console.error(e);
    result = '[ERROR]' + normalizeError(e).message;
    return new NextResponse(normalizeError(e).message, { status: 500 });
  } finally {
    await IngestionLogger.log(date, `[scheduler][${DateMetrics.elapsed(begin)}] ${result}`);
  }
}

async function scheduleArxivAtomWorker(date: string, actions: ArxivAtomWorker[]) {
  const idleWorkerIndex = actions.findIndex(worker => worker.status === 'idle');
  if(idleWorkerIndex > -1) {
    await QStash.schedule(date, PipelineStage.arxivAtom, [idleWorkerIndex]);
  }
  console.log('idleWorkerIndex', idleWorkerIndex);

  return idleWorkerIndex > -1 ? 1 : 0;
}

async function scheduleGptSummaryWorkers(date: string, actions: GptSummaryWorker[], config: PipelineStageConfig) {
  const actionsWithIndex = actions.map((action, index) => ({...action, index}))
  const idleWorkers = actionsWithIndex.filter(action => action.status === 'idle');

  if(idleWorkers?.length > 0) {
    const running = actionsWithIndex.filter(worker => worker.status === 'running' || worker.status === 'scheduled');
    const freeSlots = (config.concurrency as number) - running.length;

    if(freeSlots > 0){
      const workerIndices = idleWorkers.slice(0, freeSlots).map(worker => worker.index);

      await QStash.schedule(date, PipelineStage.gptSummary, workerIndices);

      return workerIndices;
    }
  }

  return [];
}

async function scheduleMetadataWorker(date: string, gptWorkers: number) {
  if(gptWorkers > 0)
    return 0;

    const metadata = await PipelineDao.getMetadata(date);

    if(metadata)
      return 0

    await QStash.schedule(date, PipelineStage.metadata);

    return 1;
}

function isDone(workers: {status: WorkerStatus}[]) {
  return workers.length > 0
      && workers.map(s => s.status)
                .filter(s => ['idle', 'scheduled', 'running'].includes(s)).length === 0;
}
