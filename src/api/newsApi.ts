import { safeFetch } from './http';

const NEWSDATA_API_KEY = 'pub_a984c5d2fb4c4ca2b25b70a5e1fb80d0';
const NEWSDATA_BASE = 'https://newsdata.io/api/1/latest';
const COUNTRY = 'us';

export const NEWS_CATEGORIES = [
  'business',
  'crime',
  'domestic',
  'education',
  'entertainment',
  'environment',
  'food',
  'health',
  'lifestyle',
  'other',
  'politics',
  'science',
  'sports',
  'technology',
  'top',
  'tourism',
  'world',
] as const;

export interface NewsArticle {
  category?: string[];
  categories?: string[];
  country?: string[];
  creator?: string[];
  description?: string;
  image_url?: string;
  image?: string;
  language?: string;
  link?: string;
  pubDate?: string;
  title?: string;
  source_name?: string;
  source?: string;
  content?: string;
  date?: string;
}

interface RawNewsResponse {
  results?: NewsArticle[];
  nextPage?: string | null;
}

export interface FetchNewsParams {
  q?: string;
  category?: string;
  page?: string | null;
}

export interface NewsPayload {
  results: NewsArticle[];
  nextPage: string | null;
}

export async function fetchNews(
  { q = '', category = '', page = null }: FetchNewsParams = {},
): Promise<NewsPayload> {
  const params = new URLSearchParams({
    apikey: NEWSDATA_API_KEY,
    country: COUNTRY,
    language: 'en',
  });

  if (q) params.set('q', q);
  if (category) params.set('category', category);
  if (page) params.set('page', page);

  const data = await safeFetch<RawNewsResponse>(`${NEWSDATA_BASE}?${params.toString()}`);
  return {
    results: Array.isArray(data?.results) ? data.results : [],
    nextPage: data?.nextPage ?? null,
  };
}

