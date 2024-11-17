import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { useTranslation } from 'react-i18next';
import { assets } from "../assets/assets";
import { StoreContext } from "../context/StoreContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faHeart ,faTimes,faBox,faMessage } from '@fortawesome/free-solid-svg-icons';
import Favorits from './Favorits';


const Navbar = ({ setShowLogin }) => {
  const { token, setToken, nmbrlike,showFavorite,setShowFavorites } = useContext(StoreContext); 
  const navigate = useNavigate(); 
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false); 
  const [currentLanguage, setCurrentLanguage] = useState('en'); 

  // const [isLoggedIn , setLoggedIn] = useState(false);

  const toggleFavorites = () => {
    setShowFavorites(!showFavorite); 
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/"); 
  };

//   function isTokenExpired(token) {
//     if (!token) return true;

//     const payload = JSON.parse(atob(token.split('.')[1])); 
//     const expirationTime = payload.exp*1000 ; 
//     console.log(expirationTime)
//     console.log(Date.now())
  
//     return Date.now() > expirationTime;
//   }

// useEffect(()=>{
//   if (isTokenExpired(token)){
//     localStorage.removeItem("token");
//     setToken("");
//     setLoggedIn(false);
//   }else{
//     setLoggedIn(true)
//   }
// }, [token, setToken]);

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng); 
  };

  const numberOfLikes = nmbrlike ? Object.keys(nmbrlike).length : 0;

  return (
    <nav className="fixed z-50 flex flex-row w-full top-0 bg-transparent justify-between items-center p-4">
      <Link to="/">
        <div className="flex cursor-pointer">
          <img src="/logo.png" alt="logo" className="w-[60px] h-[60px] ml-10" />
        </div>
      </Link>
     

      <div className="flex items-center space-x-6 mr-6">
       
          
        <button
          onClick={() => handleLanguageChange(currentLanguage === 'en' ? 'fr' : 'en')}
          className="flex items-center text-white hover:text-[#FF921B] transition duration-200"
        >
          <FontAwesomeIcon icon={faGlobe} className="mr-1" />
          {currentLanguage === 'en' ? 'FR' : 'EN'}
        </button>

        <Link to="/product">
          <FontAwesomeIcon
            icon={faBox} 
            className="text-white w-6 h-6 hover:text-[#FF921B] transition duration-200"
            title="Find Product"
          />
         </Link>

         <Link to="/Message">
          <FontAwesomeIcon
            icon={faMessage} 
            className="text-white w-6 h-6 hover:text-[#FF921B] transition duration-200"
            title="Messages"
          />
         </Link>

        <div className="relative flex items-center">
          
          <button
            onClick={toggleFavorites} 
            className="flex items-center text-white hover:text-cyan-300 transition duration-200"
          >
            <FontAwesomeIcon 
              icon={faHeart} 
              className="text-white hover:text-[#FF921B] w-5 h-5"
            />
            {numberOfLikes > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1">
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

        {!token ? 
          <button 
            className="px-4 py-2 text-white bg-[#FF921B] rounded transition duration-200"
            onClick={() => setShowLogin(true)} 
          >
            {t('Sign In')}
          </button>
         : 
          <div className='relative'>
            <img 
              src={assets.profile_icon} 
              alt="Profile" 
              className="cursor-pointer w-6 h-7"
              onClick={() => setIsOpen(!isOpen)} 
            />
            {isOpen && (
              <ul className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg overflow-hidden z-10">
                <li className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={logout}>
                  <img src={assets.logout_icon} alt="Logout" className="w-4 h-4 mr-2" />
                  <span className="text-gray-700">Logout</span>
                </li>
              </ul>
            )}
          </div>
        }
      </div>
    </nav>
  );
};

export default Navbar;
