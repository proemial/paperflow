import { RawArxivPaper } from '@/data/adapters/arxiv/arxiv.models';
import ListItem from "@/components/list-item";
import Link from "next/link";
import dayjs from 'dayjs';
import { fetchData } from '@/data/adapters/fetch';

export default async function Page() {
  const json: Array<RawArxivPaper> = await (await fetchData(`http://localhost:3020/api/arxiv/scrape/`)).json();
  console.log('json', json);


  const grouped = {} as Record<string, Array<RawArxivPaper>>;
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

function ArxivLink({ item }: { item: RawArxivPaper }) {
  const id = item.id.substring(item.id.lastIndexOf('/') + 1);
  return (
    <Link href={item.id}>{id}</Link>
  )
}
