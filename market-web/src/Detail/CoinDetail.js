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

    const coins = ["Aave", "BinanceCoin", "Bitcoin", "Cardano", "ChainLink", "Cosmos", "CryptocomCoin", "Dogecoin", "EOS", "Ethereum", "Iota", "Litecoin", "Monero", "NEM", "Polkadot", "Solana", "Stellar", "Tether", "Tron", "USDCoin", "Uniswap", "WrappedBitcoin", "XRP"];

    useEffect(() => {
        fetch(`http://localhost:5000/api/coin/${name}?timeRange=7days`)
            .then(response => response.json())
            .then(data => setCoinData(data))
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

    const prepareChartData = (history) => {
        const chartLabels = history.map(item => item.date.split(' ')[0]); // Extract just the date part
        const chartData = history.map(item => item.price);
    
        return {
            labels: chartLabels.reverse(), // Reverse to show the earliest date first
            datasets: [
                {
                    label: 'Price',
                    data: chartData.reverse(), // Reverse to match the labels order
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }
            ]
        };
    };

    return (
        <div id="detailSection">
            <Nav onSearch={(term) => setSearchTerm(term)} />
            {searchTerm && filteredResults.length > 0 && (
                <div className="dropdown" ref={dropdownRef}>
                    {filteredResults.map(coin => (
                        <div key={coin} className="dropdown-item">
                            <Link to={`/coin/${coin}`}>
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
                            <p id="Name">{name}</p>
                            <p id="Symbol">{coinData.symbol}</p>
                        </div>
                        <div id="priceSection">
                            <p id="Price">{coinData.history[0].price}</p>
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
            <div id="chartSection">
                {/* <div id="chartContainer">
                    <header></header>
                    <div id="condition"></div>
                    <figure id="chart"></figure>
                    <div id="timeSpan"></div>
                </div> */}
                <div id="chartSection">
                    <div id='conditions'>
                        <button>7days</button>
                        <button>1month</button>
                        <button>3months</button>
                        <button>1year</button>
                    </div>
                    {coinData && (
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
