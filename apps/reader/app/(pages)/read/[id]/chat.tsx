"use client";

import { useChat } from "ai/react";
import Image from "next/image";
import React from "react";
import logo from "../../../components/logo.png";

export default function PaperChat(body: { title: string; abstract: string }) {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    body,
  });

  const ref = React.useRef<HTMLDivElement>();
  React.useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-full h-full flex flex-col">
      <div
        ref={ref}
        className="whitespace-pre-wrap overflow-scroll h-40 rounded border p-2 flex flex-col gap-2 w-full"
      >
        <div>
          <Persona role={"assistant"} />
          Ask me a question about this paper
        </div>
        {messages?.map((message, i) => (
          <div key={i}>
            <Persona role={message.role} />
            {message.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          className="w-full bottom-0 border border-gray-300 rounded shadow-md p-2 mt-2 text-base"
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
