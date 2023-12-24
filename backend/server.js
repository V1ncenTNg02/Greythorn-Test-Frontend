const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const axios = require('axios');

const PORT = process.env.PORT || 5000;


//Connect to MongoDB
mongoose.connect('mongodb+srv://VincentNg:WuYinghong.0323@marketdata.j3apuea.mongodb.net/?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology:true})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('Cannot connect to MongoDB'));


const schema = new mongoose.Schema({
    _id: String,
    SNo: Number,
    Symbol: String,
    Date: Date,
    High: Number,
    Low: Number,
    Open:Number,
    Close:Number,
    Volume: Number,
    Marketcap: Number
});

const coinModels = {};
coinNames.forEach(coinName => {
  coinModels[coinName] = mongoose.model(coinName, schema, coinName);
});

// const myModel = mongoose.model('Aave', schema,'Aave');

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// app.get('/api/all-data', async (req, res) => {
//   try {
//       const data = await myModel.find();
//       res.json(data);
//   } catch (err) {
//       res.status(500).send('Error retrieving data');
//   }
// });

app.get('/api/all-data', async (req, res) => {
  try {
      // Prepare an array of promises, each fetching data from a collection
      const dataPromises = Object.keys(coinModels).map(key => {
          return coinModels[key].find().then(data => {
              return { name: key, data: data };
          });
      });

      // Wait for all promises to resolve
      const results = await Promise.all(dataPromises);

      // Transform the array of results into an object
      const allData = results.reduce((acc, curr) => {
          acc[curr.name] = curr.data;
          return acc;
      }, {});

      res.json(allData);
  } catch (err) {
      res.status(500).send('Error retrieving data');
  }
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// //single retrieval



// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// //data retrieval

// var data = JSON.stringify({
//   "collection": "Aave", // Replace with your collection name
//   "database": "marketData",
//   "dataSource": "MarketData", // Replace with your data source name
//   // Add filter, projection, or other query parameters as needed
// });

// var config = {
//   method:'post',
//   url:'https://ap-southeast-2.aws.data.mongodb-api.com/app/data-lprtk/endpoint/data/v1/action/findOne',
//   headers:{
//     'Content-Type': 'application/json',
//     'Access-Control-Request-Headers': '*',
//     'api-key':'2a5hDQ4H4p2afXy2szfBADHUeSdBRo2b5o597wmKQX25d5A7243DY0ddgscyhd53',
//   },
//   data: data
// };

// axios(config)
//     .then(function (response) {
//         console.log(JSON.stringify(response.data));
//     })
//     .catch(function (error) {
//         console.log(error);
//     });


const coinNames = ["Aave","BinanceCoin",
"Bitcoin","Cardano", "ChainLink","Cosmos","CryptocomCoin","Dogecoin",
"EOS","Ethereum","Iota","Litecoin","Monero","NEM", "Polkadot", "Solana",
"Stellar","Tether","Tron","USDCoin","Uniswap","WrappedBitcoin","XRP"]