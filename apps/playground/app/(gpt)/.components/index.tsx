"use client";
import * as React from "react";
import { PromptForm } from "./PromptForm";
import PromptOutput from "./PromptOutput";
import { GptInput, gptInputState } from "@/state/promptInputState";
import { useRecoilState } from "recoil";
import Box from "@mui/joy/Box";

export default function Prompt({ hash }: { hash: string }) {
  const [input, setInput] = useRecoilState(gptInputState(hash));
  const [disabled, setDisabled] = React.useState(true);

  const handleSubmit = (input: GptInput) => {
    setDisabled(true);
    setInput(input);
  };

  return (
    <Box sx={{ p: 2 }}>
      {input && <>
        <PromptForm initialValues={input} onSubmit={handleSubmit} disabled={disabled} />
        <PromptOutput hash={hash} input={input} callback={setDisabled} />
      </>}
    </Box>);
}
