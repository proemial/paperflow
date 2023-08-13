"use client";
import { useMutation } from "@tanstack/react-query";
import { useChat } from "ai/react";
import { ArXivAtomPaper } from "data/adapters/arxiv/arxiv.models";
import { Model } from "data/adapters/redis/redis-client";
import React, { useEffect, useState } from "react";
import { BotForm } from "./form";
import { BotMessages } from "./messages";
import { generateSuggestions } from "src/query/suggestions";
import { Spinner } from "src/components/spinner";

type Props = {
  paper: ArXivAtomPaper;
  model: Model;
};

export function InsightsBot({ paper, model }: Props) {
  const { id, title, abstract } = paper.parsed;
  const [suggestions, setSuggestions] = useState<string[]>();

  const { mutate, isLoading } = useMutation(generateSuggestions);

  useEffect(() => {
    mutate(
      { id, title, abstract },
      {
        onSuccess: async (response) => {
          setSuggestions(response);
        },
      }
    );
  }, [title, abstract, mutate]);

  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
    body: { title, abstract, model },
    api: "/api/bot/chat",
  });

  const inputFieldRef = React.useRef<HTMLInputElement>();
  React.useEffect(() => {
    if (messages?.length > 0 && inputFieldRef.current) {
      inputFieldRef.current.scrollIntoView(false);
    }
  }, [messages]);

  return (
    <div className="pt-4 flex flex-col justify-start">
      {!suggestions && (
        <div className="mb-4">
          <Spinner />
        </div>
      )}

      {suggestions && (
        <BotMessages
          messages={messages}
          suggestions={suggestions}
          append={append}
        />
      )}

      <BotForm
        value={input}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        inputFieldRef={inputFieldRef}
      />
    </div>
  );
}
