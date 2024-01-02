import React from 'react';
import './style.css';
import { BrowserRouter, Routes, Route} from "react-router-dom";

import Home from './Home/Home';
import CoinDetail from './Detail/CoinDetail';


function App() {
  
  return (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/coin/:name" element={<CoinDetail />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App;
