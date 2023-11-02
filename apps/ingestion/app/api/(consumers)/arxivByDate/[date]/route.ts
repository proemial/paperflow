import {arxivByDate} from "../worker";

export async function GET(request: Request, { params }: { params: { date: string } }) {
    return await arxivByDate(params.date);
}
