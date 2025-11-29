import { safeFetch } from './http';

const BASE = 'https://www.themealdb.com/api/json/v1/1';

export interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export interface MealDetail extends MealSummary {
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strSource?: string;
  strYoutube?: string;
  [key: string]: string | undefined;
}

type MealsResponse<T = MealSummary> = {
  meals: T[] | null;
};

export const MEAL_CATEGORIES = [
  'Beef',
  'Breakfast',
  'Chicken',
  'Dessert',
  'Goat',
  'Lamb',
  'Miscellaneous',
  'Pasta',
  'Pork',
  'Seafood',
  'Side',
  'Starter',
  'Vegan',
  'Vegetarian',
] as const;

export const MEAL_AREAS = [
  'American',
  'British',
  'Canadian',
  'Chinese',
  'Croatian',
  'Dutch',
  'Egyptian',
  'Filipino',
  'French',
  'Greek',
  'Indian',
  'Irish',
  'Italian',
  'Jamaican',
  'Japanese',
  'Kenyan',
  'Malaysian',
  'Mexican',
  'Moroccan',
  'Polish',
  'Portuguese',
  'Russian',
  'Spanish',
  'Syrian',
  'Thai',
  'Tunisian',
  'Turkish',
  'Ukrainian',
  'Uruguayan',
  'Vietnamese',
] as const;

export async function searchMeals(query: string): Promise<MealSummary[]> {
  const data = await safeFetch<MealsResponse>(`${BASE}/search.php?s=${encodeURIComponent(query)}`);
  return data.meals ?? [];
}

export async function fetchRandomMeal(): Promise<MealSummary[]> {
  const data = await safeFetch<MealsResponse>(`${BASE}/random.php`);
  return data.meals ?? [];
}

export async function filterMeals(params: {
  category?: string;
  area?: string;
}): Promise<MealSummary[]> {
  const searchParams = new URLSearchParams();
  if (params.category) searchParams.set('c', params.category);
  if (params.area) searchParams.set('a', params.area);

  const data = await safeFetch<MealsResponse>(
    `${BASE}/filter.php?${searchParams.toString()}`,
  );
  return data.meals ?? [];
}

export async function fetchMealDetails(id: string): Promise<MealDetail | null> {
  const data = await safeFetch<MealsResponse<MealDetail>>(`${BASE}/lookup.php?i=${id}`);
  return data.meals && data.meals[0] ? data.meals[0] : null;
}

