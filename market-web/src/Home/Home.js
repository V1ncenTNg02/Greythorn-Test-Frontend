import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import NavBar from './Nav';
import CoinTable from './coinTable';
import './home.css';

export default function Home() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);
    const dropdownRef = useRef(null);

    // Assume coins is the list of items you are searching through
    // This should come from props, context, or an API call
    const coins = ["Aave", "BinanceCoin",
    "Bitcoin", "Cardano", "ChainLink", "Cosmos", "CryptocomCoin", "Dogecoin",
    "EOS", "Ethereum", "Iota", "Litecoin", "Monero", "NEM", "Polkadot", "Solana",
    "Stellar", "Tether", "Tron", "USDCoin", "Uniswap", "WrappedBitcoin", "XRP"]

    useEffect(() => {
        if (searchTerm !== '') {
            const filtered = coins.filter(coin => 
                coin.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredResults(filtered);
        } else {
            setFilteredResults([]);
        }
    }, [searchTerm]);

    useEffect(() => {
        // Function to check if click is outside the dropdown
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
    }, []);

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
        <div>
            <NavBar onSearch={(term) => setSearchTerm(term)} />
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
            <CoinTable />
        </div>
    );
}

