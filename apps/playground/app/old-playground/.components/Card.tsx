"use client";
import { ParsedArxivItem } from "@/app/api/flow/prompt/route";
import { WithTextAndUsage } from "@/app/api/openai/gpt3/route";
import { PromptOutputCard } from "@/components/PromptOutputCard";
import { davinciInputState } from "@/state/promptInputState";
import { logError, logMetric, now } from "@/utils/metrics";
import * as React from "react";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { Md5 } from "ts-md5";

export function Card({ hash, item }: { hash: string, item: ParsedArxivItem }) {
  const { title, contentSnippet } = item;
  const promptInput = useRecoilValue(davinciInputState(hash));
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
      if (redisOutput) {
        setResult(redisOutput);
        return;
      }

      const openaiOutput = await getFromOpenAI(pHash, promptData);
      if (openaiOutput) {
        await addToRedis(pHash, openaiOutput);
        setResult(openaiOutput);
      }
    })();
  }, [promptInput, item]);


  return (
    <PromptOutputCard modelOutput={result} arxivOutput={item} />
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
  } catch (e) {
    logError(key, begin, e);
    throw e;
  } finally {
    logMetric(key, begin);
  }
}

async function getFromOpenAI(hash: string, promptData: Payload) {
  const url = `/api/openai/old`;
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
  } catch (e) {
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
  } catch (e) {
    logError(key, begin, e);
    throw e;
  } finally {
    logMetric(key, begin);
  }
}