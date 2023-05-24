"use client";
import { CircularProgress } from "@mui/joy";
import { ArxivPaper } from "data/adapters/arxiv/arxiv.models";
import { IngestionState } from "data/db/ingestion-dao";
import { RevisionedPaper, WithId } from "data/db/paper-dao";
import dayjs from 'dayjs';
import * as React from "react";
import { IngestionDatePicker } from "./date-picker";
import { ProcessedPapers } from "./processed-papers";
import { UnprocessedPapers } from "./unprocessed-papers";

type FetchResult = {
  ingestion: IngestionState,
  papers: RevisionedPaper[],
}

export type Categorised = {
  [key: string]: {
    processed: ArxivPaper[],
    unprocessed: ArxivPaper[],
  };
}
// dummy
export default function IngestionPage({ params }: { params: { args: string[] } }) {
  const latestIngestionDate = useLatestIngestionDate(params.args && params.args[0]);
  const ingestionData = useIngestionData(latestIngestionDate);
  const categories = useCategories(ingestionData);
  const ingestionCandidateCount = useIngestionCandidateCount(latestIngestionDate);

  return (
    <div style={{
      width: '100%',
    }}>
      <div>
        {latestIngestionDate &&
          <h1 style={{ display: 'flex', gap: 16, marginBottom: 0 }}>
            {latestIngestionDate}
            <IngestionDatePicker date={latestIngestionDate} />
          </h1>
        }
        {!ingestionData &&
          <CircularProgress variant="solid" />
        }
        <Content data={ingestionData} cats={categories} count={ingestionCandidateCount} />
      </div>
    </div>
  );
}

function Content({ data, cats, count }: { data?: FetchResult, cats: Categorised, count: number }) {
  const summarisedCount = data?.papers?.filter(p => p.status === 'summarised').length;

  return (<>
    {data?.ingestion && <>
      <div>
        {data.papers?.length} papers in {Object.keys(cats).length} categories scraped, {summarisedCount}/{count} papers summarised
      </div>
      <ProcessedPapers cats={cats} />
      <UnprocessedPapers cats={cats} />
    </>}
  </>);
}

function useLatestIngestionDate(inputDate: string) {
  const [date, setDate] = React.useState<string>();

  React.useEffect(() => {
    if (inputDate) {
      setDate(dayjs().format(inputDate));
      return;
    }

    (async () => {
      const res = await fetch(`/api/db/ingestion/get-latest/x`);
      const json: IngestionState = await res.json();
      setDate(json.date);
    })();
  }, [inputDate]);

  return date;
}

function useIngestionData(date?: string) {
  const [data, setData] = React.useState<FetchResult>();

  React.useEffect(() => {
    (async () => {
      const res = await fetch(`/api/db/papers/get-by-date/${date}`);
      const json: FetchResult = await res.json();
      setData(json);
    })();
  }, [date]);

  return data;
}

function useCategories(data?: FetchResult) {
  const [categories, setCategories] = React.useState<Categorised>({});

  React.useEffect(() => {
    if (!data?.ingestion) return;

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

      setCategories(categories);
    })();
  }, [data]);

  return categories;
}

function useIngestionCandidateCount(date?: string) {
  const [data, setData] = React.useState<Array<WithId>>([]);

  React.useEffect(() => {
    (async () => {
      const res = await fetch(`/api/db/papers/get-by-ids-filtered/${date}`);
      const json: Array<WithId> = await res.json();
      setData(json);
    })();
  }, [date]);

  return data.length;
}
