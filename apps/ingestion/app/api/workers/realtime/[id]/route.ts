import {fetchUpdatedArXivAtomPapers} from "data/adapters/arxiv/arxiv-atom";
import {PapersDao} from "data/storage/papers";
import {ConfigDao} from "data/storage/config";
import {fetchOaiPaper} from "data/adapters/arxiv/arxiv-oai";
import { summarize } from "data/adapters/openai/summarize";
import {NextResponse} from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const id = params.id;

    const config = (await ConfigDao.getPipelineConfig()).stages;

    const oaiPaper = await fetchOaiPaper(id, config.arxivOai);
    await PapersDao.pushArXivOaiPapers([oaiPaper]);

    const atomPapers = await fetchUpdatedArXivAtomPapers([id], config.arxivAtom);
    if(atomPapers?.length > 0) {
        await PapersDao.pushArXivAtomPapers(atomPapers);
    }

    const usage = await summarize(id, oaiPaper, config.gptSummary, true);

    return NextResponse.json({title: oaiPaper.title, atomPapers: atomPapers.length, usage});
}