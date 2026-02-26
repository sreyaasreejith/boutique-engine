import { useState, useEffect } from "react";
import { BRAND } from "../../config/brand";
import { CloseIcon, WhatsAppIcon, CheckIcon } from "../icons/Icons";
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

function ProductModal({ product, onClose }) {
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch full product details from Firebase
  useEffect(() => {
    if (!product) return;
    
    setLoading(true);
    setProductDetails(null);
    setSelectedImageIndex(0);
    
    const fetchProductDetails = async () => {
      try {
        const docRef = doc(db, "products", product.id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProductDetails({
            ...product,
            ...docSnap.data()
          });
        } else {
          setProductDetails(product);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setProductDetails(product);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [product?.id]);

  if (!product) return null;
  if (loading || !productDetails) return null;

  const displayProduct = productDetails || product;
  const productURL = `${window.location.origin}/?product=${displayProduct.id}`;

  const message = `Hello,\n\nI'm interested in:\n\nProduct: ${displayProduct.name}\nCategory: ${displayProduct.category}\nPrice: ₹${displayProduct.price}\n\nView product: ${productURL}\n\nPlease share more details.`;

  const whatsappURL = `https://wa.me/${BRAND.phone}?text=${encodeURIComponent(message)}`;

  // Format price in Indian style
  const formattedPrice = Number(displayProduct.price).toLocaleString("en-IN");

  // Get features from Firebase, or use defaults
  const features = displayProduct.features || [
    "Premium Quality Fabric",
    "Exquisite Design",
    "Perfect For Celebrations",
    "Customization Available"
  ];

  // Get description from Firebase, or use default
  const description = displayProduct.description || 
    "Crafted with meticulous attention to detail, this piece represents the epitome of elegance and sophistication. Perfect for your most cherished moments.";

  // Get all images - support both single image and multiple images
  const images = displayProduct.images && Array.isArray(displayProduct.images) && displayProduct.images.length > 0
    ? displayProduct.images
    : displayProduct.image 
    ? [displayProduct.image]
    : [];

  const currentImage = images[selectedImageIndex] || displayProduct.image;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <CloseIcon size={24} color="#3d3d3d" />
        </button>

        <div className="modal-grid">
          <div className="modal-image-container">
            <img src={currentImage} alt={displayProduct.name} />
            
            {/* Image Gallery Navigation */}
            {images.length > 1 && (
              <div className="image-gallery">
                <button 
                  className="gallery-btn prev-btn"
                  onClick={() => setSelectedImageIndex((prev) => prev === 0 ? images.length - 1 : prev - 1)}
                  aria-label="Previous image"
                >
                  ❮
                </button>
                <div className="image-indicators">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`indicator ${index === selectedImageIndex ? 'active' : ''}`}
                      onClick={() => setSelectedImageIndex(index)}
                      aria-label={`View image ${index + 1}`}
                    />
                  ))}
                </div>
                <button 
                  className="gallery-btn next-btn"
                  onClick={() => setSelectedImageIndex((prev) => prev === images.length - 1 ? 0 : prev + 1)}
                  aria-label="Next image"
                >
                  ❯
                </button>
              </div>
            )}
          </div>

          <div className="modal-info">
            <div className="modal-category">{displayProduct.category}</div>
            <h2>{displayProduct.name}</h2>
            
            <div className="modal-price">₹{formattedPrice}</div>

            {description && (
              <p className="modal-description">{description}</p>
            )}

            {features && features.length > 0 && (
              <div className="modal-features">
                <h4>Features</h4>
                <ul>
                  {features.map((feature, index) => (
                    <li key={index}>
                      <CheckIcon size={16} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <a
              href={whatsappURL}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn"
            >
              <WhatsAppIcon size={20} />
              <span>Enquire on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;