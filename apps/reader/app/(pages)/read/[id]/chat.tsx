"use client";

import { useChat } from "ai/react";
import Image from "next/image";
import React from "react";
import logo from "../../../components/logo.png";

export default function PaperChat(body: { title: string; abstract: string }) {
  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
    body,
  });

  const chatContainerRef = React.useRef<HTMLDivElement>();
  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const explainConcept = (msg: string) => {
    append({ role: "user", content: `What is ${msg}?` });
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div
        ref={chatContainerRef}
        className="whitespace-pre-wrap overflow-scroll h-40 rounded border p-2 flex flex-col gap-2 w-full"
      >
        <div>
          <Persona role={"assistant"} />
          Ask me a question about this paper
        </div>
        {messages?.map((message, i) => (
          <div key={i}>
            <Persona role={message.role} />
            {applyExplainLinks(message.content, explainConcept)}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          className="w-full bottom-0 border border-gray-300 rounded shadow-md p-2 mt-2 text-base text-slate-800"
          value={input}
          placeholder="Ask question..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}

function Persona({ role }: { role: "system" | "user" | "assistant" }) {
  return (
    <span>
      {role === "user" ? (
        "👤 "
      ) : (
        <Image
          src={logo}
          className="inline mr-1"
          alt="Assistant avatar"
          height={16}
          width={16}
        />
      )}
    </span>
  );
}

function applyExplainLinks(msg: string, onClick: (concept: string) => void) {
  const re = /\(\(.*?\)\)/gi;

  const asLink = (input: string) => {
    const sanitized = input.replace("((", "").replace("))", "");

    return (
      <span
        style={{
          textDecoration: "underline",
          cursor: "pointer",
          color: "cadetblue",
        }}
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
