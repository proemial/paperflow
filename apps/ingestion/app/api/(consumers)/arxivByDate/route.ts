import {run, WithDate} from "@/app/api/(consumers)/arxivByDate/[date]/route";

export async function POST(request: Request) {
    const payload = await request.json() as WithDate;
    return await run(payload);
}
