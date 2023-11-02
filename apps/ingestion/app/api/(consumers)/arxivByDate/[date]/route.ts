import {NextResponse} from "next/server";

export type WithDate = {
    date: string
};

export async function GET(request: Request, { params }: { params: WithDate }) {
    return await run(params);
}

export async function run({date}: WithDate) {
    console.log(`/api/arxivByDate[${date}]`)

    return NextResponse.json({date});
}