export type Frontmatter = {
  title: string;
  description?: string;
  summary?: string;
  date?: string;
  draft?: boolean;
  tags?: string[];
  categories?: string[];

  series?: string[] | string;
  series_order?: number;

  cover?: string;
  status?: string;
  link?: string;
  blogLink?: string;

  [key: string]: unknown;
};

export type ContentItem = {
  slug: string;
  route: string;
  sourcePath: string;
  content: string;
  data: Frontmatter;
};