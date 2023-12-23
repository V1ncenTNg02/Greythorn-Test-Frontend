//Created 23/12/2023 by Yingwang Ng
//Sticky navbar at the top of the page
import React from 'react'

export default function nav({onSearch}) {
  return (
    <div id = "navBar">
      <div id = "navTitle">
        Market Place
      </div>
      {/* <div id = "navLinks">

      </div> */}
      <input
        type="text"
        placeholder="Search..."
        onChange={(e) => onSearch(e.target.value)}
        />
    </div>
  )
}
