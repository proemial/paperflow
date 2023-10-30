"use client";
import { IngestionIndexEntries } from "@/app/api/v2/ingestion/[[...args]]/route";
import { Chip, Sheet, Stack, styled } from "@mui/joy";
import { ArXivCategory, arXivCategory, arxivCategories } from "data/adapters/arxiv/arxiv.models";
import { PromptOutputCardList } from "./card-list";
import { useState } from "react";

const Item = styled(Sheet)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.background.level1 : '#fff',
  ...theme.typography["body-md"],
  padding: theme.spacing(1),
  textAlign: 'start',
  borderRadius: 4,
  color: theme.vars.palette.text.secondary,
}));

const linkStyle = {background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', fontSize: 'inherit', fontFamily: 'inherit', color: 'inherit'};

export function ProcessedPapers({ index }: { index: IngestionIndexEntries }) {
  const [filter, setFilter] = useState<string>();
  const [novel, setNovel] = useState(true);

  if(!index)
    return <></>;

  const categories = Object.keys(index)
                           .map(key => arXivCategory(key))
                           .sort((a: ArXivCategory, b: ArXivCategory) => {
    if (a.category === b.category) {
       return a.title > b.title ? 1 : -1;
    }
    return a.category > b.category ? 1 : -1;
  });

  const counts = Object.keys(index).map(key => index[key].length);
  const count = (counts?.length ? counts : [0]).reduce((a, b) => a + b);

  const categoryNames = categories.map(cat => cat.category);
  const mainCategories = arxivCategories.filter(cat => cat.category === cat.title).filter(cat => categoryNames.includes(cat.category));

  return (<>
    <div>
      {count} papers in {Object.keys(index).length} categories scraped
      <div>
        [<button
            type="button"
            onClick={() => setNovel(!novel)} style={{...linkStyle, fontWeight: novel ? 'bold' : 'normal'}}>
              Novel only
        </button>]
        {mainCategories.map((cat, i) => <span key={i}>
          [<button
            type="button"
            onClick={() => setFilter(filter === cat.key ? undefined : cat.key)} style={{...linkStyle, fontWeight: cat.key === filter ? 'bold' : 'normal'}}>
              {cat.category}
          </button>]
        </span>)}
      </div>
    </div>
    <Stack spacing={2}>
      {categories.filter(category => !filter || category.key.startsWith(filter)).map((category, i) => (
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
            <PromptOutputCardList ids={index[category.key]} novel={novel} />
          </div>
        </Item>
      ))}
    </Stack>
  </>)
}
