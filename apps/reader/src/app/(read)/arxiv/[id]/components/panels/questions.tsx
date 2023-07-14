import { PaperPlaneIcon } from "src/components/icons/paperplane";
import { Panel } from "src/components/panel";

const questions = [
  "When was the study performed?",
  "How were the participants recruited?",
  "What is the median diagnostic delay in Bangladesh for other comparable respiratory cases?",
  "Why is this important",
  "Explain it to me like I'm five",
  "How did they arrive at that conclusion?",
];

export function QuestionsPanel({ closed }: { closed?: boolean }) {
  return (
    <Panel title="Ask a question" closed={closed}>
      <div className="pt-4 flex flex-col justify-start">
        {random(questions, 3).map((question, i) => (
          <Question key={i}>{question}</Question>
        ))}
        <Answer>
          This research is important because it uses a{" "}
          <span className="text-primary font-semibold">mathematical model</span>{" "}
          that relies on{" "}
          <span className="text-primary font-semibold">COVID-19 deaths</span>{" "}
          data to figure out the real{" "}
          <span className="text-primary font-semibold">
            number of infections
          </span>
          , helping us understand{" "}
          <span className="text-primary font-semibold">virus transmission</span>{" "}
          and the effects of{" "}
          <span className="text-primary font-semibold">
            control measures and people&apos;s behavior
          </span>
          , which can be more reliable than just counting reported infections.
        </Answer>
      </div>
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Ask your own question"
          className="w-full bg-black border-input border-l-2 border-y-2 rounded-tl-lg rounded-bl-lg p-3"
        />
        <button
          type="button"
          className="p-3 border-input border-r-2 border-y-2 rounded-tr-lg rounded-br-lg"
        >
          <PaperPlaneIcon />
        </button>
      </div>
    </Panel>
  );
}

const style =
  "inline-block mb-4 rounded-b-2xl py-2 px-4 shadow bg-gradient-to-r max-w-[80%]";

function Answer({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${style} from-secondary to-secondary-gradient rounded-tl-2xl self-end`}
    >
      {children}
    </div>
  );
}

function Question({ children }: { children: string }) {
  return (
    <div
      className={`${style} from-primary to-primary-gradient rounded-tr-2xl self-start`}
    >
      {children}
    </div>
  );
}

function random(arr: string[], num: number) {
  return [...arr].sort(() => 0.5 - Math.random()).slice(0, num);
}
