import { ConversationsDao, Message, Conversation } from "data/storage/conversations";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const {id} = params;
    const user = request.headers.get('X-User');

    const data = await ConversationsDao.get(id, user);

    return NextResponse.json(data);
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const {id} = params;
    const message = await request.json() as Message;

    const data = await ConversationsDao.upsertMessage(id, message);

    return NextResponse.json(data);
}
