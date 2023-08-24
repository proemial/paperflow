import { UsersDao } from "data/storage/users";
import { UserEvent, TemporaryDummyEvent } from "data/storage/users.models";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: { type: 'user' | 'dummy' } }) {
    const {type} = params;
    const event = await request.json() as UserEvent | TemporaryDummyEvent;

    switch (type) {
        case 'user':
            const dbUser = await UsersDao.upsert(event as UserEvent);
            return NextResponse.json(dbUser);
        default:
            throw new Error('Unsupported event type!')
    }
}
