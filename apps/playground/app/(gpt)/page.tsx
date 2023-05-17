"use client";
import * as React from "react";
import Prompt from "./.components";
import { arxivCategories } from "@/utils/arxivCategories";
import { Md5 } from "ts-md5";
import { useEffect } from "react";
import { gptInputState } from "@/state/promptInputState";
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
      content: "Summarise and rephrase it as an engaging one-line pitch, in the style of a tech influencer",
    }
  ],

};

const defaultHash = Md5.hashStr(JSON.stringify(defaultValues));

export default function HomePage() {
  const setRecoilState = useSetRecoilState(gptInputState(defaultHash));

  useEffect(() => {
    setRecoilState(defaultValues);
  }, []);

  return (
    <Prompt hash={defaultHash} />
  );
}
