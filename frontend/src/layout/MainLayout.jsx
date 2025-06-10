import { useLocation } from 'react-router-dom';
import NavBar from '../components/ui/NavBar';
import Footer from '../components/ui/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Outlet } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const MainLayout = ({ numCartItems }) => {
  const location = useLocation(); // Get the current route

  // Define routes where the NavBar should NOT appear
  const hideNavOnPages = ["/login", "/register"];
  const isProfilePage = location.pathname === "/profile"; // Check if it's the profile page

  return (
    <div>
      {/* Show NavBar only if not on login/signup pages, and pass hideExtras prop */}
      {!hideNavOnPages.includes(location.pathname) && (
        <NavBar numCartItems={numCartItems} hideExtras={isProfilePage} />
      )}
      <ToastContainer />
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
