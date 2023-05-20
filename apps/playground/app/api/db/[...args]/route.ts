import { NextResponse } from "next/server";
import { logError, logMetric, now } from "utils/metrics";
import { PapersDao } from 'data/db/paper-dao';
import { IngestionDao } from 'data/db/ingestion-dao';

export async function GET(request: Request, { params }: { params: { args: string[] } }) {
  if (params.args.length < 3)
    throw new Error('Invalid args');

  const [dao, operation, arg] = params.args;

  const key = `mongo[GET:${dao}/${operation}/${arg}]`;
  const begin = now();

  try {
    switch (dao) {
      case 'ingestion':
        return NextResponse.json(await ingestionDao(operation, arg));

      case 'papers':
        return NextResponse.json(await papersDao(operation, arg));

      default:
        throw new Error(`Unknown dao: ${dao}`);
    }
  } catch (e) {
    logError(key, begin, e);
    throw e;
  } finally {
    logMetric(key, begin);
  }
}

async function ingestionDao(operation: string, arg: string) {
  switch (operation) {
    case 'get':
      return await IngestionDao.get(arg);

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}

async function papersDao(operation: string, arg: string) {
  switch (operation) {
    case 'get-by-ids':
      return await PapersDao.getByIds(arg.split(','));

    case 'get-by-date':
      const ingestion = await IngestionDao.get(arg)
      const papers = ingestion && await PapersDao.getByIds(ingestion.ids.hits);
      return { ingestion, papers };
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}
