import { ArxivItem } from "./api/arxiv/scrape/.model";
import ListItem from "./.components/.list-item";
import Link from "next/link";

export default async function Page() {
  const json: Array<ArxivItem> = await (await fetch('http://localhost:3020/api/arxiv/scrape')).json();

  const grouped = {} as Record<string, Array<ArxivItem>>;
  json.forEach((item) => {
    const category = item.primary_category.term;
    grouped.hasOwnProperty(category)
      ? grouped[category].push(item)
      : grouped[category] = [item];
  });
  console.log(json.length);


  return (
    <div className="space-y-6">
      <div className="space-y-2 text-white">
        {Object.keys(grouped).filter(category => category.startsWith('cs.')).sort().map((category) => (
          <div key={category} className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider">
              {category}
            </div>

            <ol className="text-xs font-semibold uppercase tracking-wider text-zinc-500 list-decimal">
              {grouped[category].map((item) => (
                <ListItem key={item.id}>
                  <>
                    <ArxivLink item={item} /> {item.title}
                  </>
                </ListItem>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArxivLink({ item }: { item: ArxivItem }) {
  const id = item.id.substring(item.id.lastIndexOf('/') + 1);
  return (
    <Link href={item.id}>{id}</Link>
  )
}
