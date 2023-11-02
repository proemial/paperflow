import {NextResponse} from "next/server";

export async function arxivByDate(dateStr: string) {
    console.log(`/api/arxivByDate[${dateStr}]`)

    return NextResponse.json({dateStr});
}