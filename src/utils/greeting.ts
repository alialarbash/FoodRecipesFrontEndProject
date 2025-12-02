/**
 * Greeting utilities for dynamic header content
 */

const FOOD_FACTS = [
  "Honey never spoils!",
  "Bananas are berries!",
  "Salt reduces coffee bitterness",
  "Tomatoes were once poisonous",
  "Carrots were purple originally",
  "Butter spreads better warm",
  "Apples float - 25% air!",
  "Peanuts are legumes, not nuts",
  "Sugar balances tomato acidity",
  "Chocolate was once currency",
  "Pineapples take 2-3 years",
  "Cold water tames onions",
  "Oldest recipe is for beer",
  "Avocados are fruits!",
  "Lemon prevents apple browning",
  "Vanilla comes from orchids",
  "Strawberries aren't berries",
  "Ketchup was a medicine",
  "Pepper was worth gold",
  "Cheese is ancient - 4000 BC",
  "Rice feeds half the world",
  "Potatoes have more genes",
  "Corn has 800 uses",
  "Olive oil never goes bad",
  "Garlic boosts immunity",
  "Ginger soothes digestion",
  "Turmeric is anti-inflammatory",
  "Cinnamon lowers blood sugar",
  "Dark chocolate has antioxidants",
  "Green tea boosts metabolism",
  "Yogurt has probiotics",
  "Oats lower cholesterol",
  "Almonds are nutrient-dense",
  "Salmon has omega-3",
  "Spinach has iron",
  "Broccoli has vitamin C",
  "Sweet potatoes are superfoods",
  "Blueberries are superfoods",
  "Quinoa is complete protein",
  "Lentils are protein-rich",
  "Chickpeas are versatile",
  "Mushrooms have vitamin D",
  "Bell peppers have vitamin C",
  "Cucumbers are 95% water",
  "Watermelon is hydrating",
  "Oranges have vitamin C",
  "Grapes have resveratrol",
  "Apples keep doctors away",
  "Berries are antioxidant-rich",
  "Nuts are heart-healthy"
];

/**
 * Get time-based greeting
 */
export const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return 'Good Morning';
  } else if (hour >= 12 && hour < 17) {
    return 'Good Afternoon';
  } else if (hour >= 17 && hour < 21) {
    return 'Good Evening';
  } else {
    return 'Good Night';
  }
};

/**
 * Get a random food fact with label
 * Returns an object with label ("Tip" or "Fun Fact") and the fact text
 */
export const getRandomFoodFact = (): { label: 'Tip' | 'Fun Fact'; text: string } => {
  const randomIndex = Math.floor(Math.random() * FOOD_FACTS.length);
  const fact = FOOD_FACTS[randomIndex];
  
  // Randomly assign "Tip" or "Fun Fact" label
  const label = Math.random() > 0.5 ? 'Tip' : 'Fun Fact';
  
  return { label, text: fact };
};

