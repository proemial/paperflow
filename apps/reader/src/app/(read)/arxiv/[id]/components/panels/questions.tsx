"use client";
import { ArXivAtomPaper } from "data/adapters/arxiv/arxiv.models";
import { Model } from "data/adapters/redis/redis-client";
import { Panel } from "src/components/panel";
import { Answer, Question } from "./bot/message";

type Props = {
  paper: ArXivAtomPaper;
  model: Model;
  closed?: boolean;
};

type Message = {
  text: string;
  createdAt: Date;
};

type ConversationalMessage = Message & {
  user?: string; // Default: 'Bot'
  role?: "question" | "answer" | "suggestion"; // Default: 'answer'
  visibility?: "public" | "private"; // Default: 'private'
  scores?: {
    [key: string]: number;
  };
};

type PaperConversations = {
  paper: string;
  suggestions?: Message[];
  insights?: {
    [key: string]: Array<Message & { replies?: Message[] }>;
  };
  conversations?: Array<
    ConversationalMessage & { replies?: ConversationalMessage[] }
  >;
};

// Query relevant messages:
// $project: {
//   messages: {
//     $filter: {
//       input: "$messages",
//       as: "messages",
//       cond: {
//         $or: [
//           {$eq: ["$$messages.visibility", "public"]},
//           {$eq: ["$$messages.user", "google-oauth2|116237839610131678110"]}
//         ]
//       }
//     }
//   }
// }

const example: PaperConversations = {
  paper: "2308.10966",
  suggestions: [
    {
      text: "How does this approach ensure safe and deadlock-free navigation for decentralized multi-robot systems in constrained environments?",
      createdAt: new Date(),
    },
    {
      text: "What is the key insight that allows decentralized robots to maintain liveness and avoid deadlocks?",
      createdAt: new Date(),
    },
    {
      text: "How does the proposed approach compare to other decentralized and centralized navigation approaches in terms of safety, efficiency, and smoothness?",
      createdAt: new Date(),
    },
    {
      text: "What is the mean-field approach to studying two-site Bose-Hubbard systems?",
      createdAt: new Date(),
    },
    {
      text: "How can quantum effects beyond mean field be uncovered in these systems?",
      createdAt: new Date(),
    },
    {
      text: "What are the advantages of using a multi-configuration ansatz with time-dependent basis functions in the variational principle?",
      createdAt: new Date(),
    },
  ],
  insights: {
    "google-oauth2|116237839610131678110": [
      {
        // Custom question
        text: "Why should I care?",
        createdAt: new Date(),
        replies: [
          {
            text: "Understanding the quantum effects in bosonic Josephson junctions through a multi-configuration atomic coherent states approach provides a more accurate representation of phase space dynamics and symmetry breaking, requiring significantly fewer variational trajectories compared to traditional semiclassical ones, offering more efficient and precise insights into quantum systems.",
            createdAt: new Date(),
          },
        ],
      },
      // Follow-up suggestion clicked
      {
        text: "What are the advantages of using a multi-configuration ansatz with time-dependent basis functions in the variational principle?",
        createdAt: new Date(),
        replies: [
          {
            text: "The use of a multi-configuration ansatz with time-dependent basis functions in the variational principle allows for uncovering quantum effects with fewer variational trajectories, providing better qualitative agreement of phase space dynamics and facilitating the understanding of more complex effects such as macroscopic quantum self trapping and the onset of spontaneous symmetry breaking.",
            createdAt: new Date(),
          },
        ],
      },
      // insights-link clicked
      {
        text: "What is macroscopic quantum self trapping?",
        createdAt: new Date(),
        replies: [
          {
            text: "Macroscopic quantum self trapping refers to a quantum phenomenon where a bosonic system can exhibit a self-stabilizing behavior against distribution or spread of population, leading to an imbalance in the population states due to inter-particle interaction and nonlinear effects.",
            createdAt: new Date(),
          },
        ],
      },
    ],
  },
  conversations: [
    {
      user: "google-oauth2|116237839610131678110",
      createdAt: new Date(),
      text: "How does the P2C framework complete point cloud objects using only a single incomplete point cloud per object?",
      replies: [
        {
          createdAt: new Date(),
          text: "The P2C framework completes point cloud objects from a single partial observation by grouping ((incomplete point clouds)) into ((local patches)), and utilizing a self-supervised approach that predicts ((masked patches)) based on prior information learned from various incomplete objects, supported further by a ((Region-Aware Chamfer Distance)) for shape regulization and a Normal ((Consistency Constraint)) to ensure continuous and complete surface recovery.",
        },
        {
          user: "google-oauth2|103724863179690205173",
          createdAt: new Date(),
          text: "The ((Region-Aware Chamfer)) helps regularizing shape mismatches without limiting completion capacity, and the ((Normal Consistency Constraint)) supports a local planarity assumption to ensure the continuity and completeness of the recovered surface.",
        },
        {
          user: "google-oauth2|113343050005700467125",
          createdAt: new Date(),
          text: "((@rydahl)) does the model learn from it's own observations?",
        },
      ],
    },
  ],
};

