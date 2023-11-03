import {arxivByDate} from "./worker";

export async function POST(request: Request) {
    console.log(`POST /api/arxivByDate`)
    const payload = await request.text();
    return await arxivByDate(payload);
}
