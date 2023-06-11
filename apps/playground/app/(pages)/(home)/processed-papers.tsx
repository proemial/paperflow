"use client";
import { IngestionIndexEntries } from "@/app/api/v2/ingestion/[[...args]]/route";
import { Chip, Sheet, Stack, styled } from "@mui/joy";
import { ArXivCategory, arXivCategory } from "data/adapters/arxiv/arxiv.models";
import { PromptOutputCardList } from "./card-list";

const Item = styled(Sheet)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.background.level1 : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'start',
  borderRadius: 4,
  color: theme.vars.palette.text.secondary,
}));

export function ProcessedPapers({ index }: { index: IngestionIndexEntries }) {
  if(!index)
    return <></>;

  const categories = Object.keys(index).map(key => arXivCategory(key)).sort((a: ArXivCategory, b: ArXivCategory) => {
    if (a.category === b.category) {
       return a.title > b.title ? 1 : -1;
    }
    return a.category > b.category ? 1 : -1;
  });

  const counts = Object.keys(index).map(key => index[key].length);
  const count = (counts?.length ? counts : [0]).reduce((a, b) => a + b);

  return (<>
    <div>
      {count} papers in {Object.keys(index).length} categories scraped
    </div>
    <Stack spacing={2}>
      {categories.map((category, i) => (
        <Item key={i}>
          <h2 style={{ padding: 8, marginBottom: 8, marginTop: 0 }}>
            <Chip variant="soft">
              {category.category}
            </Chip>
            <span style={{ marginLeft: 6 }}>
              {category.title}
            </span>
          </h2>
          <div style={{ display: 'flex', gap: 8, overflow: 'scroll' }}>
            <PromptOutputCardList ids={index[category.key]} />
          </div>
        </Item>
      ))}
    </Stack>
  </>)
}
