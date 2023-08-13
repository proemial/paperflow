"use client";
import { ArXivAtomPaper } from "data/adapters/arxiv/arxiv.models";
import { Model } from "data/adapters/redis/redis-client";
import { Panel } from "src/components/panel";
import { InsightsBot } from "./bot/bot";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/src/state/react-query";
import { UserProvider } from "@auth0/nextjs-auth0/client";

type Props = {
  paper: ArXivAtomPaper;
  model: Model;
  closed?: boolean;
};

export function QuestionsPanel(props: Props) {
  return (
    <Panel title="Ask a question" closed={props.closed}>
      <div className="pt-4 flex flex-col justify-start">
        <QueryClientProvider client={queryClient}>
          {/* @ts-ignore */}
          <UserProvider>
            <InsightsBot {...props} />
          </UserProvider>
        </QueryClientProvider>
      </div>
    </Panel>
  );
}
