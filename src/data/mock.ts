import { Recipe, Category, UserProfile } from '../types';

/**
 * Mock data for development and testing
 * Matching demo.tsx structure
 */

export const CURRENT_USER: UserProfile = {
  id: 'u1',
  username: 'Ahmed_Cooks',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
  followers: 1205,
  following: 45,
  avgRating: 4.8
};

const MOCK_USERS: UserProfile[] = [
  { id: 'u2', username: 'SarahFit', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', followers: 890, following: 120, avgRating: 4.5 },
  { id: 'u3', username: 'KetoKing', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=King', followers: 3400, following: 10, avgRating: 4.9 },
  { id: 'u4', username: 'VeganVibes', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vegan', followers: 560, following: 500, avgRating: 4.2 },
];

const RECIPE_IMAGES = [
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
];

const RECIPE_DETAILS = [
  {
    description: "A healthy and delicious breakfast that will keep you energized all morning. Packed with protein and fresh ingredients.",
    ingredients: [
      "2 large eggs",
      "1/2 cup fresh spinach",
      "1/4 cup feta cheese, crumbled",
      "1 tbsp olive oil",
      "Salt and pepper to taste",
      "1 slice whole grain bread, toasted",
      "1 tbsp butter"
    ],
    instructions: [
      "Heat olive oil in a non-stick pan over medium heat",
      "Add spinach and cook until wilted, about 2 minutes",
      "Whisk eggs with salt and pepper in a bowl",
      "Pour eggs into the pan and scramble gently",
      "When eggs are almost set, add feta cheese and mix",
      "Serve hot with toasted bread and butter on the side"
    ],
    prepTime: 5,
    cookTime: 10,
    servings: 1
  },
  {
    description: "A refreshing and nutritious lunch bowl with quinoa, fresh vegetables, and a tangy lemon dressing. Perfect for a light yet satisfying meal.",
    ingredients: [
      "1 cup cooked quinoa",
      "1/2 cup cherry tomatoes, halved",
      "1/2 cucumber, diced",
      "1/4 cup red onion, thinly sliced",
      "2 tbsp olive oil",
      "1 tbsp fresh lemon juice",
      "Fresh herbs (parsley, mint), chopped",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Cook quinoa according to package instructions and let cool",
      "Dice vegetables and mix together in a large bowl",
      "Whisk olive oil and lemon juice together for the dressing",
      "Combine cooled quinoa with vegetables",
      "Drizzle dressing over the mixture and toss well",
      "Garnish with fresh herbs and season with salt and pepper"
    ],
    prepTime: 10,
    cookTime: 15,
    servings: 2
  },
  {
    description: "A hearty dinner that's both satisfying and healthy. Perfect for a cozy evening meal with tender chicken and crisp vegetables.",
    ingredients: [
      "1 lb chicken breast, cut into strips",
      "2 cups mixed vegetables (bell peppers, broccoli, carrots)",
      "1 cup brown rice, cooked",
      "2 cloves garlic, minced",
      "1 tbsp soy sauce",
      "1 tsp fresh ginger, grated",
      "2 tbsp vegetable oil",
      "Green onions for garnish"
    ],
    instructions: [
      "Cook brown rice according to package instructions",
      "Cut chicken into thin strips and season with salt",
      "Heat oil in a large pan over high heat",
      "Cook chicken until golden and cooked through, about 6-8 minutes",
      "Add garlic and ginger, stir for 30 seconds",
      "Add vegetables and stir-fry for 4-5 minutes until crisp-tender",
      "Season with soy sauce and toss everything together",
      "Serve over rice and garnish with green onions"
    ],
    prepTime: 15,
    cookTime: 20,
    servings: 3
  },
  {
    description: "A quick and healthy snack perfect for between meals. High in protein and fiber, this parfait will keep you satisfied.",
    ingredients: [
      "1/2 cup Greek yogurt",
      "1/4 cup granola",
      "1/2 cup mixed berries (strawberries, blueberries, raspberries)",
      "1 tbsp honey",
      "1 tbsp chia seeds"
    ],
    instructions: [
      "Layer half of the Greek yogurt in a glass or bowl",
      "Add a layer of granola on top",
      "Add fresh berries",
      "Top with remaining yogurt",
      "Drizzle with honey",
      "Sprinkle chia seeds on top",
      "Enjoy immediately or refrigerate for up to 2 hours"
    ],
    prepTime: 5,
    cookTime: 0,
    servings: 1
  },
  {
    description: "A refreshing and energizing drink perfect for any time of day. Packed with vitamins and natural flavors.",
    ingredients: [
      "1 cup fresh orange juice",
      "1/2 cup sparkling water",
      "1 tbsp fresh lemon juice",
      "1 tsp honey",
      "Fresh mint leaves",
      "Ice cubes"
    ],
    instructions: [
      "Pour orange juice into a glass",
      "Add sparkling water and lemon juice",
      "Stir in honey until dissolved",
      "Add ice cubes and fresh mint leaves",
      "Garnish with a slice of orange",
      "Serve immediately and enjoy"
    ],
    prepTime: 5,
    cookTime: 0,
    servings: 1
  }
];

const generateRecipes = (count: number): Recipe[] => {
  return Array.from({ length: count }).map((_, i) => {
    const detailIndex = i % RECIPE_DETAILS.length;
    const details = RECIPE_DETAILS[detailIndex];
    
    return {
      id: `r${i}`,
      title: `Delicious Liqma ${i + 1}`,
      author: MOCK_USERS[i % MOCK_USERS.length],
      imageUrl: RECIPE_IMAGES[i % RECIPE_IMAGES.length],
      category: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Drinks'][i % 5] as Category,
      rating: parseFloat((3 + Math.random() * 2).toFixed(1)),
      likes: Math.floor(Math.random() * 500),
      macros: {
        calories: 300 + Math.floor(Math.random() * 500),
        protein: 10 + Math.floor(Math.random() * 50),
        carbs: 20 + Math.floor(Math.random() * 60),
        fats: 10 + Math.floor(Math.random() * 30),
      },
      tags: Math.random() > 0.5 ? ['Dairy-Free'] : ['High-Protein'],
      timestamp: new Date(),
      description: details.description,
      ingredients: details.ingredients,
      instructions: details.instructions,
      prepTime: details.prepTime,
      cookTime: details.cookTime,
      servings: details.servings,
    };
  });
};

export const ALL_RECIPES: Recipe[] = generateRecipes(20);

/**
 * Get top 8 recipes for "Today's Liqmas" Bento Grid
 * Algorithm: Sorted by likes, but capped at max 2 recipes per category
 */
export const getTodaysLiqmas = (): Recipe[] => {
  const categoryCounts: Record<string, number> = {};
  const sorted = [...ALL_RECIPES].sort((a, b) => b.likes - a.likes);
  const selected: Recipe[] = [];

  for (const r of sorted) {
    const catCount = categoryCounts[r.category] || 0;
    if (catCount < 2 && selected.length < 8) {
      selected.push(r);
      categoryCounts[r.category] = catCount + 1;
    }
  }
  return selected;
};

/**
 * Get recipes grouped by category
 */
export const getCategoryFeeds = (): Map<Category, Recipe[]> => {
  const feeds = new Map<Category, Recipe[]>();
  
  ALL_RECIPES.forEach(recipe => {
    const existing = feeds.get(recipe.category) || [];
    feeds.set(recipe.category, [...existing, recipe]);
  });
  
  return feeds;
};

/**
 * Get a recipe by ID
 */
export const getRecipeById = (id: string): Recipe | undefined => {
  return ALL_RECIPES.find(r => r.id === id);
};


