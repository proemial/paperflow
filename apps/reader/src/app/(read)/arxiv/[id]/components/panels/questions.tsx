"use client";
import { PaperPlaneIcon } from "src/components/icons/paperplane";
import { Panel } from "src/components/panel";
import { useChat } from "ai/react";
import React, { FormEvent, useState } from "react";
import { ArXivAtomPaper } from "data/adapters/arxiv/arxiv.models";
import { Model } from "data/adapters/redis/redis-client";
import { Analytics } from "src/components/analytics";

const questions = [
  "Why is this important?",
  "Explain it to me like I'm five",
  "How did they arrive at that conclusion?",
  "What are the key takeaways?",
  "What are the key concepts?",
  "How was the study perfomed?",
];

type Props = {
  paper: ArXivAtomPaper;
  model: Model;
  closed?: boolean;
};

export function QuestionsPanel({ paper, model, closed }: Props) {
  const [suggestions] = useState(random(questions, 3));

  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
    body: {
      title: paper?.parsed.title,
      abstract: paper?.parsed.abstract,
      model,
    },
  });

  const chatContainerRef = React.useRef<HTMLDivElement>();
  React.useEffect(() => {
    if (messages?.length > 0 && chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView(false);
    }
  }, [messages]);

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

  const handlePostQuestion = (e: FormEvent<HTMLFormElement>) => {
    handleSubmit(e);
    Analytics.track("click:question-ask");
  };

  return (
    <Panel title="Ask a question" closed={closed}>
      <div className="pt-4 flex flex-col justify-start">
        {messages.length === 0 &&
          suggestions.map((question, i) => (
            <Question
              key={i}
              onClick={() => handleSuggestionClick(question)}
              className="cursor-pointer"
            >
              {question}
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
        <form onSubmit={handlePostQuestion} className="flex items-center">
          <input
            type="text"
            placeholder="Ask your own question"
            className="w-full bg-black border-input border-l-2 border-y-2 rounded-tl-lg rounded-bl-lg p-3 focus-visible:outline-none"
            style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
            value={input}
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="p-3 pt-4 border-input border-r-2 border-y-2 rounded-tr-lg rounded-br-lg"
          >
            <PaperPlaneIcon />
          </button>
        </form>
        <div ref={chatContainerRef}></div>
      </div>
    </Panel>
  );
}

type Role = "function" | "system" | "user" | "assistant";

function Message({
  role,
  content,
  explain,
}: {
  role: Role;
  content: string;
  explain: (msg: string) => void;
}) {
  const withLinks = applyExplainLinks(content, explain);
  if (role === "user") {
    return <Question>{content}</Question>;
  } else {
    return <Answer>{withLinks}</Answer>;
  }
}

const style =
  "inline-block mb-4 rounded-b-2xl py-2 px-4 shadow bg-gradient-to-r";

function Answer({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${style} from-secondary to-secondary-gradient rounded-tr-2xl self-start`}
    >
      {/* @ts-ignore */}
      {children}
    </div>
  );
}

function Question({
  children,
  onClick,
  className,
}: {
  children: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <div
      className={`${className} ${style} from-primary to-primary-gradient rounded-tr-2xl self-start`}
      onClick={() => onClick && onClick()}
    >
      {children}
    </div>
  );
}

function applyExplainLinks(
  msg: string,
  onClick: (concept: string) => void
): React.ReactNode {
  const re = /\(\(.*?\)\)/gi;

  const asLink = (input: string) => {
    const sanitized = input.replace("((", "").replace("))", "");

    return (
      <span
        className="underline cursor-pointer text-primary font-medium"
        onClick={() => onClick(sanitized)}
      >
        {sanitized}
      </span>
    );
  };

  const arr = msg.replace(re, "~~$&~~").split("~~");
  return arr.map((s, i) => (
    <span key={i}>
      {s.match(re) ? <span>{s.match(re) ? asLink(s) : s}</span> : s}
    </span>
  ));
}

function random(arr: string[], num: number) {
  return [...arr].sort(() => 0.5 - Math.random()).slice(0, num);
}
