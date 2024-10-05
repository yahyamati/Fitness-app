import React, { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const escFunction = useCallback(
    (event) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    },
    [isOpen]
  );

  useEffect(() => {
    const handleRouteChange = () => {
      if (isOpen) setIsOpen(false);
    };

    document.addEventListener("keydown", escFunction);

    return () => {
      document.removeEventListener("keydown", escFunction);
    };
  }, [isOpen, escFunction]);

  return (
    <nav className="fixed z-50 flex flex-row w-full top-0 shadow-md bg-navbar justify-between">
      {/* Logo Section */}
      <Link to="/">
        <div className="flex cursor-pointer px-1 py-1">
          <img src="/logo.png" alt="logo" className="w-[60px] h-[60px] ml-8" />
        </div>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:!flex mr-10 text-white">
        <ul className="flex flex-row text-sm space-x-4 items-center">
          <li className="px-2 py-2 hover:text-cyan-500  rounded-lg">
            <Link to="/">Home</Link>
          </li>
          <li className="px-2 py-2 hover:text-cyan-500  rounded-lg">
            <Link to="/contact">Exercise</Link>
          </li>
        </ul>
      </div>

      {/* Sign In Button */}
      <div className="flex items-center mr-8">
        
          <button className="px-4 py-2 text-white hover:text-cyan-500 ">
            Sign In
          </button>
      </div>

      {/* Hamburger Icon */}
      <div className="md:hidden flex items-center ml-auto mr-4">
        <button
          className="z-50 relative w-8 h-8 flex flex-col justify-between items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span
            className={`block h-1 w-full bg-gray-700 rounded transform transition duration-300 ease-in-out ${
              isOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block h-1 w-full bg-gray-700 rounded transition duration-300 ease-in-out ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-1 w-full bg-gray-700 rounded transform transition duration-300 ease-in-out ${
              isOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full bg-navbar transition-transform duration-300 ease-in-out text-white ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ height: "60vh", maxHeight: "25vh", overflowY: "auto" }} // Smaller height for mobile menu
      >
        <div className="flex flex-col items-center justify-start py-8 space-y-6">
          <Link to="/" onClick={() => setIsOpen(false)}>
            <img src="/logo.png" alt="logo" className="w-[60px] h-[60px] " />
          </Link>
          <Link to="/about" className="text-lg" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link to="/contact" className="text-lg" onClick={() => setIsOpen(false)}>
            Exercise
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
