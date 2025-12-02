/**
 * Greeting utilities for dynamic header content
 */

const FOOD_FACTS = [
  "Did you know? Honey never spoils!",
  "Fun fact: Bananas are berries, but strawberries aren't!",
  "Tip: Adding salt to coffee reduces bitterness",
  "Did you know? Tomatoes were once considered poisonous",
  "Fun fact: Carrots were originally purple, not orange!",
  "Tip: Room temperature butter spreads better on bread",
  "Did you know? Apples float because 25% of their volume is air",
  "Fun fact: Peanuts aren't actually nuts - they're legumes!",
  "Tip: Adding a pinch of sugar to tomato sauce balances acidity",
  "Did you know? Chocolate was once used as currency",
  "Fun fact: Pineapples take 2-3 years to grow",
  "Tip: Soaking onions in cold water reduces their pungency",
  "Did you know? The world's oldest recipe is for beer",
  "Fun fact: Avocados are fruits, not vegetables!",
  "Tip: Adding lemon juice prevents apples from browning"
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
 * Get a random food fact
 * Returns a random fact from the list
 */
export const getRandomFoodFact = (): string => {
  const randomIndex = Math.floor(Math.random() * FOOD_FACTS.length);
  return FOOD_FACTS[randomIndex];
};

