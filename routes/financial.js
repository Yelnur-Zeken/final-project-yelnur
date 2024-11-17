const express = require('express');
const router = express.Router();
const { getFinancialData } = require('../financialDataAPI');  


router.get('/financial', async (req, res) => {
  const symbol = 'AAPL';  
  
  try {
    const financialData = await getFinancialData(symbol);
    const timeSeries = Object.entries(financialData).map(([time, data]) => ({
      time,
      close: parseFloat(data['4. close']),
    }));

    res.render('financial', { financialData: timeSeries });
  } catch (err) {
    res.status(500).send("Error fetching financial data");
  }
});

module.exports = router; 