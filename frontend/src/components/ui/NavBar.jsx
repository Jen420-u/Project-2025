/* eslint-disable react/prop-types */
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { FaShoppingCart, FaUserAlt, FaSearch, FaCaretDown } from "react-icons/fa";
import { PiSneakerFill } from "react-icons/pi";

const NavBar = ({ numCartItems }) => {
  const { isAuthenticated, setIsAuthenticated, username } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  const isProfilePage = location.pathname === "/profile";
  const isContactPage = location.pathname === "/contact"; // Hide elements on Contact Us page

  const [searchQuery, setSearchQuery] = useState("");
  const [showBrands, setShowBrands] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsAuthenticated(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  return (
    <>
      {/* Top Navbar */}
      {!isProfilePage && (
        <nav className="flex justify-between items-center bg-white py-3 px-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-2xl !text-gray-800 hover:!text-orange-500">
              <PiSneakerFill size={26} />
            </Link>
          </div>

          <div className="flex gap-4">
            <Link to="/help" className="text-sm !text-gray-700 hover:!text-orange-500">Help</Link>
            {!isAuthenticated && (
              <Link to="/login" className="text-sm !text-gray-700 hover:!text-orange-500">Log In</Link>
            )}
            <Link to="/register" className="text-sm !text-gray-700 hover:!text-orange-500">Sign In</Link>
          </div>
        </nav>
      )}

      {/* Main Header */}
      <div className="flex justify-between items-center py-4 px-6 bg-white shadow-md">
        <Link to="/" className="text-xl font-bold !text-gray-900 hover:!text-orange-500">
          Sneaks&apos;n Foot
        </Link>

        {/* Search Bar - Hidden on Profile and Contact Us Page */}
        {!isProfilePage && !isContactPage && (
          <form onSubmit={handleSearch} className="flex items-center border border-gray-300 rounded-full px-4 py-2 w-[350px]">
            <input 
              type="text" 
              placeholder="Search for sneakers..." 
              className="w-full border-none outline-none text-sm text-gray-700 bg-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="bg-gray-500 hover:bg-blue-600 text-white p-2 rounded-full flex items-center justify-center">
              <FaSearch size={18} /> 
            </button>
          </form>
        )}

        <div className="flex items-center gap-5">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="flex items-center !text-gray-800 hover:!text-orange-500">
                <FaUserAlt size={20} />
                <span className="ml-2">{`Hi ${username}`}</span>
              </Link>
              <button className="text-red-600 font-semibold hover:text-red-800" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : null}

          <Link to="/cart" className="relative !text-gray-800 hover:!text-orange-500">
            <FaShoppingCart size={26} />
            {numCartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {numCartItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Navigation Links - Hidden on Profile and Contact Us Page */}
      {!isProfilePage && !isContactPage && (
        <nav className="flex justify-center gap-6 py-3 border-t border-gray-200 bg-white relative">
          <NavLink to="/new" className={({ isActive }) => 
            `!text-gray-800 hover:!text-orange-500 ${isActive ? "border-b-2 border-orange-500" : ""}`
          }>
            New
          </NavLink>
          <NavLink to="/men" className={({ isActive }) => 
            `!text-gray-800 hover:!text-orange-500 ${isActive ? "border-b-2 border-orange-500" : ""}`
          }>
            Men
          </NavLink>
          <NavLink to="/women" className={({ isActive }) => 
            `!text-gray-800 hover:!text-orange-500 ${isActive ? "border-b-2 border-orange-500" : ""}`
          }>
            Women
          </NavLink>
          <NavLink to="/kids" className={({ isActive }) => 
            `!text-gray-800 hover:!text-orange-500 ${isActive ? "border-b-2 border-orange-500" : ""}`
          }>
            Kids
          </NavLink>

          {/* Brands Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowBrands(!showBrands)}
              className="!text-gray-800 hover:!text-orange-500 flex items-center gap-1"
            >
              Brands <FaCaretDown />
            </button>
            {showBrands && (
              <div className="absolute left-0 top-8 bg-white border rounded-lg shadow-lg py-2 w-40 z-50">
                <NavLink to="/brand/Nike" className="block px-4 py-2 hover:bg-gray-100 text-gray-800">Nike</NavLink>
                <NavLink to="/brand/Puma" className="block px-4 py-2 hover:bg-gray-100 text-gray-800">Puma</NavLink>
                <NavLink to="/brand/Adidas" className="block px-4 py-2 hover:bg-gray-100 text-gray-800">Adidas</NavLink>
                <NavLink to="/brand/Reebok" className="block px-4 py-2 hover:bg-gray-100 text-gray-800">Reebok</NavLink>
                <NavLink to="/brand/NewBalance" className="block px-4 py-2 hover:bg-gray-100 text-gray-800">New Balance</NavLink>
              </div>
            )}
          </div>

          <NavLink to="/sale" className={({ isActive }) => 
            `!text-red-600 font-semibold hover:!text-red-800 ${isActive ? "border-b-2 border-red-600" : ""}`
          }>
            Sale
          </NavLink>
        </nav>
      )}
    </>
  );
};

export default NavBar;
