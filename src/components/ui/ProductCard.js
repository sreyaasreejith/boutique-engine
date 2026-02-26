import React from "react";
import { ShoppingBagIcon } from "../icons/Icons";

function ProductCard({ product, onClick }) {

  // format price Indian style
  const formattedPrice = Number(product.price).toLocaleString("en-IN");
  const formattedDiscountPrice = product.discountPrice ? Number(product.discountPrice).toLocaleString("en-IN") : null;
  const discountPercent = product.discountPrice ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  return (
    <div
      className="product-card"
      onClick={() => onClick(product)}
    >
      <div className="product-image">
        <img
          src={product.image}
          alt={product.name}
        />
        {discountPercent > 0 && (
          <div className="discount-badge">{discountPercent}% OFF</div>
        )}
      </div>

      <div className="product-body">

        <p className="product-category">
          {product.category}
        </p>

        <h3 className="product-name">
          {product.name}
        </h3>

        {/* Price Display with Discount */}
        <div className="product-pricing">
          {formattedDiscountPrice ? (
            <>
              <p className="product-price">₹ {formattedDiscountPrice}</p>
              <p className="product-price-original">₹ {formattedPrice}</p>
              <span className="product-discount-percent">-{discountPercent}%</span>
            </>
          ) : (
            <p className="product-price">₹ {formattedPrice}</p>
          )}
        </div>

        <button
          className="product-btn"
          onClick={(e) => {
            e.stopPropagation();
            onClick(product);
          }}
        >
          View Details
        </button>

      </div>
    </div>
  );
}

export default ProductCard;