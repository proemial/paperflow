
export type ArxivItem = {
  id: string,
  updated: string | Date, //2023-05-02T17:59:31Z,
  published: string | Date,
  title: string,
  summary: string,
  author: Array<string>,
  comment: string,
  link: Array<{
    href: string,
    rel: 'alternate' | 'related' | 'self',
    type: 'text/html' | 'application/pdf' | 'application/atom+xml',
  }> ,
  primary_category: {
    term: string,
  },
  category: Array<{
    term: string,
  }>,
}

export type ArxivFeed = {
  publisher: string;
  title: string;
  description: string;
  link: string;
  items: ArxivFeedItem[];
};

export type ArxivFeedItem = {
  title: string;
  link: string;
  creator: string;
  content: string;
  contentSnippet: string;
};
