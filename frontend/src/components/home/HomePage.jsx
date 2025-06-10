import HeroSection from "./HeroSection";
import FeaturedProducts from "./FeaturedProducts";
import CategoriesSection from "./CategoriesSection";
import SpecialDeals from "./SpecialDeals";
import NewArrivals from "./NewArrivals";
import PopularBrands from "./PopularBrands";
import NewsletterSignup from "./NewsLetterSignup";
import PlaceholderContainer from "../ui/PlaceHolderContainer"; // Import placeholder
import api from "../../api";
import { useEffect, useState } from "react";
import Error from "../ui/Error";
import { randomValue } from "../../GenerateCartCode";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(function(){
    if(localStorage.getItem("cart_code") === null){
      localStorage.setItem("cart_code", randomValue)
    }
  }, [])

  useEffect(() => {
    api
      .get("products")
      .then((res) => {
        setProducts(res.data);
        setLoading(false); // Set loading to false after fetching data
        setError("");
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
        console.error(err.message);
      });
  }, []);

  return (
    <div className="home-page"> 
      {error && <Error error={error}/>}
      {loading && <PlaceholderContainer />}
      {loading || error !="" || <HeroSection />}

      {/* Show skeletons while loading */}
      {loading || error !="" || <FeaturedProducts products={products} />}
      
      {loading || error !="" || <CategoriesSection />}

      {loading || error !="" ||  <SpecialDeals />}
      
      {loading || error !="" ||  <NewArrivals products={products} />}

      {loading || error !="" || <PopularBrands />}
      
      {loading || error !="" || <NewsletterSignup />}
    </div>
  );
};

export default HomePage;
