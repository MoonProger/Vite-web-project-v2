import { useState } from 'react';
import { CatImage } from '../api/catsApi';

const PLACEHOLDER = 'https://via.placeholder.com/800x450?text=No+image';

interface Props {
  item: CatImage;
  isFavourite: boolean;
  onToggleFavourite: (id: string) => Promise<void> | void;
}

const CatCard = ({ item, isFavourite, onToggleFavourite }: Props) => {
  const [vote, setVote] = useState<'up' | 'down' | null>(null);
  const [pending, setPending] = useState(false);

  const handleFavourite = async () => {
    if (pending) return;
    try {
      setPending(true);
      await onToggleFavourite(item.id);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="card-item">
      <img
        className="card-media"
        src={item.url || PLACEHOLDER}
        alt={item.id || 'cat'}
        loading="lazy"
        onError={(event) => {
          const { currentTarget } = event;
          if (currentTarget.src !== PLACEHOLDER) {
            currentTarget.src = PLACEHOLDER;
          }
        }}
      />

      <div className="card-overlay">
        {item.breeds?.[0]?.name && (
          <div className="title">{item.breeds[0].name}</div>
        )}

        <div className="card-actions">
          <div className="left">
            <button
              type="button"
              className={`btn-icon ${vote === 'up' ? 'active' : ''}`}
              onClick={() => setVote((prev) => (prev === 'up' ? null : 'up'))}
              title="Нравится"
            >
              👍
            </button>
            <button
              type="button"
              className={`btn-icon ${vote === 'down' ? 'active' : ''}`}
              onClick={() => setVote((prev) => (prev === 'down' ? null : 'down'))}
              title="Не нравится"
            >
              👎
            </button>
          </div>

          <button
            type="button"
            className={`btn-icon btn-like ${isFavourite ? 'active' : ''}`}
            onClick={handleFavourite}
            disabled={pending}
            title={isFavourite ? 'Убрать из избранного' : 'В избранное'}
          >
            ❤
          </button>
        </div>
      </div>
    </div>
  );
};

export default CatCard;

