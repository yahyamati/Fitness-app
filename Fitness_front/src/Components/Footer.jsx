import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <footer className="bg-navbar text-white py-8 w-full mt-auto shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 px-4 md:px-0">
        <div className="flex flex-col items-center md:items-center space-y-4 md:w-1/3">
          <img src="/logo.png" alt="Logo" className="h-16" />
          <p className="text-center md:text-center text-sm md:text-base">
          Welcome to Train-urself, your ultimate destination for tech and programming Question. Choose from diverse categories, and read articles that help you learn, grow, and have fun.
          </p>
          <div className="flex space-x-4">
            <a href="https://facebook.com" className="transition-transform transform hover:scale-110">
              <img src={assets.facebook_icon} alt="Facebook" className="h-6 w-6" />
            </a>
            <a href="https://twitter.com" className="transition-transform transform hover:scale-110">
              <img src={assets.twitter_icon} alt="Twitter" className="h-6 w-6" />
            </a>
            <a href="https://linkedin.com" className="transition-transform transform hover:scale-110">
              <img src={assets.linkedin_icon} alt="LinkedIn" className="h-6 w-6" />
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-center space-y-4 md:w-1/3">
          <h2 className="font-bold text-xl mb-4 text-center md:text-center">GET IN TOUCH</h2>
          <div className="flex flex-col text-center md:text-center">
            <a href="mailto:bouchairrayane01@gmail.com">bouchairrayane01@gmail.com</a>
            <a href="mailto:Yahyamati8@gmail.com" >Yahyamati8@gmail.com</a>
          </div>
        </div>
      </div>
      <hr className="my-4 border-gray-600" />
      <p className="text-center text-sm md:text-base">
        Copyright 2024 © Fitness.com - All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;