import { UsersDao } from "data/storage/users";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const ids = await request.json() as string[];
    const dbUsers = await UsersDao.getByIds(ids);

    return NextResponse.json(dbUsers);
}
