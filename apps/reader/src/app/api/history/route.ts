import { UserPaper, ViewHistoryDao } from "data/storage/history";
import { NextResponse } from "next/server";

type Body = UserPaper & {
    action: 'bookmark'
};

export async function POST(request: Request) {
    const {action, user, paper, bookmarked, likes, category} = await request.json() as Body;

    switch(action) {
        case 'bookmark': await ViewHistoryDao.bookmark(user, paper, category, bookmarked);
        break;
    }

    return NextResponse.json({});
  }
