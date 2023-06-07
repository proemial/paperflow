"use client";
import { PromptOutputCard } from "@/components/PromptOutputCard";
import { Chip, Sheet, Stack, styled } from "@mui/joy";
import { arxivCategories } from "data/adapters/arxiv/arxiv.models";
import { Categorised } from "./main";

const Item = styled(Sheet)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.background.level1 : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'start',
  borderRadius: 4,
  color: theme.vars.palette.text.secondary,
}));

export function ProcessedPapers({ cats }: { cats: Categorised }) {
  return (<>
    <Stack spacing={2}>
      {Object.keys(cats).filter((catKey) => cats[catKey].processed.length > 0).sort().map((catKey, i) => (
        <Item key={i}>
          <h2 style={{ padding: 8, marginBottom: 8, marginTop: 0 }}>
            <Chip variant="soft">
              {arxivCategories.find(c => c.key === catKey)?.category}
            </Chip>
            <span style={{ marginLeft: 6 }}>
              {arxivCategories.find(c => c.key === catKey)?.title}
            </span>
          </h2>
          <div style={{ display: 'flex', gap: 8, overflow: 'scroll' }}>
            {cats[catKey].processed.map((paper, i) => (
              <div key={i}>
                <PromptOutputCard
                  arxivOutput={{ ...paper.parsed, contentSnippet: paper.parsed.abstract, link: paper.parsed.link.source }}
                  modelOutputString={paper.summary}
                />
              </div>
            ))}
          </div>
        </Item>
      ))}
    </Stack>
  </>)
}
