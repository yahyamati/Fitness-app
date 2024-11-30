import React, { useState, useContext,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { StoreContext } from '../Context/StoreContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGlobe, 
  faHeart, 
  faTimes, 
  faBox, 
  faHome,
  faMessage, 
  faUser, 
  faSignOutAlt 
} from '@fortawesome/free-solid-svg-icons';
import Favorits from './Favorits';

const Navbar = ({ setShowLogin }) => {
  const { 
    setToken,
    nmbrlike, 
    showFavorite, 
    setShowFavorites 
  } = useContext(StoreContext);
  
  const [isOpen, setIsOpen] = useState(false);
  const [LoggedIn,setLoggedIn] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  

  const toggleFavorites = () => {
    setShowFavorites(!showFavorite);
  };

  const toprofile = () => {
    navigate("/Profile");
    setIsOpen("");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };


  // !check if token expired if true disconnect 

  const token = localStorage.getItem('token')
  function isTokenExpired(token) {
    if (!token) return true; 
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); 
      const expirationTime = payload.exp * 1000; 
  
      return Date.now() > expirationTime; 
    } catch (error) {
      console.error("Invalid token format", error);
      return true; 
    }
  }

useEffect(()=>{
  if (isTokenExpired(token)){
    localStorage.removeItem("token");
    
    setLoggedIn(false);
  }else{
    setLoggedIn(true)
  }
}, [token]);



const handleLanguageChange = (lng) => {
  i18n.changeLanguage(lng);
  setCurrentLanguage(lng); 
};


  const numberOfLikes = nmbrlike ? Object.keys(nmbrlike).length : 0;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#0b0b0b] to-[#4a4a4a] shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-white hover:text-[#FF921B]" title="Home">
            <FontAwesomeIcon icon={faHome} className="w-5 h-5" />
          </Link>
          <Link to="/product" className="text-white hover:text-[#FF921B]">
            <FontAwesomeIcon icon={faBox} className="w-5 h-5" />
          </Link>
          <Link to="/Message" className="text-white hover:text-[#FF921B]">
            <FontAwesomeIcon icon={faMessage} className="w-5 h-5" />
          </Link>
          <button 
             onClick={() => handleLanguageChange(currentLanguage === 'en' ? 'fr' : 'en')} 
            className="text-white hover:text-[#FF921B] flex items-center"
          >
            <FontAwesomeIcon icon={faGlobe} className="mr-2" />
            {currentLanguage === 'en' ? 'FR' : 'EN'}
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button 
              onClick={toggleFavorites} 
              className="text-white hover:text-[#FF921B] relative"
            >
              <FontAwesomeIcon icon={faHeart} className="w-5 h-5" />
              {numberOfLikes > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
                  {numberOfLikes}
                </span>
              )}
            </button>

           <div 
              className={`fixed top-0 right-0 h-full w-0.5/2 md:w-1/3 bg-white rounded-l-lg transition-transform duration-500 ease-in-out z-10 ${
                showFavorite ? 'transform translate-x-0' : 'transform translate-x-full'
              }`}
            >
              <div className="flex justify-end p-4 bg-gray-100 border-b">
                <button
                  onClick={() => setShowFavorites(false)}
                  className="text-gray-500 hover:text-red-600 transition duration-200 ease-in-out"
                  title="Close Favorites"
                >
                  <FontAwesomeIcon icon={faTimes} className="w-6 h-6"  />
                </button>
              </div>

              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Favorites Exercises:</h2>
                <Favorits />
              </div>
            </div>
          </div>

          {!LoggedIn ? (
            <button 
              onClick={() => setShowLogin(true)}
              className="px-4 py-2 bg-[#FF921B] text-white rounded hover:bg-orange-600 transition"
            >
             {t("Sign In")}
            </button>
          ) : (
            <div className="relative">
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:text-[#FF921B]"
              >
                <FontAwesomeIcon icon={faUser} className="w-5 h-5" />
              </button>

              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden">
                  <button 
                    onClick={toprofile} 
                    className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    Profile
                  </button>
                  <button 
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;