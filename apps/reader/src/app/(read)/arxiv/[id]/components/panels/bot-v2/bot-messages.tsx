import { Message as AiMessage, CreateMessage } from "ai";
import { Analytics } from "src/components/analytics";
import { Message, Question } from "./message";
import { Message as ConversationalMessage } from "data/storage/conversations";
import React, { useEffect, useState } from "react";

type Props = {
  messages: AiMessage[];
  conversation: ConversationalMessage[];
  append: (
    message: AiMessage | CreateMessage
  ) => Promise<string | null | undefined>;
  isGenerating?: boolean
};

export function BotMessages({ messages, conversation, append, isGenerating }: Props) {
  const [currentResponse, setCurrentResponse] = useState<string>();
  const appendQuestion = (question: string) =>
    append({ role: "user", content: question });

  const explainConcept = (msg: string) => {
    Analytics.track("click:question-explainer", { msg });
    appendQuestion(`What is ${msg}?`);
  };

  const handleSuggestionClick = (question: string) => {
    Analytics.track("click:question-suggestion", { question });
    appendQuestion(question);
  };

  const suggestions = conversation?.filter(message => !message.user).slice(0, 3) || [];
  useEffect(() => {
    console.log('messages', messages, isGenerating);
    if(isGenerating) {
      setCurrentResponse(messages.at(-1).content);
    } else if(currentResponse) {
      console.log('Persisting to DB');
      setCurrentResponse(undefined);
    }
  }, [messages, isGenerating]);

  return (
    <>
      {messages.length === 0 &&
        suggestions.map((question, i) => (
          <Question
            key={i}
            onClick={() => handleSuggestionClick(question.text)}
            className="cursor-pointer"
          >
            {question.text}
          </Question>
        ))}
      {messages?.map((message, i) => (
        <Message
          key={i}
          role={message.role}
          content={message.content}
          explain={explainConcept}
        />
      ))}
    </>
  );
}
