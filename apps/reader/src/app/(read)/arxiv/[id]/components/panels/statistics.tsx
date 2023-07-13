import { CommentsIcon } from "@/src/components/icons/comments";
import { EyeIcon } from "@/src/components/icons/eye";
import { HeartIcon } from "@/src/components/icons/heart";
import { RepeatIcon } from "@/src/components/icons/repeat";
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
    </Panel>
  );
}
