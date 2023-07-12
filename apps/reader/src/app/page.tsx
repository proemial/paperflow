import { Logo } from "ui";
import { PaperMenu } from "../components/paper-menu";
import { PaperCard } from "../components/paper-card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-start">
      <PaperCard>
        DR-TB patients in Bangladesh face delays due to seeking care from
        multiple informal providers
      </PaperCard>

      <PaperMenu className="p-4 top-0 sticky bg-background" />

      <div className="px-4 pt-2">
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex justify-between">
              <div>Summary</div>
              <div>hide</div>
            </div>
            <div>
              In Bangladesh, DR-TB cases usually seek care from multiple
              providers, particularly from informal providers, and among them,
              alarmingly higher healthcare-seeking related delays were noted.
              Immediate measures should be taken in the community to reduce the
              burden of the disease.
            </div>
          </div>

          <div>
            <div className="flex justify-between">
              <div>Article Metadata</div>
              <div>hide</div>
            </div>
            <div>
              Healthcare seeking behavior and delays in case of Drug-Resistant
              Tuberculosis patients in Bangladesh: Findings from a
              cross-sectional survey
            </div>
            <div className="flex gap-2">
              <div>Noman</div>
              <div>Islam</div>
              <div>Aktar</div>
              <div>Parray</div>
              <div>Finnegan</div>
              <div>Et al.</div>
            </div>
            <div className="flex justify-end">medRxiv, April 25, 2023</div>
          </div>

          <div>
            <div className="flex justify-between">
              <div>Ask a question</div>
              <div>hide</div>
            </div>
            <div>When was the study performed?</div>
            <div>How were the participants recruited?</div>
            <div>
              What is the median diagnostic delay in Bangladesh for other
              comparable respiratory cases?
            </div>
            <div>
              <input
                type="text"
                placeholder="Ask your own question"
                className="w-full bg-black border border-input"
              />
            </div>
            <div>
              If you ask a novel and relevant question, you will have the
              opportunity to make it public and we will forward it to the author
            </div>
          </div>

          <div>
            <PaperCard variant="related">
              New Reinforcement Learning framework RLTF improves code generation
              using real-time feedback
            </PaperCard>
            <PaperCard variant="related">
              New Reinforcement Learning framework RLTF improves code generation
              using real-time feedback
            </PaperCard>
            <PaperCard variant="related">
              New Reinforcement Learning framework RLTF improves code generation
              using real-time feedback
            </PaperCard>
          </div>
        </div>
      </div>
    </main>
  );
}
