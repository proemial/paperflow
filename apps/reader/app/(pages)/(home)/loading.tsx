import Spinner from "@/app/components/spinner";

export default function Loading() {
  return (
    <div className="h-[90dvh] flex justify-center items-center">
      <Spinner />
    </div>
  );
}
