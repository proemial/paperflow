"use client";
import * as React from "react";
import Prompt from "./.components";
import { arxivCategories } from "data/adapters/arxiv/arxiv.models";
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
      content: "You are a helpful assistant who can explain scientific concepts in terms that allow researchers from one scientific domain to grasp and be inspired by ideas from another domain.",
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content: "Analyse the following scientific article with title: $t and abstract: $a",
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: "Write a captivating summary in 20 words or less of the most significant finding for an engaging tweet that will capture the minds of other researchers, using layman's terminology, and without mentioning abstract entities like \"you\", \"researchers\", \"authors\", \"propose\", or \"study\" but rather stating the finding as a statement of fact. Make sure to use 20 words or less and add three appropriate hashtags at the end to increase exposure of the tweet",
    }
  ],

};

const defaultHash = Md5.hashStr(JSON.stringify(defaultValues));

export default function HomePage() {
  const setRecoilState = useSetRecoilState(gptInputState(defaultHash));

  useEffect(() => {
    setRecoilState(defaultValues);
  }, [setRecoilState]);

  return (
    <Prompt hash={defaultHash} />
  );
}
