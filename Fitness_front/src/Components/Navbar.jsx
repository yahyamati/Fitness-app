import React, { useState, useCallback, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { useTranslation } from 'react-i18next';
import { assets } from "../assets/assets";
import { StoreContext } from "../context/StoreContext";

const Navbar = ({ setShowLogin }) => {
  const { token, setToken } = useContext(StoreContext);
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate(); 

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
  };

  return (
    <nav className="fixed z-50 flex flex-row w-full top-0 bg-transparent justify-between items-center p-4">
      <Link to="/">
        <div className="flex cursor-pointer">
          <img src="/logo.png" alt="logo" className="w-[60px] h-[60px] ml-10" />
        </div>
      </Link>

      <div className="flex items-center space-x-6 mr-6">
        <button
          onClick={() => handleLanguageChange('en')}
          className="text-white hover:text-cyan-300 transition duration-200"
        >
          EN
        </button>
        <button
          onClick={() => handleLanguageChange('fr')}
          className="text-white hover:text-cyan-300 transition duration-200"
        >
          FR
        </button>

        {!token ? 
          <button 
            className="px-4 py-2 text-white bg-cyan-500 rounded hover:bg-cyan-400 transition duration-200"
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
