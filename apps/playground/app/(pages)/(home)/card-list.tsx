import { ArXivAtomPaper } from "@/../../packages/data/adapters/arxiv/arxiv.models";
import { PromptOutputCard } from "@/components/PromptOutputCard";
import { CircularProgress } from "@mui/joy";
import React from "react";

export function PromptOutputCardList({ids}: {ids: string[]}) {
    const papers = usePapers(ids)
    return (
        <>
            {!papers &&
              <CircularProgress variant="solid" />
            }
            {ids.map((id, i) => (
              <div key={i}>
                {papers[id] &&
                    <PromptOutputCard
                        arxivOutput={{ ...papers[id].parsed, contentSnippet: papers[id].parsed.abstract, link: papers[id].parsed.link.source }}
                        modelOutputString={papers[id].summary}
                  />
                }
              </div>
            ))}
        </>
    )
}

function usePapers(ids: string[]) {
    const [ingestionIndex, setIngestionIndex] = React.useState<{[key: string]: ArXivAtomPaper}>({});

    React.useEffect(() => {
      (async () => {
        const res = await fetch('/api/v2/papers', {
            method: 'POST',
            body: JSON.stringify(ids),
          });
        const json = await res.json();

        setIngestionIndex(json);
      })();
    }, [ids]);

    return ingestionIndex;
  }
