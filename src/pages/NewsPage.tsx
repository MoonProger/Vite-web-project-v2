import { FormEvent, useEffect, useState } from 'react';
import NewsCard from '../components/NewsCard';
import {
  fetchNews,
  NEWS_CATEGORIES,
  NewsArticle,
} from '../api/newsApi';

const NewsPage = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const loadNews = async (
    reset = true,
    pageToken: string | null = null,
    overrides?: { query?: string; category?: string },
  ) => {
    setLoading(true);
    setMessage('Загрузка новостей...');
    try {
      const effectiveQuery = overrides?.query ?? query;
      const effectiveCategory = overrides?.category ?? category;
      const { results, nextPage: next } = await fetchNews({
        q: effectiveQuery.trim(),
        category: effectiveCategory,
        page: pageToken,
      });
      setMessage(results.length ? '' : 'Ничего не найдено.');
      setNextPage(next);
      setArticles((prev) => (reset ? results : [...prev, ...results]));
    } catch (error) {
      console.error(error);
      setMessage(
        error instanceof Error ? error.message : 'Не удалось загрузить новости',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    loadNews(true);
  };

  const handleReset = () => {
    setQuery('');
    setCategory('');
    loadNews(true, null, { query: '', category: '' });
  };

  return (
    <section className="card">
      <header className="header">
        <h1>American news — stay tuned, stay informed!</h1>
      </header>

      <form className="controls" onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="Search by key words"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <select
          className="input"
          value={category}
          onChange={(event) => {
            const next = event.target.value;
            setCategory(next);
            loadNews(true, null, { category: next });
          }}
        >
          <option value="">All categories</option>
          {NEWS_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat[0].toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>

        <button type="submit" disabled={loading}>
          Search
        </button>
        <button type="button" onClick={handleReset} disabled={loading}>
          Hot news
        </button>
      </form>

      <div className="small">{message}</div>

      <div className="grid news-list">
        {articles.map((article, index) => (
          <NewsCard
            key={article.link || `${article.title}-${index}`}
            article={article}
          />
        ))}
      </div>

      {nextPage && (
        <button
          type="button"
          className="load-more-btn"
          onClick={() => loadNews(false, nextPage)}
          disabled={loading}
        >
          {loading ? 'Загрузка...' : 'Загрузить ещё'}
        </button>
      )}
    </section>
  );
};

export default NewsPage;

