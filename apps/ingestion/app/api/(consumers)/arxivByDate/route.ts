import {arxivByDate, WithDate} from "./worker";

export async function POST(request: Request) {
    const payload = await request.json() as WithDate;
    return await arxivByDate(payload);
}
