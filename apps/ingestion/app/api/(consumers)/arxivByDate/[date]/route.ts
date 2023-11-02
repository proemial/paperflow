import {arxivByDate, WithDate} from "../worker";

export async function GET(request: Request, { params }: { params: WithDate }) {
    return await arxivByDate(params);
}
