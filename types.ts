export type Constitution = string;
export type Season = '春季' | '夏季' | '秋季' | '冬季';

export interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string;
}

export interface DietaryPlan {
  generalAdvice: string;
  recommendedFoods: string[]; // Reverted to string[]
  avoidFoods: string[];
  sampleRecipes: Recipe[];
}
