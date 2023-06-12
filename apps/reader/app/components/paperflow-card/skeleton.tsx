import { Card } from "../shadcn-ui/Card";

export function SkeletonCard() {
    return <Card className="max-sm:w-full h-12 before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent"></Card>
}
