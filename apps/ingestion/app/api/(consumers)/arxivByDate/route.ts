import {arxivByDate} from "./worker";

export async function POST(request: Request) {
    const payload = await request.text();
    return await arxivByDate(payload);
}
