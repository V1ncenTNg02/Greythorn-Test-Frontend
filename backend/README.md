API Key: 2a5hDQ4H4p2afXy2szfBADHUeSdBRo2b5o597wmKQX25d5A7243DY0ddgscyhd53

Code:

var axios = require('axios');
var data = JSON.stringify({
    "collection": "<COLLECTION_NAME>",
    "database": "marketData",
    "dataSource": "MarketData",
    "projection": {
        "_id": 1
    }
});
            
var config = {
    method: 'post',
    url: 'https://ap-southeast-2.aws.data.mongodb-api.com/app/data-lprtk/endpoint/data/v1/action/findOne',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Request-Headers': '*',
      'api-key': '2a5hDQ4H4p2afXy2szfBADHUeSdBRo2b5o597wmKQX25d5A7243DY0ddgscyhd53',
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