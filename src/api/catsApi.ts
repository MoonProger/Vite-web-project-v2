import { safeFetch } from './http';

const CAT_API_KEY =
  'live_GXlTYKcWLzADf8G35FDutIM6GgdTToFzcWeT6nVrz2VW8WlNV1m4IyNHMCy2ujoR';
const BASE = 'https://api.thecatapi.com/v1';
const SUB_ID = 'user-123';

const defaultHeaders = {
  'x-api-key': CAT_API_KEY,
};

interface FavouriteApiResponse {
  id: number;
  image_id: string;
  image?: { url?: string };
}

export interface CatBreed {
  id: string;
  name: string;
}

export interface CatImage {
  id: string;
  url: string;
  breeds?: CatBreed[];
}

export async function fetchBreeds(): Promise<CatBreed[]> {
  const data = await safeFetch<CatBreed[]>(`${BASE}/breeds`, {
    headers: defaultHeaders,
  });
  return data ?? [];
}

export async function fetchCats(breedId = ''): Promise<CatImage[]> {
  const params = new URLSearchParams({
    limit: '30',
    size: 'med',
  });
  if (breedId) params.set('breed_ids', breedId);

  const data = await safeFetch<CatImage[]>(`${BASE}/images/search?${params.toString()}`, {
    headers: defaultHeaders,
  });
  return Array.isArray(data) ? data : [];
}

export async function fetchFavourites(): Promise<FavouriteApiResponse[]> {
  const params = new URLSearchParams({
    limit: '100',
    order: 'DESC',
    attach_image: '1',
    sub_id: SUB_ID,
  });
  const data = await safeFetch<FavouriteApiResponse[]>(
    `${BASE}/favourites?${params.toString()}`,
    {
      headers: defaultHeaders,
    },
  );
  return Array.isArray(data) ? data : [];
}

export async function addFavourite(imageId: string): Promise<number> {
  const payload = await safeFetch<{ id: number }>(`${BASE}/favourites`, {
    method: 'POST',
    headers: {
      ...defaultHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ image_id: imageId, sub_id: SUB_ID }),
  });
  return payload.id;
}

export async function removeFavourite(favouriteId: number): Promise<void> {
  await safeFetch(`${BASE}/favourites/${encodeURIComponent(String(favouriteId))}`, {
    method: 'DELETE',
    headers: defaultHeaders,
  });
}

