"use client";

import Main from "../../main";

export default function IngestionPage({ params }: { params: { args: string[] } }) {
  return (
    <Main args={params.args && params.args[0]} />
  );
}
