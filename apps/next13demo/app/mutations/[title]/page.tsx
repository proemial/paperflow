
export default function Page({ params }: { params: { title: string } }) {

  return (
    <div className="space-y-4">
      <div className="flex justify-between  space-x-3">
        <div className="text-xl font-medium text-zinc-500">Title {params.title}</div>
      </div>
    </div>
  );
}
