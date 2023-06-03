import Link from "next/link";

export default function HomePage() {
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

  // Stats must be lazy-loaded

  return (
    <div className="flex flex-col gap-1">
      <div className="max-sm:flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-2 flex-1">
        <div className="border border-cyan-500 h-48">Card 1</div>
        <div className="border border-red-50 h-48">Card 2</div>
        <div className="border border-blue-500 h-48">Card 3</div>
        <div className="border border-cyan-500 h-48">Card 1</div>
        <div className="border border-red-500 h-48">Card 2</div>
        <div className="border border-blue-500 h-48">Card 3</div>
        <div className="border border-cyan-500 h-48">Card 1</div>
        <div className="border border-red-500 h-48">Card 2</div>
        <div className="border border-blue-500 h-48">Card 3</div>
        <div className="border border-cyan-500 h-48">Card 1</div>
        <div className="border border-red-500 h-48">Card 2</div>
        <div className="border border-blue-500 h-48">Card 3</div>
        <div className="border border-cyan-500 h-48">Card 1</div>
        <div className="border border-red-500 h-48">Card 2</div>
        <div className="border border-blue-500 h-48">Card 3</div>
        <div className="border border-cyan-500 h-48">Card 1</div>
        <div className="border border-red-500 h-48">Card 2</div>
        <div className="border border-blue-500 h-48">Card 3</div>
      </div>
      <div className="flex items-end justify-end">
        <Link href="">Load more</Link>
      </div>
    </div>
  )
}
