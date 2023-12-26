const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const axios = require('axios');
const cors = require('cors');
app.use(cors());
mongoose.set('debug', true);

const PORT = process.env.PORT || 5000;
const coinNames = ["Aave", "BinanceCoin",
  "Bitcoin", "Cardano", "ChainLink", "Cosmos", "CryptocomCoin", "Dogecoin",
  "EOS", "Ethereum", "Iota", "Litecoin", "Monero", "NEM", "Polkadot", "Solana",
  "Stellar", "Tether", "Tron", "USDCoin", "Uniswap", "WrappedBitcoin", "XRP"]


//Connect to MongoDB
mongoose.connect('mongodb+srv://VincentNg:WuYinghong.0323@marketdata.j3apuea.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('Cannot connect to MongoDB'));


const schema = new mongoose.Schema({
  SNo: Number,
  Name: String,
  Symbol: String,
  Date: String,
  High: Number,
  Low: Number,
  Open: Number,
  Close: Number,
  Volume: Number,
  Marketcap: Number
});

const coinModels = {};

coinNames.forEach(coinName => {
  const collectionName = `marketData.${coinName}`; 
  coinModels[coinName] = mongoose.model(coinName, schema, collectionName);
});

// const myModel = mongoose.model('Aave', schema,'Aave');

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


async function fetchDataFromCollection(collectionName, page, limit) {
  const config = {
    method: 'post',
    url: 'https://ap-southeast-2.aws.data.mongodb-api.com/app/data-lprtk/endpoint/data/v1/action/find',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Request-Headers': '*',
      'api-key': '2a5hDQ4H4p2afXy2szfBADHUeSdBRo2b5o597wmKQX25d5A7243DY0ddgscyhd53',
    },
    data: JSON.stringify({
      collection: collectionName,
      database: "marketData",
      dataSource: "MarketData",
      limit: limit,
      skip: (page - 1) * limit
    })
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from collection ${collectionName}:`, error);
    throw error;
  }
}

app.get('/api/all-data', async (req, res) => {
  try {
    const allData = {};
    const limit = 500; // Max documents per request
    const maxPages = 6; // Assuming 3000 documents per collection

    for (const coinName of coinNames) {
      let coinData = [];
      for (let page = 1; page <= maxPages; page++) {
        const data = await fetchDataFromCollection(coinName, page, limit);
        coinData.push(...data.documents);

        // Break if less than limit documents are returned (no more pages)
        if (data.documents.length < limit) {
          break;
        }
      }

      // Process data for each coin
      // Ensure coinData is sorted by date in descending order
      coinData.sort((a, b) => new Date(b.Date) - new Date(a.Date));

      // Calculate percentage changes
      const oneDayChange = calculateChange(coinData, 1);
      const sevenDayChange = calculateChange(coinData, 7);
      const oneMonthChange = calculateChange(coinData, 30);

      // Extract today's data for price, volume, and market cap
      const todayData = coinData[0] || {};

      // Add formatted data for each coin
      allData[coinName] = {
        name: coinName,
        price: todayData.Close?.toFixed(2) || 'N/A',
        oneDay: oneDayChange,
        sevenDay: sevenDayChange,
        oneMonth: oneMonthChange,
        oneDayVolume: todayData.Volume?.toFixed(2) || 'N/A',
        marketCap: todayData.Marketcap?.toFixed(2) || 'N/A'
      };
    }

    res.json(allData);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Error retrieving data');
  }
});

function calculateChange(data, daysBack) {
  if (data.length <= daysBack) return 'N/A'; // Not enough data
  const todayClose = data[0]?.Close;
  const pastClose = data[daysBack]?.Close;

  if (!todayClose || !pastClose) return 'N/A'; // Handle missing data

  const difference = todayClose - pastClose;
  return ((difference / pastClose) * 100).toFixed(2) + '%';
}

app.get('/api/coin/:name', async (req, res) => {
  const { name } = req.params;
  const { timeRange } = req.query; // timeRange can be '7days', '1month', or '1year'
  const limit = 500; // Max documents per request
  const maxPages = 6; // Assuming 3000 documents per collection
  
  try {
    let coinData = [];
    for (let page = 1; page <= maxPages; page++) {
      const data = await fetchDataFromCollection(name, page, limit);
      coinData.push(...data.documents);

      // Break if less than limit documents are returned (no more pages)
      if (data.documents.length < limit) {
        break;
      }
    }

    // Ensure coinData is sorted by date in descending order
    coinData.sort((a, b) => new Date(b.Date) - new Date(a.Date));

    // Extract the data based on the time range
    const startDate = calculateStartDate(coinData, timeRange);
    const filteredData = coinData.filter(d => new Date(d.Date) >= startDate);

    // Calculate percentage changes for various intervals
    const percentageChanges = calculatePercentageChanges(coinData, filteredData[0]?.Close);

    // Prepare response data
    const responseData = {
      name: name,
      symbol: filteredData[0]?.Symbol || 'N/A', // Assuming symbol is in the data
      high: Math.max(...filteredData.map(d => d.High)),
      low: Math.min(...filteredData.map(d => d.Low)),
      history: filteredData.map(d => ({ date: d.Date, price: d.Close })),
      ...percentageChanges
    };

    res.json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

function calculateStartDate(data, timeRange) {
  if (!data.length) return new Date();

  const latestDate = new Date(data[0].Date);
  switch (timeRange) {
    case '7days':
      latestDate.setDate(latestDate.getDate() - 7);
      break;
    case '1month':
      latestDate.setMonth(latestDate.getMonth() - 1);
      break;
    case '1year':
      latestDate.setFullYear(latestDate.getFullYear() - 1);
      break;
    default:
      latestDate.setDate(latestDate.getDate() - 7); // Default to 7 days
  }
  return latestDate;
}

function calculatePercentageChanges(data, latestPrice) {
  const intervals = [1, 7, 14, 30, 180, 365]; // Days for 1d, 7d, 14d, 30d, 180d, 1y
  const changes = {};

  intervals.forEach(days => {
    const pastDate = new Date(data[0].Date);
    pastDate.setDate(pastDate.getDate() - days);
    const pastData = data.find(d => new Date(d.Date) <= pastDate);

    if (pastData) {
      const pastPrice = pastData.Close;
      const percentageChange = ((latestPrice - pastPrice) / pastPrice) * 100;
      changes[`${days}dChange`] = percentageChange.toFixed(2) + '%';
    } else {
      changes[`${days}dChange`] = 'N/A';
    }
  });

  return changes;
}