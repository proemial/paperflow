import clsx from "clsx";
import { Card } from "../shadcn-ui/Card";
import Spinner from "../spinner";

export function SkeletonCard() {
    //
    return <Card className={clsx('max-sm:w-full flex justify-center p-4', {
        'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent':
          true,
      })}>
        <Spinner />
      </Card>
}
