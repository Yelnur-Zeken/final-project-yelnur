const axios = require('axios');

const API_KEY = '578IMX66WKUN5GW7'; // Your Alpha Vantage API key
const BASE_URL = 'https://www.alphavantage.co/query';

async function getFinancialData(symbol) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_INTRADAY',
        symbol: symbol,
        interval: '60min',
        apikey: API_KEY,
      },
    });

    const data = response.data['Time Series (60min)'];
    if (!data) {
      throw new Error('No data returned from Alpha Vantage API');
    }
    return data;
  } catch (err) {
    console.error('Error fetching financial data:', err.message);
    throw err;
  }
}

module.exports = { getFinancialData };
