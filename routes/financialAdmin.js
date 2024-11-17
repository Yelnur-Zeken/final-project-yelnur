const express = require('express');
const router = express.Router();
const { getFinancialData } = require('../financialDataAPI');  // Import the function for fetching financial data

// Route for financial data page
router.get('/financialAdmin', async (req, res) => {
  const symbol = 'AAPL';  // Example stock symbol (Apple)
  
  try {
    const financialData = await getFinancialData(symbol);
    const timeSeries = Object.entries(financialData).map(([time, data]) => ({
      time,
      close: parseFloat(data['4. close']),
    }));

    res.render('financialAdmin', { financialData: timeSeries });
  } catch (err) {
    res.status(500).send("Error fetching financial data");
  }
});

module.exports = router; 