"use client";

import {
  CodeIcon,
  CubeIcon,
  LightningBoltIcon,
  MoonIcon,
  RulerSquareIcon,
} from "@radix-ui/react-icons";
import { Button } from "./shadcn-ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./shadcn-ui/Tooltip";
import { GlobeIcon, TableIcon } from "lucide-react";

// cs: Computer Science
// econ: Economics
// eess: Electrical Engineering and Systems Science
// math: Mathematics

// physics: Physics
// astro: Astrophysics
// cond-mat: Condensed Matter
// hep: High Energy Physics
// gr-qc: General Relativity and Quantum Cosmology
// nlin: Nonlinear Sciences
// nucl: Nuclear Physics
// quant: Quantum Physics

// q-bio: Quantitative Biology
// q-fin: Quantitative Finance
// stat: Statistics

export function MenuItems() {
  const writeCookie = (value: string) => {
    document.cookie = `category=${value}`;
    window.location.href = `${window.location.protocol}//${window.location.host}?category=${value}`;
  };

  return (
    <div className="flex p-2 h-full items-begin md:flex-col gap-1">
      <Category name="All categories" onClick={() => writeCookie("*")}>
        <>*</>
      </Category>

      <Category name="Computer Science" onClick={() => writeCookie("cs")}>
        <CodeIcon width={20} height={20} />
      </Category>

      <Category name="Economics" onClick={() => writeCookie("econ")}>
        <>$</>
      </Category>

      <Category
        name="Electrical Engineering and Systems Science"
        onClick={() => writeCookie("eess")}
      >
        <LightningBoltIcon width={20} height={20} />
      </Category>

      <Category name="Mathematics" onClick={() => writeCookie("math")}>
        <RulerSquareIcon width={20} height={20} />
      </Category>

      <Category name="Physics" onClick={() => writeCookie("physics")}>
        <CubeIcon width={20} height={20} />
      </Category>

      <Category
        name="Quantitative Biology"
        onClick={() => writeCookie("q-bio")}
      >
        <MoonIcon width={20} height={20} />
      </Category>

      <Category
        name="Quantitative Finance"
        onClick={() => writeCookie("q-fin")}
      >
        <GlobeIcon width={20} height={20} />
      </Category>

      <Category name="Statistics" onClick={() => writeCookie("stat")}>
        <TableIcon width={20} height={20} />
      </Category>
    </div>
  );
}

type Props = {
  name: string;
  onClick: () => void;
  children: React.ReactNode;
};

function Category({ name, onClick, children }: Props) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            onClick={onClick}
            style={{ width: 40, padding: 0 }}
            alt="Tada"
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
