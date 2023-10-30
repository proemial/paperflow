import {ArXivOaiPaper} from "../arxiv/arxiv-oai";
import {PipelineStageConfig} from "../redis/redis-client";
import {ConfigDao} from "../../storage/config";
import {PapersDao} from "../../storage/papers";
import {gptPrompt} from "./openai";

export async function summarize(id: string, paper: ArXivOaiPaper, config: PipelineStageConfig, skipCache?: boolean) {
    const sizes = (config.sizes as string[]) || ['sm']
    const promptTemplates = await ConfigDao.getPromptConfig();
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    let usage = 0;
    for (let index = 0; index < sizes.length; index++) {
        if(!skipCache) {
            // Check if summarisation is already done
            const cachedSummary = await PapersDao.getGptSummary(id, sizes[index]);
            if (cachedSummary) {
                continue;
            }
        }

        // Run summarization
        const summary = await gptPrompt(paper.title, paper.abstract, promptTemplates[sizes[index]]);
        console.log('summary', summary)
        if (summary.text) {
            // Update DB
            await PapersDao.pushGptSummary(id, sizes[index], summary);
            usage += summary.usage?.total_tokens || 0;
        }

        await sleep(config.sleep as number || 500);
    }

    return usage;
}
