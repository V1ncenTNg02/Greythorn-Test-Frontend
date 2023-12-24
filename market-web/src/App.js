import React, {useRef} from 'react';
import './style.css';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Home from './Home/Home';
import CoinDetail from './Detail/CoinDetail';


function App() {
  
  return (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/detail/:id" element={<CoinDetail />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App;
