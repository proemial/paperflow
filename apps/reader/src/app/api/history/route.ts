import { UserPaper, ViewHistoryDao } from "data/storage/history";
import { NextResponse } from "next/server";

type Body = UserPaper & {
    action: 'bookmark' | 'like'
};

export async function POST(request: Request) {
    const {action, user, paper, bookmarked, likes} = await request.json() as Body;

    switch(action) {
        case 'bookmark': await ViewHistoryDao.bookmark(user, paper, bookmarked);
        break;
        case 'like': await ViewHistoryDao.like(user, paper, likes);
        break;
    }

    return NextResponse.json({});
  }
