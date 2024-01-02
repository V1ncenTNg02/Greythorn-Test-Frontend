# Market Place App

This web is a web app to show data of cryptocurrency market. It contains two pages, one home page (Home.js) for all coins, and a detail page for each coin(CoinDetail.js). There is a server (server.js) handle requests from the web page, and all data is stored in MongoDB. This app is deployed on AWS Elastic Beanstalk. Feel free to have a look at the web.

***[Link to the web](http://market-backend-env.eba-k6mijpth.ap-southeast-2.elasticbeanstalk.com/)***



**Home Page:**
![home page](/resource/HomePage.png)

**Detail Page:**
![detail page1](/resource/DetailPage1.png)
![detail page2](/resource/DetailPage.png)

## Frontend
**Tools Used: React ChartJS**

```
**Install DOM:**
npm install react-router-dom

**Install Chart.js:**
npm install --save react-chartjs-2 chart.js

**Run Frontend:**
npm run start

**Build Frontend App:**
npm run build
```


## Backend
**Tools used: Node.js Express CORS Mongoose**
```
**Initialize a new Node.js project:**
npm init -y

**Install express:**
npm install express

**Install mongoose:**
npm install mongoose

**Install axios:**
npm install axios

**Install CORS:**
npm install cors

**Run server:**
cd backend
node server.js
```



## Database
**Tools used: MongoDB**
**<pre>Database Structure:
-MarketData<br/>
     -Aave<br/>
         -Document1<br/>
    -Document2<br/>
    -...<br/>
  -BinanceCoin<br/>
    -Document1<br/>
    -Document2<br/>
    -...<br/>
  -...<br/></pre>**
