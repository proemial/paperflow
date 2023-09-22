"use client";
import { useChat } from "ai/react";
import { ArXivAtomPaper } from "data/adapters/arxiv/arxiv.models";
import { Model } from "data/adapters/redis/redis-client";
import React from "react";
import { BotForm } from "./bot-form";
import { BotMessages } from "./bot-messages";
import { Spinner } from "src/components/spinner";
import { useConversation } from "src/app/queries/conversations";

type Props = {
  paper: ArXivAtomPaper;
  model: Model;
};

export function InsightsBot({ paper, model }: Props) {
  const { id, title, abstract } = paper.parsed;

  const { data, isLoading } = useConversation(id);

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
      <div>Bot V2</div>
      {isLoading && (
        <div className="mb-4">
          <Spinner />
        </div>
      )}

      {!isLoading && (
        <BotMessages
          messages={messages}
          conversation={data.messages}
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
