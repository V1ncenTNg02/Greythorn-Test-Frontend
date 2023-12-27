//Created 23/12/2023 by Yingwang Ng
//Sticky navbar at the top of the page
// Nav.js
export default function NavBar({ onSearch }) {
  return (
      <div id="navBar">
          <div id="navTitle">Market Place</div>
          <input
              type="text"
              placeholder="Search..."
              onChange={(e) => onSearch(e.target.value)}
          />
      </div>
  );
}
