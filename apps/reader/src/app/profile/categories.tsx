"use client";
import * as React from "react";
import { setCookie, getCookie } from "cookies-next";

const categories = [
  { key: "cs", label: "Computer Science" },
  { key: "econ", label: "Economics" },
  { key: "eess", label: "Electrical Engineering and Systems Science" },
  { key: "math", label: "Mathematics" },

  { key: "physics", label: "Physics" },
  // astro: Astrophysics
  // cond-mat: Condensed Matter
  // hep: High Energy Physics
  // gr-qc: General Relativity and Quantum Cosmology
  // nlin: Nonlinear Sciences
  // nucl: Nuclear Physics
  // quant: Quantum Physics

  { key: "q-bio", label: "Quantitative Biology" },
  { key: "q-fin", label: "Quantitative Finance" },
  { key: "stat", label: "Statistics" },
];

export type UserSettings = {
  [key: string]: boolean;
};

export function CategoryToggles() {
  const settings = getCookie("settings") as string | undefined;
  const [state, setState] = React.useState<UserSettings>(
    settings ? JSON.parse(settings) : {}
  );

  const handleChange = (key: string) => {
    const newState = { ...state, [key]: !state[key] };
    setState(newState);
    setCookie("settings", JSON.stringify(newState));
  };

  return (
    <div className="pl-2">
      {categories.map((cat) => (
        <div key={cat.key}>
          <input
            id={cat.key}
            type="checkbox"
            className="mr-1"
            checked={!!state[cat.key]}
            onChange={() => handleChange(cat.key)}
          />
          <label htmlFor={cat.key}>{cat.label}</label>
        </div>
      ))}
    </div>
  );
}
