"use client";
import * as React from "react";
import Prompt from "./.components";
import { arxivCategories } from "@/utils/arxivCategories";
import { Md5 } from "ts-md5";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { davinciInputState } from "@/state/promptInputState";

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
  const setRecoilState = useSetRecoilState(davinciInputState(defaultHash));

  useEffect(() => {
    setRecoilState(defaultValues);
  }, []);

  return (
    <Prompt hash={defaultHash} />
  );
}
