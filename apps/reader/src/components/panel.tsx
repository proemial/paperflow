"use client";

import { useState } from "react";

type Props = {
  title: string;
  children: React.ReactNode | string;
  closed?: boolean;
};

export function Panel({ title, children, closed }: Props) {
  const [isClosed, setClosed] = useState(!!closed);

  return (
    <div>
      <div className="flex justify-between">
        <div className="text-xl font-medium">{title}</div>
        <Toggle toggle={() => setClosed(!isClosed)} closed={isClosed} />
      </div>
      <div className={`${isClosed ? "hidden" : ""}`}>{children}</div>
    </div>
  );
}

function Toggle({ closed, toggle }: { closed: boolean; toggle: () => void }) {
  return (
    <button
      type="button"
      onClick={() => toggle()}
      className="text-md font-normal text-primary"
    >
      {closed ? "Show" : "Hide"}
    </button>
  );
}
