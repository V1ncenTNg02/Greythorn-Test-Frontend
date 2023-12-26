//Created 23/12/2023 by Yingwang Ng
//Sticky navbar at the top of the page
import React, { useState } from "react";

export default function Nav() {
  const [searchTerm, setSearchTerm] = useState('');

  const onSearch = (term) => {
      setSearchTerm(term);
      // You can also add more logic here, like filtering a list based on the search term
  };

  return (
    <div id = "navBar">
      <div id = "navTitle">
        Market Place
      </div>
      <input
        type="text"
        placeholder="Search..."
        onChange={(e) => onSearch(e.target.value)}
        />

      
    </div>
  )
}
