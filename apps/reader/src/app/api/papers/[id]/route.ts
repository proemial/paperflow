import { getSession } from "@auth0/nextjs-auth0";
import { ViewHistoryDao } from "data/storage/history";
import { PapersDao } from "data/storage/papers";
import { NextResponse } from "next/server";
import { sanitize } from "utils/sanitizer";

export type PaperResponse = {
    paper: {
        id: string,
        text: string,
        tags: string[],
        published: string,
        category: string,
    },
    history: {
        bookmarked: boolean,
        likes: string[],
    },
};

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const {id} = params;

    const { parsed } = await PapersDao.getArXivAtomPaper(id);
    const {published, category} = parsed;

    const { text: summary } = await PapersDao.getGptSummary(id, "sm");
    const {sanitized: text, hashtags: tags} = sanitize(summary);

    const {history} = await getHistory(id);

    return NextResponse.json({paper: {id, text, tags, published, category}, history});
}

async function getHistory(id: string) {
    const session = await getSession();
    const history = await ViewHistoryDao.get(session?.user.sub, id);
    if(!session || !history) {
        return {history: undefined}
    }
    console.log('history', history);


    const {bookmarked, likes} = history;
    return {history: {bookmarked, likes}};
}
