"use client";
import { ParsedArxivItem } from "@/app/api/flow/prompt/route";
import { WithTextAndUsage } from "@/app/api/openai/gpt3/route";
import { PromptOutputCard } from "@/components/PromptOutputCard";
import { gptInputState } from "@/state/promptInputState";
import { logError, logMetric, now } from "utils/metrics";
import { ChatCompletionRequestMessageRoleEnum } from "openai";
import * as React from "react";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { Md5 } from "ts-md5";

export function Card({ hash, item }: { hash: string, item: ParsedArxivItem }) {
  const { title, authors, contentSnippet, link } = item;
  const promptInput = useRecoilValue(gptInputState(hash));
  const [result, setResult] = React.useState<WithTextAndUsage>();

  useEffect(() => {
    if (!promptInput || !hash || !item) return;

    setResult(undefined);

    (async () => {
      const promptData: Payload = { ...promptInput, category: promptInput.category.key, hash: hash, contentSnippet, title };
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
  title: string,
  contentSnippet: string,
  category: string,
  count: number,
  messages: Array<{
    role: ChatCompletionRequestMessageRoleEnum,
    content: string,
  }>,
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
  const url = `/api/openai/gpt3/`;
  const key = `POST[${url}]`;
  const begin = now();

  try {
    let tokensFound = false;
    const messages = promptData.messages.map(message => {
      if (message.content.includes('$t') || message.content.includes('$a')) {
        tokensFound = true;
        return {
          ...message,
          content: message.content
            .replace('$t', `${promptData.title}`)
            .replace('$a', `${promptData.contentSnippet}`),
        };
      }
      return message;
    });
    if (!tokensFound) {
      const lastMessage = messages[messages.length - 1];
      messages[messages.length - 1] = {
        ...lastMessage,
        content: lastMessage.content + ` ${promptData.title} ${promptData.contentSnippet}`,
      };
    }
    const promptDataWithArxivData = {
      messages,
    };
    console.log('item/route promptDataWithArxivData', promptDataWithArxivData);

    const openaiResponse = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(promptDataWithArxivData),
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