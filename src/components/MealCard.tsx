import { MealSummary } from '../api/mealsApi';

const PLACEHOLDER = 'https://via.placeholder.com/800x450?text=No+image';

interface Props {
  meal: MealSummary;
  onSelect: (id: string) => void;
}

const MealCard = ({ meal, onSelect }: Props) => (
  <div className="card-item meal-card" onClick={() => onSelect(meal.idMeal)}>
    <img
      className="card-media"
      src={meal.strMealThumb || PLACEHOLDER}
      alt={meal.strMeal}
      loading="lazy"
      onError={(event) => {
        const target = event.currentTarget;
        if (target.src !== PLACEHOLDER) {
          target.src = PLACEHOLDER;
        }
      }}
    />
    <div className="meal-title">{meal.strMeal}</div>
  </div>
);

export default MealCard;

