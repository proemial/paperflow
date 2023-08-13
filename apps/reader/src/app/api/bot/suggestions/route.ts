import { gptPrompt } from "data/adapters/openai/openai";
import { ConfigDao } from "data/storage/config";
import { PapersDao } from "data/storage/papers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const {id, title, abstract} = await request.json();
    const item = "suggestions";

    let suggestions = await PapersDao.getGptSummary(id, item);
    if (suggestions) {
        return NextResponse.json(asArray(suggestions));
    }

    // Generate suggestions
    const promptTemplates = await ConfigDao.getPromptConfig();
    suggestions = await gptPrompt(title, abstract, promptTemplates[item]);
    if (suggestions.text) {
        // Update DB
        await PapersDao.pushGptSummary(id, item, suggestions);
    }

    return NextResponse.json(asArray(suggestions));
}

// {text: "1. xxx\n2. xxx\n 3. xxx"} > ["xxx", "xxx", "xxx"]
function asArray(records: Record<string, any>) {
    const text = records['text'];

    if(!text[0].match(/^\d/)) {
        return [text];
    }
    return text.split('\n').map(str => str.substring(3))
}
