
import { IngestionLogger } from "data/storage/ingestion-log";
import { NextResponse } from "next/server";
import { DateMetrics } from "utils/date";
import { normalizeError } from "utils/error";
import { dateFromParams } from "./utils";
import { PipelineDao } from "data/storage/pipeline";

export const revalidate = 1;

export type IngestionIndex = {
  date: string,
  dates: string[],
  index: IngestionIndexEntries,
};

export type IngestionIndexEntries = {
  [key: string]: string[]
};

export async function GET(request: Request, { params }: { params: { args: string[] } }) {
  const begin = DateMetrics.now();
  let result = '';

  const inputDate = dateFromParams(params);

  try {
    const dates = await PipelineDao.getIngestionIndex();
    const date = inputDate ? dates.find(d => d === inputDate) : dates.sort().at(-1) as string;
    const index: {[key: string]: string[]} = {};

    if(date) {
      const ingestionIndex = await PipelineDao.getIndex(date);

      ingestionIndex?.forEach(entry => {
        const cat = entry.category;
        if (!Object.keys(index).includes(cat)) {
          index[cat] = [];
        }
        index[cat].push(entry.id);
      });
    }

    result = `date: ${inputDate}, latestIngestionDate: ${date}, categories: ${index.length}`;
    return NextResponse.json({ date, dates, index });
  } catch (e) {
    console.error(e);
    result = '[ERROR]' + normalizeError(e).message;
    return new NextResponse(normalizeError(e).message, { status: 500 });
  } finally {
    console.log(`[api/ingestion][${DateMetrics.elapsed(begin)}] ${result}`);
  }
}
