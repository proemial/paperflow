"use client";

import { useState } from "react";
import { Analytics } from "./analytics";

type Props = {
  title: string;
  children: React.ReactNode | string;
  closed?: boolean;
  className?: string;
};

export function Panel({ title, children, closed, className }: Props) {
  const [isClosed, setClosed] = useState(!!closed);

  const handleClick = () => {
    const prefix = isClosed ? "show" : "hide";
    Analytics.track(
      `click:panel-${prefix}-${title.split(" ").at(-1).toLowerCase()}`
    );
    setClosed(!isClosed);
  };

  return (
    <div>
      <div
        className={`${className} flex justify-between`}
        onClick={handleClick}
      >
        <div className={`text-xl font-medium`}>{title}</div>
        <ToggleButton closed={isClosed} />
      </div>
      <div className={`${isClosed ? "hidden" : ""}`}>{children}</div>
    </div>
  );
}

function ToggleButton({ closed }: { closed: boolean }) {
  return (
    <button type="button" className="text-md font-normal text-primary">
      {closed ? "Show" : "Hide"}
    </button>
  );
}
