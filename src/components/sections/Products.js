import { useState } from "react";
import ProductCard from "../ui/ProductCard";
import ProductModal from "../ui/ProductModal";
import { PRODUCTS } from "../../data/products";

function Products({ activeCategory, searchQuery }) {

  const [selectedProduct, setSelectedProduct] = useState(null);

  let filteredProducts = PRODUCTS;

  if (activeCategory) {
    filteredProducts = filteredProducts.filter(
      p => p.category.toLowerCase() === activeCategory.toLowerCase()
    );
  }

  if (searchQuery) {
    filteredProducts = filteredProducts.filter(
      p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <section className="featured container" id="products">
      <h2 className="section-title">
        {searchQuery
          ? `Search Results for "${searchQuery}"`
          : activeCategory
          ? `${activeCategory} Collection`
          : "Curated Pieces"}
      </h2>

      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <p>No products found.</p>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={setSelectedProduct}
            />
          ))}
        </div>
      )}

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}

export default Products;