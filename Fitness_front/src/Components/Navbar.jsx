import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { useTranslation } from 'react-i18next';
import { assets } from "../assets/assets";
import { StoreContext } from "../context/StoreContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faHeart } from '@fortawesome/free-solid-svg-icons';
import Favorits from './Favorits';


const Navbar = ({ setShowLogin }) => {
  const { token, setToken, nmbrlike } = useContext(StoreContext); 
  const navigate = useNavigate(); 
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false); 
  const [currentLanguage, setCurrentLanguage] = useState('en'); 
  const [showFavorite, setShowFavorites] = useState(false);

  const toggleFavorites = () => {
    setShowFavorites(!showFavorite); 
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/"); 
  };

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
          className="flex items-center text-white hover:text-cyan-300 transition duration-200"
        >
          <FontAwesomeIcon icon={faGlobe} className="mr-1" />
          {currentLanguage === 'en' ? 'FR' : 'EN'}
        </button>

        <div className="relative flex items-center">
          <button
            onClick={toggleFavorites} 
            className="flex items-center text-white hover:text-cyan-300 transition duration-200"
          >
            <FontAwesomeIcon 
              icon={faHeart} 
              className="text-white w-5 h-5"
            />
            {numberOfLikes > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1">
                {numberOfLikes}
              </span>
            )}
          </button>

          {showFavorite && (
            <div className="absolute top-full right-0 mt-2 w-[500px] h-[200px] bg-white rounded-lg shadow-lg overflow-hidden z-10">
              <Favorits/>
            </div>
          )}
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
