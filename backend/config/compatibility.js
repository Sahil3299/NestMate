const weights = {
  food: 20,
  smoking: 15,
  drinking: 15,
  sleep: 15,
  cleanliness: 10,
  pets: 10,
  workFromHome: 10,
  occupation: 5,
};

const foodValues = ['veg', 'non-veg', 'vegan', 'eggetarian'];
const sleepValues = ['early-bird', 'night-owl', 'flexible'];
const cleanlinessValues = ['very-tidy', 'moderate', 'messy'];

module.exports = { weights, foodValues, sleepValues, cleanlinessValues };
