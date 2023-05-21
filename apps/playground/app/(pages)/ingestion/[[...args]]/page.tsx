"use client";
import { AccordionContent, AccordionHeader } from "@/components/JoyAccordion";
import { PromptOutputCard } from "@/components/PromptOutputCard";
import { DateRange } from "@mui/icons-material";
import { Chip, CircularProgress, List, Sheet, Stack, styled } from "@mui/joy";
import * as Accordion from "@radix-ui/react-accordion";
import { ArxivPaper, arxivCategories } from "data/adapters/arxiv/arxiv.models";
import { IngestionState } from "data/db/ingestion-dao";
import { RevisionedPaper } from "data/db/paper-dao";
import { addDays, subDays } from "date-fns";
import dayjs from 'dayjs';
import { useRouter } from "next/navigation";
import * as React from "react";
// @ts-ignore
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  const [date, setDate] = React.useState<string>();
  const [data, setData] = React.useState<FetchResult>();
  const [cats, setCats] = React.useState<Categorised>({});

  React.useEffect(() => {
    if (params.args) {
      setDate(dayjs().format(params.args[0]));
      return;
    }

    (async () => {
      const res = await fetch(`/api/db/ingestion/get-latest/x`);
      const json: IngestionState = await res.json();
      setDate(json.date);
    })();
  }, [params.args]);

  React.useEffect(() => {
    if (!date) return;

    (async () => {
      const res = await fetch(`/api/db/papers/get-by-date/${date}`);
      const json: FetchResult = await res.json();
      setData(json);
    })();
  }, [date]);

  React.useEffect(() => {
    if (!data?.ingestion) return;

    console.log('data', data);


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
  // TODO: Fetch ingestion dates and use conditional formatting to render them in the date picker

  return (
    <div style={{
      width: '100%',
    }}>
      <div>
        {date &&
          <h1 style={{ display: 'flex', gap: 16, marginBottom: 0 }}>
            {date}
            <IngestionDatePicker
              date={date}
              allDates={[
                '2023-05-11',
                '2023-05-12',
                '2023-05-16',
                '2023-05-17',
                '2023-05-18',
                '2023-05-19',
                '2023-05-20',
                '2023-05-21',
              ]}
            />
          </h1>
        }
        {!data &&
          <CircularProgress variant="solid" />
        }
        <Content data={data} cats={cats} />
      </div>
    </div>
  );
}

function Content({ data, cats }: { data?: FetchResult, cats: Categorised }) {
  return (<>
    {data?.ingestion && <>
      <div>({data.papers.length} papers in {Object.keys(cats).length} categories ingested)</div>
      <ProcessedPapers cats={cats} />
      <UnprocessedPapers cats={cats} />
    </>}
  </>);
}

function IngestionDatePicker({ date, allDates }: { date?: string, allDates?: string[] }) {
  const router = useRouter();
  const highlightDates = allDates?.map(d => dayjs(d, "YYYY-MM-DD").toDate());

  const ExampleCustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <button className="example-custom-input" onClick={onClick} ref={ref}>
      <DateRange />
    </button>
  ));
  ExampleCustomInput.displayName = "ExampleCustomInput";

  const handleCustomInputClick = (dateSelected: Date) => {
    router.push(`/ingestion/${dayjs(dateSelected).format("YYYY-MM-DD")}`);
  };


  return (
    <div style={{ width: 40 }}>
      <DatePicker
        selected={dayjs(date, "YYYY-MM-DD").toDate()}
        onChange={handleCustomInputClick}
        highlightDates={highlightDates}
        placeholderText="This highlights a week ago and a week from today"
        customInput={<ExampleCustomInput />}
      />
    </div>
  );
}

function ProcessedPapers({ cats }: { cats: Categorised }) {
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

function UnprocessedPapers({ cats }: { cats: Categorised }) {
  return (<>
    {cats &&
      <List
        component={Accordion.Root}
        type="multiple"
        sx={{ "--ListDivider-gap": "0px", border: '1px solid lightgrey', borderRadius: 8, marginLeft: 1, marginRight: 1, marginTop: 2, marginBottom: 2 }}
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
