import { UsersDao } from "data/storage/users";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const {id} = params;
    const dbUser = await UsersDao.get(id);

    return NextResponse.json(dbUser);
}
