import { ConversationsDao, Message, Conversation } from "data/storage/conversations";
import { PapersDao } from "data/storage/papers";
import { NextResponse } from "next/server";
import { getSuggestions } from "../../bot/suggestions/route";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const {id} = params;
    const user = request.headers.get('X-User');

    const data = await ConversationsDao.get(id, user);

    if(!data) {
        const paper = await PapersDao.getArXivAtomPaper(id);
        const {title, abstract} = paper.parsed;

        const suggestions = await getSuggestions(id, title, abstract);

        const result = await ConversationsDao.upsert(id, suggestions.map(suggestion => ({
            createdAt: new Date(),
            text: suggestion,
            visibility: 'public',
        })));

        return NextResponse.json(result);
    }

    return NextResponse.json(data);
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const {id} = params;
    const message = await request.json() as Message;

    const data = await ConversationsDao.upsert(id, message);

    return NextResponse.json(data);
}
