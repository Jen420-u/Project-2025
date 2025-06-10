import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import HomePage from "./components/home/HomePage";
import NotFoundPage from "./components/ui/NotFoundpage";
import ProductPage from "./components/product/ProductPage";
import { useEffect, useState } from "react";
import api from "./api";
import CartPage from "./components/cart/CartPage";
import LoginPage from "./components/user/LoginPage";
import CheckoutPage from "./components/checkout/CheckoutPage";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import UserProfilePage from "./components/user/UserProfilePage";
import RegistrationPage from "./components/user/RegistrationPage";
import NewProductPage from "./components/pages/NewProductPage";
import MenProductPage from "./components/pages/MenProductPage";
import KidsProductPage from "./components/pages/KidsProductPage";
import WomenProductPage from "./components/pages/WomenProductPage";
import AllProductPage from "./components/pages/AllProductPage";
import SearchResults from "./components/pages/SearchResults";
import BrandsPage from "./components/brandpage/BrandsPage";
import SalePage from "./components/pages/SalePage";
import HelpPage from "./components/pages/HelpPage";
import AboutUsPage from "./components/pages/AboutusPage";
import ContactUsPage from "./components/pages/ContactUsPage";
import PaymentStatusPage from "./components/payment/PaymentStatusPage";
import ForgotPassword from "./components/user/ForgotPassword";

const App = () => {

  const [numCartItems, setNumberCartItems] = useState(0);
  const cart_code = localStorage.getItem("cart_code")

  useEffect(function(){
    if(cart_code){
      api.get(`get_cart_stat?cart_code=${cart_code}`)
      .then(res => {
        console.log(res.data)
        setNumberCartItems(res.data.num_of_items)
      })

      .catch(err => {
        console.log(err.message)
      })
    }
    
  }, [])

  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout numCartItems={numCartItems} />}>
          <Route index element={<HomePage />} />
          {/* ProductPage will render for a specific product using the slug */}
          <Route path="product/:slug" element={<ProductPage setNumberCartItems={setNumberCartItems} />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/allproduct" element={<AllProductPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/contactus" element={<ContactUsPage />} />
          <Route path="/aboutus" element={<AboutUsPage />} />
          <Route path="/new" element={<NewProductPage />} />
          <Route path="/men" element={<MenProductPage />} />
          <Route path="/women" element={<WomenProductPage />} />
          <Route path="/kids" element={<KidsProductPage />} />
          <Route path="/brand/:brand" element={<BrandsPage />} />
          <Route path="/sale" element={<SalePage />} />
          <Route path="cart" element={<CartPage setNumberCartItems={setNumberCartItems} />} />
          <Route path="checkout" element={
            <ProtectedRoute>
            <CheckoutPage />
            </ProtectedRoute>} />
          <Route path="login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="profile" element={<UserProfilePage />}/>
          <Route path="*" element={<NotFoundPage />} />
          <Route path="payment-status" element={<PaymentStatusPage setNumberCartItems={setNumberCartItems} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
      </Routes>
    </Router>
    </AuthProvider>
  );
};

export default App;
