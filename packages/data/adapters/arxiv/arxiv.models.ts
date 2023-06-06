
export const arxivCategories = [
  { key: "cs", title: "Computer Science", category: "Computer Science" },
  { key: "cs.AI", title: "Artificial Intelligence", category: "Computer Science" },
  { key: "cs.CL", title: "Computation and Language", category: "Computer Science" },
  { key: "cs.CC", title: "Computational Complexity", category: "Computer Science" },
  { key: "cs.CE", title: "Computational Engineering, Finance, and Science", category: "Computer Science" },
  { key: "cs.CG", title: "Computational Geometry", category: "Computer Science" },
  { key: "cs.GT", title: "Computer Science and Game Theory", category: "Computer Science" },
  { key: "cs.CV", title: "Computer Vision and Pattern Recognition", category: "Computer Science" },
  { key: "cs.CY", title: "Computers and Society", category: "Computer Science" },
  { key: "cs.CR", title: "Cryptography and Security", category: "Computer Science" },
  { key: "cs.DS", title: "Data Structures and Algorithms", category: "Computer Science" },
  { key: "cs.DB", title: "Databases", category: "Computer Science" },
  { key: "cs.DL", title: "Digital Libraries", category: "Computer Science" },
  { key: "cs.DM", title: "Discrete Mathematics", category: "Computer Science" },
  { key: "cs.DC", title: "Distributed, Parallel, and Cluster Computing", category: "Computer Science" },
  { key: "cs.ET", title: "Emerging Technologies", category: "Computer Science" },
  { key: "cs.FL", title: "Formal Languages and Automata Theory", category: "Computer Science" },
  { key: "cs.GL", title: "General Literature", category: "Computer Science" },
  { key: "cs.GR", title: "Graphics", category: "Computer Science" },
  { key: "cs.AR", title: "Hardware Architecture", category: "Computer Science" },
  { key: "cs.HC", title: "Human-Computer Interaction", category: "Computer Science" },
  { key: "cs.IR", title: "Information Retrieval", category: "Computer Science" },
  { key: "cs.IT", title: "Information Theory", category: "Computer Science" },
  { key: "cs.LO", title: "Logic in Computer Science", category: "Computer Science" },
  { key: "cs.LG", title: "Machine Learning", category: "Computer Science" },
  { key: "cs.MS", title: "Mathematical Software", category: "Computer Science" },
  { key: "cs.MA", title: "Multiagent Systems", category: "Computer Science" },
  { key: "cs.MM", title: "Multimedia", category: "Computer Science" },
  { key: "cs.NI", title: "Networking and Internet Architecture", category: "Computer Science" },
  { key: "cs.NE", title: "Neural and Evolutionary Computing", category: "Computer Science" },
  { key: "cs.NA", title: "Numerical Analysis", category: "Computer Science" },
  { key: "cs.OS", title: "Operating Systems", category: "Computer Science" },
  { key: "cs.OH", title: "Other Computer Science", category: "Computer Science" },
  { key: "cs.PF", title: "Performance", category: "Computer Science" },
  { key: "cs.PL", title: "Programming Languages", category: "Computer Science" },
  { key: "cs.RO", title: "Robotics", category: "Computer Science" },
  { key: "cs.SI", title: "Social and Information Networks", category: "Computer Science" },
  { key: "cs.SE", title: "Software Engineering", category: "Computer Science" },
  { key: "cs.SD", title: "Sound", category: "Computer Science" },
  { key: "cs.SC", title: "Symbolic Computation", category: "Computer Science" },
  { key: "cs.SY", title: "Systems and Control", category: "Computer Science" },

  { key: "math", title: "Mathematics", category: "Mathematics" },
  { key: "math.PR", title: "Probability", category: "Mathematics" },

  { key: "physics", title: "Physics", category: "Physics" },
  { key: "astro-ph", title: "Astrophysics", category: "Physics" },
  { key: "astro-ph.EP", title: "Earth and Planetary Astrophysics", category: "Physics" },
  { key: "nucl-th", title: "Nuclear Theory", category: "Physics" },
  { key: "physics.space-ph", title: "Space Physics", category: "Physics" },
  { key: "physics.quant-ph", title: "Quantum Physics", category: "Physics" },

  { key: "q-bio", title: "Quantitative Biology", category: "Quantitative Biology" },
  { key: "q-bio.NC", title: "Neurons and Cognition", category: "Quantitative Biology" },

  { key: "stat", title: "Statistics", category: "Statistics" },
  { key: "stat.AP", title: "Applications", category: "Statistics" },
  { key: "stat.CO", title: "Computation", category: "Statistics" },
  { key: "stat.ML", title: "Machine Learning", category: "Statistics" },
  { key: "stat.ME", title: "Methodology", category: "Statistics" },
  { key: "stat.OT", title: "Other Statistics", category: "Statistics" },
  { key: "stat.TH", title: "Statistics Theory", category: "Statistics" },
];

type WithName = { name: string };
type WithTerm = { term: string };

export type RawArxivPaper = {
  id: string,
  updated: string,
  published: string,
  title: string,
  summary: string,
  author: WithName | Array<WithName>,
  comment: string,
  link: Array<{
    href: string,
    rel: 'alternate' | 'related' | 'self',
    type: 'text/html' | 'application/pdf' | 'application/atom+xml',
  }>,
  primary_category: {
    term: string,
  },
  category: WithTerm | Array<WithTerm>,
}

export type ArxivPaper = {
  parsed: {
    id: string,
    updated: Date,
    published: Date,
    category: string,
    categories: string[],
    authors: string[],
    link: {
      pdf: string,
      source: string,
    },
    title: string,
    abstract: string,
    hash: string,
  },
  raw: RawArxivPaper,
  summary?: string,
  lastUpdated: Date,
}

export const extractId = (url: string) => removeVersion(
  url.split('abs/').pop() as string
);
export const removeVersion = (id: string) => id.substring(0, id.lastIndexOf('v') || id.length - 1);
