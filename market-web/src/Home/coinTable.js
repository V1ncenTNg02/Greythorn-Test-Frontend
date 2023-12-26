import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '../resource/home.png'

export default function CoinTable() {
  const [coins, setCoins] = useState([]);
  const navigate = useNavigate();

  const handleRowClick = (coinName) => {
    navigate(`/coin/${coinName}`);
  };

  const handleImageClick = () => {
    navigate('/');
  }

  useEffect(() => {
    fetch('http://localhost:5000/api/all-data')
      .then(response => response.json())
      .then(data => {
        const coinsArray = Object.keys(data).map((key) => {
          return {
            name: key,
            price: data[key].price,
            oneDay: data[key].oneDay,
            sevenDay: data[key].sevenDay,
            oneMonth: data[key].oneMonth,
            oneDayVolume: data[key].oneDayVolume,
            marketCap: data[key].marketCap
          };
        });

        // Sort the coins array based on market cap
        coinsArray.sort((a, b) => parseFloat(b.marketCap) - parseFloat(a.marketCap));

        setCoins(coinsArray);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div id="tableContainer">
      <table id="coinTable">
        <thead>
          <tr id="tableHead">
            <th>Index</th>
            <th>Name</th>
            <th>Price</th>
            <th>24h</th>
            <th>7d</th>
            <th>1m</th>
            <th>24h Volume</th>
            <th>Market Cap</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin, index) => (
            <tr key={coin.name} className='tableRow' onClick={() => handleRowClick(coin.name)}>
              <td>{index + 1}</td> {/* Use the index from map function */}
              <td>{coin.name}</td>
              <td>{coin.price}</td>
              <td>{coin.oneDay}</td>
              <td>{coin.sevenDay}</td>
              <td>{coin.oneMonth}</td>
              <td>{coin.oneDayVolume}</td>
              <td>{coin.marketCap}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <img className = 'homeButton' src={HomeIcon} alt = 'HomeIcon' onClick={() => handleImageClick( )}></img>
    </div>
  );
}
