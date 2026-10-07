import foodDataset from "../data/foodDataset.json";

export type OfflineFood = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
};

const foods = foodDataset as OfflineFood[];

export const searchOfflineFood = (
  query: string
): OfflineFood[] => {
  const search = query.trim().toLowerCase();

  if (!search) {
    return [];
  }

  return foods.filter((food) =>
    food.name.toLowerCase().includes(search)
  );
};

export const getOfflineFood = (
  name: string
): OfflineFood | null => {
  const search = name.trim().toLowerCase();

  return (
    foods.find(
      (food) => food.name.toLowerCase() === search
    ) || null
  );
};

export const getOfflineFoodCount = (): number => {
  return foods.length;
};