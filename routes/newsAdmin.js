const express = require('express');
const router = express.Router();
const { getNewsData } = require('../newsDataAPI'); 


router.get('/newsAdmin', async (req, res) => {
  const query = 'technology';
  
  try {
    const newsData = await getNewsData(query);
    res.render('newsAdmin', { news: newsData });
  } catch (err) {
    console.error("Error fetching news data:", err);
    res.status(500).send("Error fetching news data");
  }
});

module.exports = router;
