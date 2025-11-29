import { useEffect, useMemo, useState } from 'react';
import CatCard from '../components/CatCard';
import {
  CatBreed,
  CatImage,
  addFavourite,
  fetchBreeds,
  fetchCats,
  fetchFavourites,
  removeFavourite,
} from '../api/catsApi';

interface FavouriteCache {
  list: CatImage[];
  map: Map<string, number>;
}

const PLACEHOLDER = 'https://via.placeholder.com/800x450?text=No+image';

const CatsPage = () => {
  const [breeds, setBreeds] = useState<CatBreed[]>([]);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [cats, setCats] = useState<CatImage[]>([]);
  const [favMap, setFavMap] = useState<Map<string, number>>(new Map());
  const [showFavourites, setShowFavourites] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const updateFavourites = (items: Awaited<ReturnType<typeof fetchFavourites>>): FavouriteCache => {
    const nextMap = new Map<string, number>();
    const list: CatImage[] = items.map((item) => ({
      id: item.image_id,
      url: item.image?.url || PLACEHOLDER,
    }));
    items.forEach((item) => {
      nextMap.set(item.image_id, item.id);
    });
    setFavMap(nextMap);
    return { list, map: nextMap };
  };

  const loadCats = async (breed = selectedBreed) => {
    setShowFavourites(false);
    setLoading(true);
    setMessage('Loading...');
    try {
      const [images, favourites] = await Promise.all([
        fetchCats(breed),
        fetchFavourites(),
      ]);
      updateFavourites(favourites);
      setCats(images);
      setMessage(images.length ? '' : 'Ничего не найдено.');
    } catch (error) {
      console.error(error);
      setMessage('Ошибка загрузки котиков');
    } finally {
      setLoading(false);
    }
  };

  const loadFavourites = async () => {
    setLoading(true);
    setMessage('Loading favourites...');
    try {
      const favourites = await fetchFavourites();
      const data = updateFavourites(favourites);
      setCats(data.list);
      setShowFavourites(true);
      setMessage(data.list.length ? '' : 'Favourites list is empty');
    } catch (error) {
      console.error(error);
      setMessage('Не удалось загрузить избранное');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavourite = async (imageId: string) => {
    try {
      if (favMap.has(imageId)) {
        await removeFavourite(favMap.get(imageId)!);
      } else {
        await addFavourite(imageId);
      }
      if (showFavourites) {
        await loadFavourites();
      } else {
        const favourites = await fetchFavourites();
        updateFavourites(favourites);
      }
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : 'Не удалось обновить избранное',
      );
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const [allBreeds] = await Promise.all([fetchBreeds(), loadCats('')]);
        setBreeds(allBreeds);
      } catch (error) {
        console.error(error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const listToRender = useMemo(() => cats, [cats]);

  return (
    <section className="card">
      <header className="header">
        <h1>Your daily dose of meow :3</h1>
      </header>

      <div className="search-row">
        <label htmlFor="breedSelect" className="small">
          Breed:
        </label>
        <select
          id="breedSelect"
          className="input"
          value={selectedBreed}
          onChange={(event) => {
            const value = event.target.value;
            setSelectedBreed(value);
            loadCats(value);
          }}
        >
          <option value="">All breeds</option>
          {breeds.map((breed) => (
            <option key={breed.id} value={breed.id}>
              {breed.name}
            </option>
          ))}
        </select>
        <button type="button" onClick={() => loadCats(selectedBreed)} disabled={loading}>
          New bunch of kitties
        </button>
        <button type="button" onClick={loadFavourites} disabled={loading}>
          Favourites
        </button>
      </div>

      <div className="small">{message}</div>

      <div className="grid cat-grid">
        {listToRender.map((cat) => (
          <CatCard
            key={cat.id}
            item={cat}
            isFavourite={favMap.has(cat.id)}
            onToggleFavourite={handleToggleFavourite}
          />
        ))}
      </div>
    </section>
  );
};

export default CatsPage;

