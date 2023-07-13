import dayjs from "dayjs";
import Markdown from "@/src/components/markdown";
import {
  ArXivAtomPaper,
  arXivCategory,
} from "data/adapters/arxiv/arxiv.models";
import avatar from "src/images/avatar.svg";
import Image from "next/image";
import { Panel } from "src/components/panel";

export function MetadataPanel({ paper }: { paper: ArXivAtomPaper }) {
  const category = arXivCategory(paper.parsed.category);

  return (
    <Panel title="Article Metadata" closed>
      <div>
        <div>
          <div className="text-purple-500">
            Preprint published on ArXiv,{" "}
            {dayjs(paper.parsed.published).format("MMM DD, YYYY")}
          </div>
          <div className="font-light text-xs leading-tight mb-2">
            @{category.category} - {category.title}
          </div>
        </div>
        <Markdown>{paper.parsed.title}</Markdown>
      </div>
      <div className="text-purple-500 mt-2">Authors</div>
      <div className="flex py-2 gap-10 flex-nowrap overflow-scroll no-scrollbar">
        {paper.parsed.authors.map((author, index) => (
          <Author key={index} name={author} />
        ))}
      </div>
    </Panel>
  );
}

function Author({ name }: { name: string }) {
  const names = name.split(" ");
  return (
    <div className="whitespace-nowrap flex gap-1">
      {/* @ts-ignore */}
      <Image src={avatar} alt="" />
      {names.at(-1)}
    </div>
  );
}
