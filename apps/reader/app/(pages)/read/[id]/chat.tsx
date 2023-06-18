"use client";

import { useChat } from "ai/react";
import React from "react";

export default function PaperChat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  const ref = React.useRef<HTMLDivElement>();
  React.useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="mx-auto w-full h-full max-w-md flex flex-col stretch">
      <div
        ref={ref}
        className="whitespace-pre-wrap overflow-scroll h-40 rounded border p-2 flex flex-col gap-2"
      >
        {messages?.map((message, i) => (
          <div key={i}>
            <Persona role={message.role} />
            {message.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          className="w-full max-w-md bottom-0 border border-gray-300 rounded shadow-md p-2 mt-2"
          value={input}
          placeholder="Say something..."
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
        <img src="/favicon-16x16.png" className="inline mr-1" />
      )}
    </span>
  );
}
