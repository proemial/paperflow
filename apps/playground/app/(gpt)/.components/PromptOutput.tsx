"use client";
import { CircularProgress, Grid } from "@mui/joy";
import { Card } from "./Card";
import * as React from "react";
import { useEffect } from "react";
import { ParsedArxivItem } from "@/app/api/flow/prompt/route";
import Box from "@mui/joy/Box";
import { GptInput } from "@/state/promptInputState";

type Props = {
  hash: string,
  input: GptInput,
  callback: (running: boolean) => void
}

export default function PromptOutput({ hash, input, callback }: Props) {
  const arxivItems = useArxiv(input);

  useEffect(() => {
    if (arxivItems)
      callback(false);
  }, [arxivItems]);

  if (!arxivItems) {
    return (
      <Box sx={{ height: '100%', pt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress variant="solid" />
      </Box>
    )
  }

  return (
    <Grid
      container
      spacing={2}
      alignItems="stretch"
      columns={{ sm: 1, md: 2, lg: 3 }}
      sx={{ mt: 2, width: "100%" }}
    >
      {arxivItems?.map((item, index) => (
        <Grid key={index}>
          <Card hash={hash} item={item} />
        </Grid>
      ))}
    </Grid>
  );
}

function useArxiv(input: GptInput) {
  const [arxivItems, setArxivItems] = React.useState<Array<ParsedArxivItem>>();

  useEffect(() => {
    (async () => {
      setArxivItems(undefined);
      const items = await fetchRss(input);
      console.log('items', items);

      setArxivItems(items);
    })();
  }, [input]);

  return arxivItems;
}

async function fetchRss(input: GptInput) {
  const url = '/api/flow/prompt';
  console.log(`PUT[${url}]...`);
  return await fetch(url, {
    method: 'PUT',
    body: JSON.stringify({ ...input, category: input.category.key }),
  }).then((res) => res.json() as Promise<Array<ParsedArxivItem>>)
}
