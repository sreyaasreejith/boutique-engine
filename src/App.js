import { useEffect, useState } from "react";
import { BRAND } from "./config/brand";

import Navbar from "./components/layouts/Navbar";
import Footer from "./components/layouts/Footer";
import WhatsAppFloat from "./components/layouts/WhatsAppFloat";

import Hero from "./components/sections/Hero";
import Products from "./components/sections/Products";
import StudioSection from "./components/sections/StudioSection";
import Testimonials from "./components/sections/Testimonials";
import VisitSection from "./components/sections/VisitSection";

import "./App.css";

function App() {

  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {

    // 🔥 Tab Title → Only Brand Name
    document.title = BRAND.name;

    // 🔥 Meta Description
    let description = document.querySelector("meta[name='description']");
    if (!description) {
      description = document.createElement("meta");
      description.setAttribute("name", "description");
      document.head.appendChild(description);
    }
    description.setAttribute("content", BRAND.seo.description);

    // 🔥 Open Graph Title
    let ogTitle = document.querySelector("meta[property='og:title']");
    if (!ogTitle) {
      ogTitle = document.createElement("meta");
      ogTitle.setAttribute("property", "og:title");
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute("content", BRAND.seo.title);

    // 🔥 Open Graph Description
    let ogDesc = document.querySelector("meta[property='og:description']");
    if (!ogDesc) {
      ogDesc = document.createElement("meta");
      ogDesc.setAttribute("property", "og:description");
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute("content", BRAND.seo.description);

    // 🔥 Open Graph Image
    let ogImage = document.querySelector("meta[property='og:image']");
    if (!ogImage) {
      ogImage = document.createElement("meta");
      ogImage.setAttribute("property", "og:image");
      document.head.appendChild(ogImage);
    }
    ogImage.setAttribute(
      "content",
      `${window.location.origin}${BRAND.heroImage}`
    );

    // 🔥 Open Graph URL
    let ogURL = document.querySelector("meta[property='og:url']");
    if (!ogURL) {
      ogURL = document.createElement("meta");
      ogURL.setAttribute("property", "og:url");
      document.head.appendChild(ogURL);
    }
    ogURL.setAttribute("content", window.location.origin);

    // 🔥 Dynamic Favicon
    let favicon = document.querySelector("link[rel='icon']");
    if (!favicon) {
      favicon = document.createElement("link");
      favicon.setAttribute("rel", "icon");
      document.head.appendChild(favicon);
    }
    favicon.setAttribute("href", BRAND.seo.favicon);

  }, []);

  const handleCategorySelect = (category) => {
    setSearchQuery("");
    setActiveCategory(category);

    setTimeout(() => {
      document.getElementById("products")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  const handleSearch = (query) => {
    setActiveCategory(null);
    setSearchQuery(query);

    setTimeout(() => {
      document.getElementById("products")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  return (
    <>
      <Navbar
        onCategorySelect={handleCategorySelect}
        onSearch={handleSearch}
      />

      <Hero />

      <Products
        activeCategory={activeCategory}
        searchQuery={searchQuery}
      />

      <StudioSection />
      <Testimonials />
      <VisitSection />

      <Footer />
      <WhatsAppFloat />
    </>
  );
}

export default App;