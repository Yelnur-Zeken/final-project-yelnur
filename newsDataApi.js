const axios = require('axios');

const getNewsData = async (query) => {
  const apiKey = '62212074d13a400eb353b6db441e6709'; // Your NewsAPI key
  const url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`;
  
  try {
    const response = await axios.get(url);
    return response.data.articles; // Returns an array of articles
  } catch (error) {
    console.error("Error fetching news data", error);
    throw new Error("Error fetching news data");
  }
};

module.exports = { getNewsData };
