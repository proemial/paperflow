"use client";
import * as React from "react";
import dayjs from 'dayjs';
import { IngestionState } from "data/db/ingestion-dao";
import { RevisionedPaper } from "data/db/paper-dao";
import { ArxivPaper, arxivCategories } from "data/adapters/arxiv/arxiv.models";
import { Card, List, Sheet, Stack, styled } from "@mui/joy";
import * as Accordion from "@radix-ui/react-accordion";
import { AccordionContent, AccordionHeader } from "@/components/JoyAccordion";
import { PromptOutputCard } from "@/components/PromptOutputCard";

type FetchResult = {
  ingestion: IngestionState,
  papers: RevisionedPaper[],
}

type Categorised = {
  [key: string]: {
    processed: ArxivPaper[],
    unprocessed: ArxivPaper[],
  };
}

export default function IngestionPage({ params }: { params: { args: string[] } }) {
  const date = params.args
    ? dayjs().format(params.args[0])
    : dayjs().format("YYYY-MM-DD");

  const [data, setData] = React.useState<FetchResult>();
  const [cats, setCats] = React.useState<Categorised>({});

  React.useEffect(() => {
    if (!date) return;

    (async () => {
      const res = await fetch(`/api/db/papers/get-by-date/${date}`);
      const json: FetchResult = await res.json();
      setData(json);
    })();
  }, [date]);

  React.useEffect(() => {
    if (!data) return;

    (async () => {
      const categories: Categorised = {};

      data.papers.forEach(paper => {
        const cat = paper.revisions[0].parsed.category;
        if (!Object.keys(categories).includes(cat)) {
          categories[cat] = {
            processed: [],
            unprocessed: [],
          };
        }

        if (paper.status === 'summarised') {
          categories[cat].processed.push(paper.revisions[0]);
        } else {
          categories[cat].unprocessed.push(paper.revisions[0]);
        }
      });

      setCats(categories);
    })();
  }, [data]);

  console.log('cats', cats);


  return (
    <Content data={data} cats={cats} />
  );
}

function Content({ data, cats }: { data?: FetchResult, cats: Categorised }) {
  return (
    <div style={{
      width: '100%',
    }}>
      {data &&
        <div>
          <h1 style={{ marginBottom: 0 }}>{data.ingestion.date}</h1>
          <div>({data.papers.length} papers, {Object.keys(cats).length} categories)</div>
          <ProcessedPapers cats={cats} />
          <UnprocessedPapers cats={cats} />
        </div>
      }
    </div>
  );
}

function ProcessedPapers({ cats }: { cats: Categorised }) {
  return (<>
    <Stack spacing={2}>
      {Object.keys(cats).filter((catKey) => cats[catKey].processed.length > 0).sort().map((catKey, i) => (
        <Item key={i}>
          <h2 style={{ padding: 8, marginBottom: 8, textDecoration: 'underline', marginTop: 0 }}>
            {arxivCategories.find(c => c.key === catKey)?.title}
          </h2>
          <div style={{ display: 'flex', gap: 8, overflow: 'scroll' }}>
            {cats[catKey].processed.map((paper, i) => (
              <div>
                <PromptOutputCard key={i}
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

function UnprocessedPapers({ cats }: { cats: Categorised }) {
  return (<>
    {cats &&
      <List
        component={Accordion.Root}
        type="multiple"
        sx={{ "--ListDivider-gap": "0px" }}
      >
        <Accordion.Item value="item-1">
          <AccordionHeader isFirst>
            Unprocessed papers
          </AccordionHeader>
          <AccordionContent>
            {Object.keys(cats).filter(catKey => cats[catKey].processed.length === 0).sort().map(catKey => (
              <div key={catKey}>
                <b>{catKey}:</b> {cats[catKey].unprocessed.map(paper => paper.parsed.id).join(', ')}
              </div>
            ))}
          </AccordionContent>
        </Accordion.Item>
      </List>
    }
  </>)
}


const Item = styled(Sheet)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.background.level1 : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'start',
  borderRadius: 4,
  color: theme.vars.palette.text.secondary,
}));
