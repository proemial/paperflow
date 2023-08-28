import { Message as AiMessage, CreateMessage } from "ai";
import { Analytics } from "src/components/analytics";
import { Message, Question, Role } from "./message-old";

type Props = {
  messages: AiMessage[];
  suggestions: string[];
  append: (
    message: AiMessage | CreateMessage
  ) => Promise<string | null | undefined>;
};

export function BotMessages({ messages, suggestions, append }: Props) {
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

  const previousMessages = [
    {
      role: "user" as Role,
      content:
        "How does disagreement impact a group's productivity in a repeated game?",
    },
    {
      role: "systems" as Role,
      content:
        "Disagreement in a group's understanding of production technologies and their efficacy ((disagreement dividend)) can lead to increased efforts from different team members ((optimistic and skeptical views)), particularly if they hold optimistic views or believe their preferred technology is superior, thus potentially boosting the overall productive performance if the technologies are similar according to the true production process.",
    },
  ];

  return (
    <>
      {messages.length === 0 &&
        suggestions?.map((question, i) => (
          <Question
            key={i}
            onClick={() => handleSuggestionClick(question)}
            className="cursor-pointer"
          >
            {question}
          </Question>
        ))}

      {previousMessages?.map((message, i) => (
        <Message
          key={i}
          role={message.role}
          content={message.content}
          explain={explainConcept}
        />
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
