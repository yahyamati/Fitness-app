import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-navbar text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold flex-1 flex justify-center">
          <a href="/" className="hover:text-gray-400">MyLogo</a>
        </div>

        {/* Navigation Links */}
        <ul className="flex-1 flex justify-center space-x-6">
          <li>
            <a href="/" className="hover:text-gray-400">Home</a>
          </li>
          <li>
            <a href="#exercise" className="hover:text-gray-400">Exercise</a>
          </li>
        </ul>

        {/* Sign In */}
        <div className="flex-1 flex justify-end">
          <a href="#signin" className="hover:text-gray-400 mr-6">Sign In</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
