import React from 'react'

export default function stockTable({}) {
  return (
    <div id = "tableContainer">
      <table id = "coinTable">
        <thead>
          <tr id = "tableHead">
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
          {stock.map((stock) => (
            <tr key={stock.name} className='tableRow'>
                <td>{stock.index}</td>
                <td>{stock.name}</td>
                <td>{stock.price}</td>
                <td>{stock.oneDay}</td>
                <td>{stock.sevenDay}</td>
                <td>{stock.oneMonth}</td>
                <td>{stock.oneDayVolume}</td>
                <td>{stock.marketCap}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


const stock = [
  {name: "Bitcoin", price: "1,000,000", oneDay: "1%", sevenDay: "2%", oneMonth: "3%", oneDayVolume: "1,000,000", marketCap: "1,000,000,000"},
  {name: "Ethereum", price: "1,000,000", oneDay: "1%", sevenDay: "2%", oneMonth: "3%", oneDayVolume: "1,000,000", marketCap: "1,000,000,000"}
]
