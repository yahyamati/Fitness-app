import React, { useState, useCallback, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { useTranslation } from 'react-i18next';
import { assets } from "../assets/assets";
import { StoreContext } from "../context/StoreContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ setShowLogin }) => {
  const { token, setToken } = useContext(StoreContext);
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate(); 
  const [currentLanguage, setCurrentLanguage] = useState('en'); 

  const escFunction = useCallback(
    (event) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    },
    [isOpen]
  );

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/"); 
  };

  useEffect(() => {
    document.addEventListener("keydown", escFunction);
    return () => {
      document.removeEventListener("keydown", escFunction);
    };
  }, [isOpen, escFunction]);

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng); 
  };

  return (
    <nav className="fixed z-50 flex flex-row w-full top-0 bg-transparent justify-between items-center p-4">
      <Link to="/">
        <div className="flex cursor-pointer">
          <img src="/logo.png" alt="logo" className="w-[60px] h-[60px] ml-10" />
        </div>
      </Link>

      <div className="flex items-center space-x-6 mr-6">
        {currentLanguage === 'en' ? (
          <button
            onClick={() => handleLanguageChange('fr')}
            className="flex items-center text-white hover:text-cyan-300 transition duration-200"
          >
            <FontAwesomeIcon icon={faGlobe} className="mr-1" />
            FR
          </button>
        ) : (
          <button
            onClick={() => handleLanguageChange('en')}
            className="flex items-center text-white hover:text-cyan-300 transition duration-200"
          >
            <FontAwesomeIcon icon={faGlobe} className="mr-1" />
            EN
          </button>
        )}

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
