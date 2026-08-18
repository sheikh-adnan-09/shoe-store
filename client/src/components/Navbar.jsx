import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState } from "react";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?keyword=${encodeURIComponent(search)}`);
  };

  return (
    <nav className="bg-brand text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="text-xl font-bold tracking-tight whitespace-nowrap">
          Step<span className="text-brand-accent">Up</span>
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search shoes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-1.5 rounded-l-md text-gray-900 focus:outline-none"
          />
          <button type="submit" className="bg-brand-accent px-4 rounded-r-md">
            Go
          </button>
        </form>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative">
            🛒
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-accent text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} className="text-sm font-medium">
                {user.name.split(" ")[0]} ▾
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded-md shadow-lg py-1">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
                    Profile
                  </Link>
                  <Link to="/addresses" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
                    Addresses
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
                    My Orders
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="block px-4 py-2 hover:bg-gray-100 font-medium text-brand-accent" onClick={() => setMenuOpen(false)}>
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                      navigate("/");
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-accent text-sm py-1.5">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
