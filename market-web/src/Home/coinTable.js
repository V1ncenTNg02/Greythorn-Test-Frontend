import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '../resource/home.png';

export default function CoinTable() {
  //set states and functions
  const [coins, setCoins] = useState([]);
  const navigate = useNavigate();

  // handle click on a row
  const handleRowClick = (coinName) => {
    navigate(`/coin/${coinName}`);
  };

  //handle click on the home icon
  const handleImageClick = () => {
    navigate('/');
  }

  //change the style of data displayed according to the number
  const getPercentageChangeStyle = (change) => {
    const value = parseFloat(change);
    return {
      color: value > 0 ? 'green' : value < 0 ? 'red' : 'black',
    };
  };

  //connect to my backend server, which is deployed with the frontend web on aws elastic beanstalk
  useEffect(() => {
    fetch('http://market-backend-env.eba-k6mijpth.ap-southeast-2.elasticbeanstalk.com/api/all-data')
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
            marketCap: data[key].marketCap,
            icon: require(`../resource/icons/${key}.webp`)
          };
        });
        
        //default ordering: sort the data returned based on the market cap
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
              <td>{index + 1}</td>
              <td id='iconName'>
                <img src={coin.icon} alt={`${coin.name} icon`} className='iconImage' />
                {coin.name}
              </td>
              <td>{coin.price}</td>
              <td style={getPercentageChangeStyle(coin.oneDay)}>{coin.oneDay}</td>
              <td style={getPercentageChangeStyle(coin.sevenDay)}>{coin.sevenDay}</td>
              <td style={getPercentageChangeStyle(coin.oneMonth)}>{coin.oneMonth}</td>
              <td>{coin.oneDayVolume}</td>
              <td>{coin.marketCap}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <img className='homeButton' src={HomeIcon} alt='HomeIcon' onClick={() => handleImageClick()}></img>
    </div>
  );
}
