export type IngestionIds = {
  newIds: string[],
  hits: string[],
  misses: string[],
};

export type IngestionState = {
  date: string,
  ids: IngestionIds,
};

export type IngestionCounts = {
  date: string,
  count: number,
}

export type LatestIds = {
  date: string, 
  ids: string[]
};

export type SummarisedPaper = {
  ingestionDate: string, 
  id: string, 
  published: string, 
  title: string, 
  summary: string, 
  authors: string[],
  category: {key: string, title: string, category: string},
  link: string,
  qas?: Array<{q: string, a: string}>,
  tage?: string[],
  abstract: string,
  related?: Array<{
    id: string, 
    published: string, 
    title: string, 
  }>,
};
