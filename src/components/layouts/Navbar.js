import { useState, useEffect } from "react";
import EditorialMenu from "./EditorialMenu";
import SearchOverlay from "./SearchOverlay";
import { BRAND } from "../../config/brand";
function Navbar({ onCategorySelect, onSearch }) {

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (menuOpen || searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [menuOpen, searchOpen]);

  return (
    <>
      <nav className="navbar">
        {/* Hamburger Icon */}
        <button className="nav-icon" onClick={() => setMenuOpen(true)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 7H20M4 12H20M4 17H20"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <h2 className="brand-name">{BRAND.name}</h2>

        {/* Search Icon */}
        <button className="nav-icon" onClick={() => setSearchOpen(true)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle
              cx="11"
              cy="11"
              r="7"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <line
              x1="20"
              y1="20"
              x2="16.5"
              y2="16.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <EditorialMenu
          close={() => setMenuOpen(false)}
          onCategorySelect={onCategorySelect}
        />
      )}

      {searchOpen && (
        <SearchOverlay
          close={() => setSearchOpen(false)}
          onSearch={onSearch}
        />
      )}
    </>
  );
}

export default Navbar;