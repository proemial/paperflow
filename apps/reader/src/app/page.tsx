import { PaperCard } from "src/components/card";

const papers = [
  {
    id: "2307.04986",
    text: `Artificial intelligence-powered agents mimic real-world behaviors, flatten epidemic curves, and model complex dynamic systems.`,
    category: "Artificial Intelligence",
    tags: ["#AI", "#EpidemicModeling", "#BehaviorSimulation"],
    published: "2023-07-11",
  },
  {
    id: "2307.04964",
    text: `New advanced version of PPO algorithm improves stability and training of large language models, revolutionizing AI development.`,
    category: "Computation and Language",
    tags: ["#LLMs", "#PPO", "#AI"],
    published: "2023-07-11",
  },
  {
    id: "2307.05402",
    text: "Graphs without long paths are hard to analyze. Matching Cut problem complexity increases. Exponential Time Hypothesis holds strong.",
    category: "Computational Complexity",
    tags: ["#Graphs", "#Matching", "#Exponential"],
    published: "2023-07-11",
  },
  {
    id: "2307.05061",
    text: `Maximizing social welfare in score-based social distance games is computationally tractable on tree-like networks.`,
    category: "Computer Science and Game Theory",
    tags: ["#SocialWelfare", "#CoalitionFormation", "#GameTheory"],
    published: "2023-07-11",
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-start">
      {papers.map((paper, index) => (
        <PaperCard key={index} paper={paper} />
      ))}
    </main>
  );
}
