"use client";
import * as React from "react";
import Prompt from "@/components/prompt";
import { arxivCategories } from "@/utils/arxivCategories";
import { Md5 } from "ts-md5";
import { useEffect } from "react";
import { promptInputState } from "@/state/promptInputState";
import { useSetRecoilState } from "recoil";

const defaultValues = {
  category: arxivCategories[0],
  count: 3,

  model: "gpt-3.5-turbo",
  temperature: 0.6,
  maxTokens: 100,
  role: 'You are a helpful assistant.',
  prompt: "Write an extremely short summary of the following text in the style of an engaging tweet for kids",
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
