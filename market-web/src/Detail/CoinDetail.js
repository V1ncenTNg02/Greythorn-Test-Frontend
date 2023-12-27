import React, { useState, useEffect, useRef } from 'react';
import Nav from '../Home/Nav';
import { useParams, useNavigate, Link } from 'react-router-dom';
import HomeIcon from '../resource/home.png';
import './detail.css';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

export default function CoinDetail() {
    const { name } = useParams();
    const [coinData, setCoinData] = useState(null);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);
    const dropdownRef = useRef(null);
    const [timeRange, setTimeRange] = useState('7days'); // state for selected time range
    const [allData, setAllData] = useState(null); 

    const coins = ["Aave", "BinanceCoin", "Bitcoin", "Cardano", "ChainLink", "Cosmos", "CryptocomCoin", "Dogecoin", "EOS", "Ethereum", "Iota", "Litecoin", "Monero", "NEM", "Polkadot", "Solana", "Stellar", "Tether", "Tron", "USDCoin", "Uniswap", "WrappedBitcoin", "XRP"];


    useEffect(() => {
        fetch(`http://localhost:5000/api/coin/${name}?timeRange=all`)
            .then(response => response.json())
            .then(data => {
                setCoinData(data); // Set the initially displayed data
                setAllData(data); // Store all data for later filtering
            })
            .catch(error => console.error('Error fetching coin data:', error));

        if (searchTerm !== '') {
            const filtered = coins.filter(coin => 
                coin.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredResults(filtered);
        } else {
            setFilteredResults([]);
        }

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setSearchTerm(''); // Reset search term to hide dropdown
            }
        };

        // Add event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up event listener on component unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [name, searchTerm]); // Dependency array includes 'name' and 'searchTerm'

    if (!coinData || !coinData.history || coinData.history.length === 0) {
        // Render a loading message or return null if data is not yet loaded
        return <div>Loading...</div>;
    }
    
    const handleImageClick = () => {
        navigate('/');
    }

    const calculateWidth = () => {
        if (!coinData || !coinData.low || !coinData.high || coinData.high <= 0) return 0;
        return (coinData.low / coinData.high) * 100;
    };

    const getPercentageChangeStyle = (change) => {
        const value = parseFloat(change);
        return {
          color: value > 0 ? 'green' : value < 0 ? 'red' : 'black', // green if positive, red if negative, black if zero or invalid
        };
      };

      const handleTimeRangeChange = (newTimeRange) => {
        setTimeRange(newTimeRange);
        if (allData && allData.history) {
            const filteredHistory = filterDataByTimeRange(allData.history, newTimeRange);
            setCoinData({ ...allData, history: filteredHistory });
        }
    };

    const filterDataByTimeRange = (history, selectedTimeRange) => {
        switch (selectedTimeRange) {
            case '7days':
                return history.slice(0, 7);
            case '1month':
                return history.slice(0, 30);
            case '3months':
                return history.slice(0, 90);
            case '1year':
                return history.slice(0, 365);
            default:
                return history;
        }
    };
    
    const currentPrice = coinData.history[0].price;

    const getIconPath = (coinName) => {
        try {
            return require(`../resource/icons/${coinName}.webp`);
        } catch {
            // Return a default icon or null if specific icon not found
            return null;
        }
    };



    // Function to prepare chart data based on the selected time range
    const prepareChartData = (history) => {
        const chartLabels = history.map(item => item.date.split(' ')[0]);
        const chartData = history.map(item => item.price);

        return {
            labels: chartLabels.reverse(),
            datasets: [{
                label: 'Price',
                data: chartData.reverse(),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        };
    };


    const getCoinIcon = (coinName) => {
        try {
            // Dynamically require the image based on the coin name
            return require(`../resource/icons/${coinName}.webp`);
        } catch (e) {
            // If the image does not exist, return a default image or null
            return null;
        }
    };

    
    

    return (
        <div id="detailSection">
            <Nav onSearch={(term) => setSearchTerm(term)} />
            {searchTerm && filteredResults.length > 0 && (
                <div className="dropdown" ref={dropdownRef}>
                    {filteredResults.map(coin => (
                        <div key={coin} className="dropdown-item">
                            <Link to={`/coin/${coin}`}>
                                <img 
                                    src={getCoinIcon(coin)} 
                                    alt={coin} 
                                    style={{ marginRight: '10px', width: '20px', height: '20px' }}
                                />
                                {coin}
                            </Link>
                        </div>
                    ))}
                </div>
            )}
            {searchTerm && filteredResults.length === 0 && (
                <div className="dropdown">
                    <div className="dropdown-item">No results found</div>
                </div>
            )}
            <div id="infoSection">
                {coinData && (
                    <>
                        <div id="coinName">
                        <img 
                            src={getIconPath(name)} 
                            alt={name} 
                            className='iconImage'
                        />
                            <p id="Name">{name}</p>
                            <p id="Symbol">{coinData.symbol}</p>
                        </div>
                        <div id="priceSection">
                            <p id="Price">{currentPrice}</p>
                            <p id="priceChange" style={getPercentageChangeStyle(coinData['1dChange'])}>{coinData['1dChange']}</p>
                        </div>
                        <div id="rangeBar">
                            <div style={{ 
                                height: '100%', 
                                width: `${calculateWidth()}%`, 
                                background: 'linear-gradient(to right, yellow, green)'
                            }}></div>
                        </div>
                        <div id = 'highLowContainer'>
                            <span id ='low'>{coinData?coinData.low.toFixed(2) : 'N/A'}</span>
                            <span id = 'high'>{coinData?coinData.high.toFixed(2) : 'N/A'}</span>
                        </div>
                    </>
                )}
            </div>
            <div id="chart">
                <div id="chartSection">
                    <div id='conditions'>
                        <button onClick={() => handleTimeRangeChange('7days')}>7days</button>
                        <button onClick={() => handleTimeRangeChange('1month')}>1month</button>
                        <button onClick={() => handleTimeRangeChange('3months')}>3months</button>
                        <button onClick={() => handleTimeRangeChange('1year')}>1year</button>
                    </div>
                    {coinData && coinData.history && (
                        <div id="chartContainer">
                            <Line data={prepareChartData(coinData.history)} />
                        </div>
                    )}
                </div>
                    <table id = 'changeTable'>
                        <thead>
                            <tr>
                                <th>1d</th>
                                <th>7d</th>
                                <th>14d</th>
                                <th>30d</th>
                                <th>180d</th>
                                <th>1y</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {coinData && (
                                    <>
                                    <td style={getPercentageChangeStyle(coinData['1dChange'])}>{coinData['1dChange']}</td>
                                    <td style={getPercentageChangeStyle(coinData['7dChange'])}>{coinData['7dChange']}</td>
                                    <td style={getPercentageChangeStyle(coinData['14dChange'])}>{coinData['14dChange']}</td>
                                    <td style={getPercentageChangeStyle(coinData['30dChange'])}>{coinData['30dChange']}</td>
                                    <td style={getPercentageChangeStyle(coinData['180dChange'])}>{coinData['180dChange']}</td>
                                    <td style={getPercentageChangeStyle(coinData['365dChange'])}>{coinData['365dChange']}</td>
                                    </>
                                )}
                            </tr>
                        </tbody>
                    </table>
            </div>
            <img className='homeButton' src={HomeIcon} alt='HomeIcon' onClick={() => handleImageClick()}></img>
        </div>
    );
}
