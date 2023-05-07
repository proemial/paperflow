import dayjs from "dayjs";
import { NextResponse } from "next/server";
import { yesterday } from "./.utils";
import { fetchUpdatedIds, fetchUpdatedItems } from "./.queries";

export async function GET(request: Request) {
  const limit = yesterday();

  const ids = await fetchUpdatedIds(dayjs().format("YYYY-MM-DD")); // ~1200 id's
  const output = await fetchUpdatedItems(ids, limit);
  console.log('output', output);


  return NextResponse.json(output); // ~ 1000 items
}
