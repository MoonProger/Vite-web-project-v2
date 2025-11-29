import { NewsArticle } from '../api/newsApi';

const PLACEHOLDER = '/default_image.png';

interface Props {
  article: NewsArticle;
}

function formatDate(iso?: string) {
  if (!iso) return { date: '', time: '' };
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return { date: '', time: '' };
  return {
    date: parsed.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    time: parsed.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
}

const NewsCard = ({ article }: Props) => {
  const { date, time } = formatDate(article.pubDate ?? article.date);
  const categories = Array.isArray(article.category)
    ? article.category
    : article.categories ?? [];

  return (
    <article
      className="news-card"
      onClick={() => article.link && window.open(article.link, '_blank', 'noopener')}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' && article.link) {
          window.open(article.link, '_blank', 'noopener');
        }
      }}
    >
      <img
        className="news-img"
        src={article.image_url || article.image || PLACEHOLDER}
        alt={article.title || 'Новость'}
        loading="lazy"
        onError={(event) => {
          const target = event.currentTarget;
          if (target.src !== PLACEHOLDER) {
            target.src = PLACEHOLDER;
          }
        }}
      />

      <div className="news-info">
        <div className="meta-row">
          <div className="meta-left">
            {date && <div className="meta-date">🗓 {date}</div>}
            {time && <div className="meta-time">⏱ {time}</div>}
          </div>
          <div className="meta-publisher">
            {article.source_name || article.source || 'Unknown'}
          </div>
        </div>

        <h3 className="news-title">{article.title || 'Без заголовка'}</h3>

        <div className="tags-row">
          {categories.map((category) => (
            <span key={category} className="tag">
              {category}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};

export default NewsCard;

