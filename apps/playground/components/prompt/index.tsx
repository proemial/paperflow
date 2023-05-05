"use client";
import * as React from "react";
import { PromptForm, PromptInput } from "@/components/prompt/PromptForm";
import PromptOutput from "@/components/prompt/PromptOutput";
import { promptInputState } from "@/state/promptInputState";
import { useRecoilState } from "recoil";
import Box from "@mui/joy/Box";

export default function Prompt({ hash }: { hash: string }) {
  const [input, setInput] = useRecoilState(promptInputState(hash));
  const [disabled, setDisabled] = React.useState(true);

  const handleSubmit = (input: PromptInput) => {
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
