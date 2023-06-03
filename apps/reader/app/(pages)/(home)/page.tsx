import { PaperflowCard } from "app/components/paperflow-card";
import Link from "next/link";
import { CardList } from "./card-list";

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

  // Stats must be lazy-loaded (on reader page)

  return (
    <CardList
      data={[
        {
          url: "https://arxiv.org/abs/2207.05636",
          pubDate: "2023-06-02",
          title: "Neural Posterior Estimation with Differentiable Simulators",
          authors: ["Zeghal", "Lanusse", "Boucaud", "Remy", "Aubourg"],
          summary:
            "Haze on some exoplanets can create water droplets that produce organic prebiotic molecules.",
          tags: [],
        },
        {
          url: "https://arxiv.org/abs/2207.05636",
          pubDate: "2023-06-02",
          title: "Neural Posterior Estimation with Differentiable Simulators",
          authors: ["Zeghal", "Lanusse", "Boucaud", "Remy", "Aubourg"],
          summary:
            "Haze on some exoplanets can create water droplets that produce organic prebiotic molecules.",
          tags: [],
        },
        {
          url: "https://arxiv.org/abs/2207.05636",
          pubDate: "2023-06-02",
          title: "Neural Posterior Estimation with Differentiable Simulators",
          authors: ["Zeghal", "Lanusse", "Boucaud", "Remy", "Aubourg"],
          summary:
            "Haze on some exoplanets can create water droplets that produce organic prebiotic molecules.",
          tags: [],
        },
        {
          url: "https://arxiv.org/abs/2207.05636",
          pubDate: "2023-06-02",
          title: "Neural Posterior Estimation with Differentiable Simulators",
          authors: ["Zeghal", "Lanusse", "Boucaud", "Remy", "Aubourg"],
          summary:
            "Haze on some exoplanets can create water droplets that produce organic prebiotic molecules.",
          tags: [],
        },
        {
          url: "https://arxiv.org/abs/2207.05636",
          pubDate: "2023-06-02",
          title: "Neural Posterior Estimation with Differentiable Simulators",
          authors: ["Zeghal", "Lanusse", "Boucaud", "Remy", "Aubourg"],
          summary:
            "Haze on some exoplanets can create water droplets that produce organic prebiotic molecules.",
          tags: [],
        },
        {
          url: "https://arxiv.org/abs/2207.05636",
          pubDate: "2023-06-02",
          title: "Neural Posterior Estimation with Differentiable Simulators",
          authors: ["Zeghal", "Lanusse", "Boucaud", "Remy", "Aubourg"],
          summary:
            "Haze on some exoplanets can create water droplets that produce organic prebiotic molecules.",
          tags: [],
        },
        {
          url: "https://arxiv.org/abs/2207.05636",
          pubDate: "2023-06-02",
          title: "Neural Posterior Estimation with Differentiable Simulators",
          authors: ["Zeghal", "Lanusse", "Boucaud", "Remy", "Aubourg"],
          summary:
            "Haze on some exoplanets can create water droplets that produce organic prebiotic molecules.",
          tags: [],
        },
        {
          url: "https://arxiv.org/abs/2207.05636",
          pubDate: "2023-06-02",
          title: "Neural Posterior Estimation with Differentiable Simulators",
          authors: ["Zeghal", "Lanusse", "Boucaud", "Remy", "Aubourg"],
          summary:
            "Haze on some exoplanets can create water droplets that produce organic prebiotic molecules.",
          tags: [],
        },
      ]}
    />
  );
}
