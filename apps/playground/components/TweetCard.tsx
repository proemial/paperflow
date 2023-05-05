"use client";
import { Card, CircularProgress, Link, List, Tooltip } from "@mui/joy";
import Typography from "@mui/joy/Typography";
import * as React from "react";
import { useEffect } from "react";
import { ParsedArxivItem } from "@/app/api/flow/prompt/route";
import { promptInputState } from "@/state/promptInputState";
import { useRecoilValue } from "recoil";
import { WithTextAndUsage } from "@/app/api/openai/route";
import { logError, logMetric, now } from "@/utils/metrics";
import { Md5 } from "ts-md5";
import CardOverflow from "@mui/joy/CardOverflow";
import * as Accordion from "@radix-ui/react-accordion";
import { AccordionContent, AccordionHeader } from "@/components/prompt/JoyAccordion";
import Divider from "@mui/joy/Divider";
import { InfoOutlined } from "@mui/icons-material";
import Box from "@mui/joy/Box";

export function TweetCard({ hash, item }: { hash: string, item: ParsedArxivItem }) {
  const { title, authors, contentSnippet, link } = item;
  const promptInput = useRecoilValue(promptInputState(hash));
  const [result, setResult] = React.useState<WithTextAndUsage>();

  useEffect(() => {
    if (!promptInput || !hash || !item) return;

    setResult(undefined);

    (async () => {
      const promptData: Payload = { ...promptInput, category: promptInput.category.key, hash: hash, text: contentSnippet };
      console.log('item/route promptData', promptData);

      const pHash = Md5.hashStr(JSON.stringify(promptData));
      console.log('item/route hash', pHash);

      const redisOutput = await getFromRedis(pHash);
      if(redisOutput) {
        setResult(redisOutput);
        return;
      }

      const openaiOutput = await getFromOpenAI(pHash, promptData);
      if(openaiOutput) {
        await addToRedis(pHash, openaiOutput);
        setResult(openaiOutput);
      }
    })();
  }, [promptInput, item]);


  return (
    <Card variant="outlined" sx={{ maxWidth: 320 }}>
      <CardOverflow sx={{p:0}}>
        <List
          variant="outlined"
          component={Accordion.Root}
          type="multiple"
          sx={{
            borderRadius: "xs",
            "--ListDivider-gap": "0px",
            "--focus-outline-offset": "-2px",
          }}
        >
          <Accordion.Item value="item-1">
            <AccordionHeader isFirst>
              <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                {`ABSTRACT: ${contentSnippet}`}
              </div>
            </AccordionHeader>
            <AccordionContent>
              {contentSnippet}
            </AccordionContent>
          </Accordion.Item>
        </List>
      </CardOverflow>
      <Typography level="h2" sx={{ fontSize: 'md', mt: 2 }}>
        <Link href={link} target="_blank" color="neutral">{title}</Link>
      </Typography>
      <Typography level="body2" sx={{ mt: 2, mb: 2 }}>
        {!result &&
          <Box sx={{ display: "flex", justifyContent: 'center'}}>
            <CircularProgress variant="solid" />
          </Box>
        }
        {result?.text && result.text}
      </Typography>
      <Divider />
      <CardOverflow
        variant="soft"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 1.5,
          px: 'var(--Card-padding)',
          bgcolor: 'background.level1',
        }}
      >
        <Typography level="body3" sx={{
          fontWeight: 'md',
          color: 'text.secondary',
        }}>
          {authors.join(", ")}
        </Typography>
        {result &&
          <Tooltip title={
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                maxWidth: 320,
                justifyContent: 'center',
                p: 1,
              }}
            >
              <div>Prompt tokens: {result.usage?.prompt_tokens}</div>
              <div>Completion tokens: {result.usage?.completion_tokens}</div>
              <div style={{fontWeight: 'bold'}}>Total tokens: {result.usage?.total_tokens}</div>
            </Box>
          } variant="outlined">
            <InfoOutlined />
          </Tooltip>
        }
      </CardOverflow>
    </Card>
  );
}

type Payload = {
  hash: string,
  text: string,
  category: string,
  model: string,
  temperature: number,
  maxTokens: number,
  prompt: string,
  count: number,
}

async function getFromRedis(hash: string) {
  const url = `/api/redis/model-outputs/${hash}`;
  const key = `GET[${url}]`;
  const begin = now();

  try {
    const redisResult = await fetch(url);
    const redisResultJson: WithTextAndUsage = await redisResult.json();
    console.log('redisResult', redisResultJson);
    return redisResultJson;
  } catch(e) {
    logError(key, begin, e);
    throw e;
  } finally {
    logMetric(key, begin);
  }
}

async function getFromOpenAI(hash: string, promptData: Payload) {
  const url = `/api/openai/`;
  const key = `POST[${url}]`;
  const begin = now();

  try {
    console.log('promptData', promptData);
    const openaiResponse = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(promptData),
    });

    const openaiResponseJson: WithTextAndUsage = await openaiResponse.json();
    console.log('openaiResponse', openaiResponseJson);
    return openaiResponseJson;
  } catch(e) {
    logError(key, begin, e);
    throw e;
  } finally {
    logMetric(key, begin);
  }
}

async function addToRedis(hash: string, openaiOutput: WithTextAndUsage) {
  const url = `/api/redis/model-outputs/${hash}`;
  const key = `PUT[${url}]`;
  const begin = now();

  try {
    await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(openaiOutput),
    });
  } catch(e) {
    logError(key, begin, e);
    throw e;
  } finally {
    logMetric(key, begin);
  }
}