const conversations = {
  users: {
    "google-oauth2|116237839610131678110": {
      info: {
        name: "Brian Pedersen",
        nickname: "brian",
        picture:
          "https://lh3.googleusercontent.com/a/AAcHTtfVIjcxa2Y-HzdtXOZUfay9ypCHT88ajAdqdsHA8SpwOQ=s96-c",
        org: "paperflow.ai",
      },
      authorOf: ["2308.06607"],
    },
    "google-oauth2|103724863179690205173": {
      info: {
        name: "Mads Rydahl",
        nickname: "mads",
        picture:
          "https://lh3.googleusercontent.com/a/AAcHTtdXemHAD7Bh0xAJXGi4x-5GhyvLD0XgIbZGun6oYjQC=s96-c",
        org: "paperflow.ai",
      },
    },
    "google-oauth2|113343050005700467125": {
      info: {
        name: "Geet Khosla",
        nickname: "geet",
        picture:
          "https://lh3.googleusercontent.com/a/AAcHTtceVQwn1vs6KnqAM9CRHZb5QF888jG0TFbrDO2GmYovaw=s96-c",
        org: "paperflow.ai",
      },
    },
  },
  messages: [
    {
      user: "google-oauth2|116237839610131678110",
      createdAt: {
        $date: "2023-08-21T05:20:17.947Z",
      },
      text: "How does the P2C framework complete point cloud objects using only a single incomplete point cloud per object?",
      visibility: "public",
      replies: [
        {
          createdAt: {
            $date: "2023-08-21T05:20:18.947Z",
          },
          text: "The P2C framework completes point cloud objects from a single partial observation by grouping ((incomplete point clouds)) into ((local patches)), and utilizing a self-supervised approach that predicts ((masked patches)) based on prior information learned from various incomplete objects, supported further by a ((Region-Aware Chamfer Distance)) for shape regulization and a Normal ((Consistency Constraint)) to ensure continuous and complete surface recovery.",
        },
        {
          user: "google-oauth2|103724863179690205173",
          createdAt: {
            $date: "2023-08-21T05:21:18.947Z",
          },
          text: "The ((Region-Aware Chamfer)) helps regularizing shape mismatches without limiting completion capacity, and the ((Normal Consistency Constraint)) supports a local planarity assumption to ensure the continuity and completeness of the recovered surface.",
        },
        {
          user: "google-oauth2|113343050005700467125",
          createdAt: {
            $date: "2023-08-21T06:21:18.947Z",
          },
          text: "((@rydahl)) does the model learn from it’s own observations?",
        },
      ],
    },
  ],
};

export function QuestionsPanel(props: Props) {
  return (
    <Panel title="Ask a question" closed={props.closed}>
      <div className="pt-4 flex flex-col justify-start">
        <Question>{"Why is this important?"}</Question>
        <Answer>{"It just is!"}</Answer>

        <div className={`text-xl text-right`}>Ask a followup question</div>
        <Question>{"Followup 1"}</Question>
        <Question>{"Followup 2"}</Question>

        <div className={`text-xl`}>12 public conversations</div>
        {conversations.messages.map((message, i) => (
          <div key={i}>
            <Question user={conversations.users[message.user]}>
              {message.text}
            </Question>
            {message.replies.map((reply, j) => (
              <div key={j}>
                <Answer user={conversations.users[reply?.user]}>
                  {reply.text}
                </Answer>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Panel>
  );
}
