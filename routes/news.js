const express = require('express');
const router = express.Router();
const { getNewsData } = require('../newsDataAPI'); 

// Route for news page
router.get('/news', async (req, res) => {
  const query = 'technology'; s
  
  try {
    const newsData = await getNewsData(query);
    res.render('news', { news: newsData });
  } catch (err) {
    console.error("Error fetching news data:", err);
    res.status(500).send("Error fetching news data");
  }
});

module.exports = router;
