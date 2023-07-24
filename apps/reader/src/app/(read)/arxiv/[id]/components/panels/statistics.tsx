import { CommentsIcon } from "src/components/icons/comments";
import { EyeIcon } from "src/components/icons/eye";
import { HeartIcon } from "src/components/icons/heart";
import { RepeatIcon } from "src/components/icons/repeat";
import { Panel } from "src/components/panel";

export function StatisticsPanel({ closed }: { closed?: boolean }) {
  return (
    <Panel title="Aggregated Statistics" closed={closed}>
      <div className="flex justify-between py-4">
        <div className="flex items-center gap-2">
          <CommentsIcon /> 12
        </div>
        <div className="flex items-center gap-2">
          <RepeatIcon /> 38
        </div>
        <div className="flex items-center gap-2">
          <HeartIcon /> 203
        </div>
        <div className="flex items-center gap-2">
          <EyeIcon /> 19k
        </div>
      </div>
      <div className="text-xxs opacity-70">
        Coming soon. We are currently building out our social media monitoring
        service, which will track views, likes, and comments on papers across
        all key platforms. We would like to collect and save a copy of all
        relevant comments on the Paperflow blockchain, and make this part of the
        public record of a paper.
      </div>
    </Panel>
  );
}
