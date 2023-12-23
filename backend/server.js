const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const axios = require('axios');

const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//data retrieval

var data = JSON.stringify({
  "collection": "Aave", // Replace with your collection name
  "database": "marketData",
  "dataSource": "MarketData", // Replace with your data source name
  // Add filter, projection, or other query parameters as needed
});

var config = {
  method:'post',
  url:'https://ap-southeast-2.aws.data.mongodb-api.com/app/data-lprtk/endpoint/data/v1/action/findOne',
  headers:{
    'Content-Type': 'application/json',
    'Access-Control-Request-Headers': '*',
    'api-key':'2a5hDQ4H4p2afXy2szfBADHUeSdBRo2b5o597wmKQX25d5A7243DY0ddgscyhd53',
  },
  data: data
};

axios(config)
    .then(function (response) {
        console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
        console.log(error);
    });


const coinNames = ["Aave","BinanceCoin",
"Bitcoin","Cardano", "ChainLink","Cosmos","CryptocomCoin","Dogecoin",
"EOS","Ethereum","Iota","Litecoin","Monero","NEM", "Polkadot", "Solana",
"Stellar","Tether","Tron","USDCoin","Uniswap","WrappedBitcoin","XRP"]