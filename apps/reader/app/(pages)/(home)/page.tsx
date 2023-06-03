import { CardList } from "./card-list";
import { IngestionDao } from "data/db/ingestion-dao";
import { PapersDao } from "data/db/paper-dao";

// export const revalidate = 1;

function getMultipleRandom(arr, num) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, num);
}

function separateTags(input: string) {
  const pattern = /(?:^|\s)(#[^\s#]+|[^\s#]+#)(?=$|\s)/;
  const m = input.match(pattern);
  if (m) {
    console.log(input);
    console.log(m);
    console.log("==================");
  }
}

export default async function HomePage() {
  const data = await IngestionDao.getLatest();
  const random = getMultipleRandom(data.ids.hits, 30);

  console.log("data", random);

  const papers = (await PapersDao.getByIds(random)).filter(
    (entry) => entry.status === "summarised"
  );

  console.log("papers", papers);

  const mapped = papers.map((versionedPaper) => {
    const latest = versionedPaper.revisions.at(-1);

    const { link, published, title, authors } = latest.parsed;
    const { summary } = latest;
    separateTags(summary);

    return {
      published,
      title,
      summary,
      authors: authors.map((author) => author.split(" ").at(-1)),
      link: link.source,
    };
  });

  // - Latest summarized recent id's must be in redis
  //   "ingested:latest": {date: '2023-06-02', ids: ['2305.05760', '2305.06960', ...]}

  // - Latest summarized assetDatas must be in redis (TTL: 5d, refetched if missing)
  //   "ingested:2305.05760": {
  //     ingestionDate: '2023-06-02',
  //     summary: 'Haze on some exoplanets can create water droplets that produce organic prebiotic molecules.',
  //     tags: ['ExoPlanets'],
  //     qa: [{q: '', a: ''}]
  //     extract: {
  //       url: '',
  //       pubDate: '',
  //       title: '',
  //       abstract: '',
  //       authors: [''],
  //       related: [''],
  //     }
  //   }

  // - A random handfull must be selected and displayed
  // - A "load more" button fetches another handfull

  // Stats must be lazy-loaded (on reader page)

  return <CardList data={mapped} />;
}
