"use client";
import { ArXivAtomPaper } from "data/adapters/arxiv/arxiv.models";
import { Model } from "data/adapters/redis/redis-client";
import { Panel } from "src/components/panel";
import { InsightsBot as Bot } from "./bot/bot";
import { InsightsBot as BotV2 } from "./bot-v2/bot";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/src/state/react-query";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { useRole } from "@/src/utils/auth";

type Props = {
  paper: ArXivAtomPaper;
  model: Model;
  closed?: boolean;
};

export function QuestionsPanel(props: Props) {
  const botV2Enabled = useRole('botV2');

  return (
    <Panel title="Ask a question" closed={props.closed}>
      <div className="pt-4 flex flex-col justify-start">
        <QueryClientProvider client={queryClient}>
          {/* @ts-ignore */}
          <UserProvider>
            {!botV2Enabled &&
              <Bot {...props} />
            }
            {botV2Enabled &&
              <BotV2 {...props} />
            }
          </UserProvider>
        </QueryClientProvider>
      </div>
    </Panel>
  );
}
