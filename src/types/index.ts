/**
 * TypeScript interfaces for Liqma app
 * Matching Mongoose Backend Plans
 */

export type Category = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Dessert' | 'Drinks';

export interface UserProfile {
  id: string;
  username: string;
  avatarUrl: string;
  followers: number;
  following: number;
  avgRating: number;
}

export interface Macros {
  calories: number;
  protein: number; // in grams
  carbs: number;
  fats: number;
}

export interface Recipe {
  id: string;
  title: string;
  author: UserProfile;
  imageUrl: string;
  category: Category;
  rating: number; // 1-5
  likes: number;
  macros: Macros;
  tags: string[]; // e.g., 'Dairy-Free', 'Vegan'
  timestamp: Date;
  description?: string;
  ingredients?: string[];
  instructions?: string[];
  prepTime?: number; // in minutes
  cookTime?: number; // in minutes
  servings?: number;
}

// Legacy types for backward compatibility (if needed)
export interface User {
  id: string;
  username: string;
  displayName: string;
  profilePicture?: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  averageRating: number;
}

export type DietaryRestriction =
  | 'Dairy-Free'
  | 'Nut-Free'
  | 'Vegan'
  | 'Vegetarian'
  | 'Gluten-Free'
  | 'Keto'
  | 'Halal'
  | 'Kosher';

export interface CategoryFeed {
  category: Category;
  recipes: Recipe[];
}


