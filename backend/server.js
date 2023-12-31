const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const axios = require('axios');
const cors = require('cors');
app.use(cors());
mongoose.set('debug', true);

// set the listening port number to the environment port if it exists, otherwise 5000
const PORT = process.env.PORT || 5000;
//set icon names
const coinNames = ["Aave", "BinanceCoin",
  "Bitcoin", "Cardano", "ChainLink", "Cosmos", "CryptocomCoin", "Dogecoin",
  "EOS", "Ethereum", "Iota", "Litecoin", "Monero", "NEM", "Polkadot", "Solana",
  "Stellar", "Tether", "Tron", "USDCoin", "Uniswap", "WrappedBitcoin", "XRP"]


//Connect to MongoDB using mongoose
mongoose.connect('mongodb+srv://VincentNg:WuYinghong.0323@marketdata.j3apuea.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('Cannot connect to MongoDB'));

//define the schema of data retrieved
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

//define model for each coin
coinNames.forEach(coinName => {
  const collectionName = `marketData.${coinName}`; 
  coinModels[coinName] = mongoose.model(coinName, schema, collectionName);
});


// Serve static files from the React 
app.use(express.static(path.join(__dirname, 'build')));

//push the home page of the web as the default page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

//listen on the port number
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//fetch data from MongoDB
async function fetchDataFromCollection(collectionName, page, limit) {
  //set configure information
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

  //use axios to fetch data
  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from collection ${collectionName}:`, error);
    throw error;
  }
}


// Preloaded data variable
let preloadedData = {};

// Function to preload data as it will be a long waiting time if the data gets fetched when the user goes to the website
async function preloadData() {
  try {
    for (const coinName of coinNames) {
      let coinData = [];
      //get data from MongoDB
      // There is some problem with the data retrieval method, it can only get 1000 documents in one run
      // so I decided to retrieve 500 documents per run, 6 times for to the full sets of data
      for (let page = 1; page <= 6; page++) {
        const data = await fetchDataFromCollection(coinName, page, 500);
        coinData.push(...data.documents);
        if (data.documents.length < 500) break;
      }

      //sort data on date
      coinData.sort((a, b) => new Date(b.Date) - new Date(a.Date));

      //calculate change for each time range
      const oneDayChange = calculateChange(coinData, 1);
      const sevenDayChange = calculateChange(coinData, 7);
      const oneMonthChange = calculateChange(coinData, 30);

      //set today's data if it exists, otherwise set it to empty set
      const todayData = coinData[0] || {};

      //set preloaded data
      preloadedData[coinName] = {
        name: coinName,
        price: todayData.Close?.toFixed(2) || 'N/A',
        oneDay: oneDayChange,
        sevenDay: sevenDayChange,
        oneMonth: oneMonthChange,
        oneDayVolume: todayData.Volume?.toFixed(2) || 'N/A',
        marketCap: todayData.Marketcap?.toFixed(2) || 'N/A'
      };
    }
  } catch (err) {
    console.error('Error preloading data:', err);
  }
}

// Preload data when the server starts
preloadData();

//handle the home page request
app.get('/api/all-data', (req, res) => {
  res.json(preloadedData);
});

//calculate data change based on different time range
function calculateChange(data, daysBack) {
  if (data.length <= daysBack) return 'N/A'; // Not enough data
  const todayClose = data[0]?.Close;
  const pastClose = data[daysBack]?.Close;

  if (!todayClose || !pastClose) return 'N/A'; // Handle missing data

  const difference = todayClose - pastClose;
  return ((difference / pastClose) * 100).toFixed(2) + '%';
}

//handle request for a specific data page
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

    // ensure coinData is sorted by date in descending order
    coinData.sort((a, b) => new Date(b.Date) - new Date(a.Date));

    // extract the data based on the time range
    const filteredData = filterDataByTimeRange(coinData, timeRange);

    // calculate percentage changes for various intervals
    const percentageChanges = calculatePercentageChanges(coinData, filteredData[0]?.Close);

    // prepare response data
    const responseData = {
      name: name,
      symbol: filteredData[0]?.Symbol || 'N/A',
      high: coinData[0].High,
      low: coinData[0].Low,
      history: filteredData.map(d => ({ date: d.Date, price: d.Close })),
      ...percentageChanges
    };

    res.json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

//filter out data of a time range
function filterDataByTimeRange(data, timeRange) {
  let startDate = new Date();
  switch (timeRange) {
    case '7days':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case '1month':
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case '3months':
      startDate.setMonth(startDate.getMonth() - 3);
      break;
    case '1year':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    case 'all':
      return data; // Return all data if 'all' is selected
  }
  return data.filter(d => new Date(d.Date) >= startDate);
}

//calculate the percentage of the price change for various intervals
function calculatePercentageChanges(data, latestPrice) {
  const intervals = [1, 7, 14, 30, 180, 365]; // Days for 1d, 7d, 14d, 30d, 180d, 1y
  const changes = {};

  intervals.forEach(days => {
    const pastDate = new Date(data[0].Date);
    pastDate.setDate(pastDate.getDate() - days);
    const pastData = data.find(d => new Date(d.Date) <= pastDate);

    //do calculation if there is a past data, otherwise set it to N/A
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