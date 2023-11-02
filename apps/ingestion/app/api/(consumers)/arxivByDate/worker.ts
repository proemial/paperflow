import {NextResponse} from "next/server";

export type WithDate = {
    date: string
};

export async function arxivByDate({date}: WithDate) {
    console.log(`/api/arxivByDate[${date}]`)

    return NextResponse.json({date});
}