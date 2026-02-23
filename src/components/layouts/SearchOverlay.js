import { useState, useEffect, useRef } from "react";
import { PRODUCTS } from "../../data/products";

function SearchOverlay({ close, onSearch }) {

  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = PRODUCTS.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSubmit = () => {
    if (!query.trim()) return;
    onSearch(query);
    close();
  };

  const handleSuggestionClick = (name) => {
    onSearch(name);
    close();
  };

  return (
    <div className="search-overlay" onClick={close}>
      
      <div
        className="search-box"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="search-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for bridal, saree, gowns..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />

          <button
            className="search-btn"
            onClick={handleSubmit}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle
                cx="11"
                cy="11"
                r="7"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="20"
                y1="20"
                x2="16.5"
                y2="16.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {query && (
          <div className="search-suggestions">
            {filtered.length > 0 ? (
              filtered.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(item.name)}
                >
                  <img src={item.image} alt={item.name} />
                  <span>{item.name}</span>
                </div>
              ))
            ) : (
              <div className="search-empty">
                No products found
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default SearchOverlay;