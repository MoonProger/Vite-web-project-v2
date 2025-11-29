import { FormEvent, useEffect, useState } from 'react';
import MealCard from '../components/MealCard';
import Modal from '../components/Modal';
import {
  MEAL_AREAS,
  MEAL_CATEGORIES,
  MealDetail,
  MealSummary,
  fetchMealDetails,
  fetchRandomMeal,
  filterMeals,
  searchMeals,
} from '../api/mealsApi';

const MealsPage = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [area, setArea] = useState('');
  const [meals, setMeals] = useState<MealSummary[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalMeal, setModalMeal] = useState<MealDetail | null>(null);

  const runSearch = async (searchTerm: string) => {
    setLoading(true);
    setMessage('Loading...');
    try {
      const items = await searchMeals(searchTerm);
      setMeals(items);
      setMessage(items.length ? '' : 'Nothing found.');
    } catch (error) {
      console.error(error);
      setMessage('Не удалось загрузить рецепты');
    } finally {
      setLoading(false);
    }
  };

  const runFilters = async (nextCategory: string, nextArea: string) => {
    if (!nextCategory && !nextArea) {
      return runSearch('');
    }
    setLoading(true);
    setMessage('Loading...');
    try {
      const items = await filterMeals({ category: nextCategory, area: nextArea });
      setMeals(items);
      setMessage(items.length ? '' : 'Nothing found.');
    } catch (error) {
      console.error(error);
      setMessage('Не удалось загрузить рецепты');
    } finally {
      setLoading(false);
    }
  };

  const handlePopular = (event?: FormEvent) => {
    if (event) event.preventDefault();
    runSearch(query.trim());
  };

  const handleRandom = async () => {
    setLoading(true);
    setMessage('Loading...');
    try {
      const items = await fetchRandomMeal();
      setMeals(items);
      setMessage('');
    } catch (error) {
      console.error(error);
      setMessage('Не удалось загрузить рецепт');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setArea('');
    setQuery('');
    runFilters(value, '');
  };

  const handleAreaChange = (value: string) => {
    setArea(value);
    setCategory('');
    setQuery('');
    runFilters('', value);
  };

  const openMeal = async (id: string) => {
    try {
      const detail = await fetchMealDetails(id);
      if (detail) setModalMeal(detail);
    } catch (error) {
      console.error(error);
      alert('Не удалось открыть рецепт');
    }
  };

  const closeModal = () => setModalMeal(null);

  useEffect(() => {
    runSearch('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderModalContent = () => {
    if (!modalMeal) return null;
    const ingredients: string[] = [];
    for (let i = 1; i <= 20; i += 1) {
      const ing = modalMeal[`strIngredient${i}`];
      const measure = modalMeal[`strMeasure${i}`];
      if (ing?.trim()) {
        ingredients.push(`${ing} — ${measure || ''}`);
      }
    }
    return (
      <>
        <h2>{modalMeal.strMeal}</h2>
        <img src={modalMeal.strMealThumb} alt={modalMeal.strMeal} />
        <p>
          <strong>Category:</strong> {modalMeal.strCategory || '—'} —{' '}
          <strong>Country:</strong> {modalMeal.strArea || '—'}
        </p>
        <h3>Ingredients</h3>
        <ul>
          {ingredients.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h3>Instructions</h3>
        <p style={{ whiteSpace: 'pre-wrap' }}>{modalMeal.strInstructions}</p>
        {modalMeal.strSource && (
          <p>
            Source:{' '}
            <a href={modalMeal.strSource} target="_blank" rel="noreferrer">
              {modalMeal.strSource}
            </a>
          </p>
        )}
        {modalMeal.strYoutube && (
          <p>
            Video:{' '}
            <a href={modalMeal.strYoutube} target="_blank" rel="noreferrer">
              {modalMeal.strYoutube}
            </a>
          </p>
        )}
      </>
    );
  };

  return (
    <section className="card">
      <header className="header">
        <h1>Cook, taste, repeat.</h1>
      </header>

      <form className="search-row" onSubmit={handlePopular}>
        <input
          className="input"
          placeholder="Find recipe by name"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <select
          className="input"
          value={category}
          onChange={(event) => handleCategoryChange(event.target.value)}
        >
          <option value="">All categories</option>
          {MEAL_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          className="input"
          value={area}
          onChange={(event) => handleAreaChange(event.target.value)}
        >
          <option value="">All areas</option>
          {MEAL_AREAS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <button type="submit" disabled={loading}>
          Popular
        </button>
        <button type="button" onClick={handleRandom} disabled={loading}>
          Random recipe
        </button>
      </form>

      <div className="small">{message}</div>

      <div className="grid meal-grid">
        {meals.map((meal) => (
          <MealCard key={meal.idMeal} meal={meal} onSelect={openMeal} />
        ))}
      </div>

      {modalMeal && <Modal onClose={closeModal}>{renderModalContent()}</Modal>}
    </section>
  );
};

export default MealsPage;

