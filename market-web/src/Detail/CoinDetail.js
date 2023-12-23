import React from 'react'

export default function CoinDetail() {
  return (
    <div id = "detailSection">
        <div id = "infoSection">
            <div id = "coinImage">
                <h2 id = "Name"></h2>
                <h3 id = "Symbol"></h3>
            </div>
            <div id = "priceSection">
                <p id = "Price"></p>
                <p id = "priceChange"></p>
            </div>
            <figure id = "range">

            </figure>
        </div>
            <div id = "chartSection">
                <div id = "chartContainer">
                <header></header>
                <div id = "condition"></div>
                <figure id = "chart"></figure>
                <div id = "timeSpan"></div>
            </div>
            <div id = "changeTable"></div>
        </div>
        
    </div>
  )
}
