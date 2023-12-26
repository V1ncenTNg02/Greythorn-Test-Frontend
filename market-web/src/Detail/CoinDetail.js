import React, { useState, useEffect } from 'react';
import Nav from '../Home/Nav';
import { useParams, useNavigate } from 'react-router-dom';
import HomeIcon from '../resource/home.png'


export default function CoinDetail() {
    const { name } = useParams();
    const [coinData, setCoinData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:5000/api/coin/${name}?timeRange=7days`)
            .then(response => response.json())
            .then(data => setCoinData(data))
            .catch(error => console.error('Error fetching coin data:', error));
    }, [name]); // Dependency array includes 'name' to refetch if it changes

    const handleImageClick = () => {
        navigate('/');
    }


    return (
        <div id="detailSection">
            <Nav></Nav>
            <div id="infoSection">
                {coinData && ( // Check if coinData is not null before rendering
                    <>
                        <div id="coinImage">
                            <h2 id="Name">{name}</h2>
                            <h3 id="Symbol">{coinData.symbol}</h3>
                        </div>
                        <div id="priceSection">
                            <p id="Price"></p>
                            <p id="priceChange"></p>
                        </div>
                        <figure id="range">{coinData.low} {coinData.high}</figure>
                    </>
                )}
            </div>
            <div id="chartSection">
                <div id="chartContainer">
                    <header></header>
                    <div id="condition"></div>
                    <figure id="chart"></figure>
                    <div id="timeSpan"></div>
                </div>
                <div id="changeTable">

                </div>
            </div>
            <img className='homeButton' src={HomeIcon} alt='HomeIcon' onClick={() => handleImageClick()}></img>
        </div>
    );
}
