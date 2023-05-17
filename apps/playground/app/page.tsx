"use client";
import * as React from "react";
import Prompt from "@/components/prompt";
import { arxivCategories } from "@/utils/arxivCategories";
import { Md5 } from "ts-md5";
import { useEffect } from "react";
import { promptInputState } from "@/state/promptInputState";
import { useSetRecoilState } from "recoil";
import { ChatCompletionRequestMessageRoleEnum } from "openai";

const defaultValues = {
  category: arxivCategories[0],
  count: 3,
  messages: [
    {
      role: ChatCompletionRequestMessageRoleEnum.Assistant,
      content: "You are a helpful assistant.",
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content: "Analyse the following text $t $a",
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: "Summarise and rephrase it in the style of Marvin the depressed robot",
    }
  ],

};

const defaultHash = Md5.hashStr(JSON.stringify(defaultValues));

export default function HomePage() {
  const setRecoilState = useSetRecoilState(promptInputState(defaultHash));

  useEffect(() => {
    setRecoilState(defaultValues);
  }, []);

  return (
    <Prompt hash={defaultHash} />
  );
}
