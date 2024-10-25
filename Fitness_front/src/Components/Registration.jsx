import React, { useContext, useState } from 'react';
import axios from 'axios';
import { assets } from '../assets/assets';
import { useTranslation } from 'react-i18next';
import { StoreContext } from '../context/StoreContext';

const Registration = ({ setShowLogin }) => {
  const { setToken } = useContext(StoreContext);
  const { t } = useTranslation(); 
  const [currState, setCurrState] = useState('Login');
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = "http://localhost:8080";

    if (currState === "Login") {
      newUrl += "/api/users/login";
    } else {
      newUrl += "/api/users/register";
    }

    try {
      const response = await axios.post(newUrl, data);
      console.log(response);

      if (response && response.data && response.data.success) {
        console.log(response.data.token); 
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token); 
        setShowLogin(false); 
        alert(response.data.message || t("Success!")); 
      } else {
        const message = response?.data?.message || t("Something went wrong. Please try again.");
        console.error(message);
        alert(message); 
      }
    } catch (error) {
      console.error(error);
      alert(t("An error occurred while processing your request.")); 
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className='max-w-md mx-auto p-6 bg-white shadow-md rounded-lg'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-semibold'>{t(currState)}</h2> 
          <img
            onClick={() => setShowLogin(false)}
            src={assets.crossIcon}
            className='h-6 w-6 cursor-pointer'
            alt='Close'
          />
        </div>
        <form onSubmit={onLogin} className='space-y-4'>
          {currState === 'Sign Up' && (
            <input
              type='text'
              name='name'
              onChange={onChangeHandler}
              value={data.name}
              placeholder={t('Your name')} 
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          )}
          <input
            type='email'
            name='email'
            onChange={onChangeHandler}
            value={data.email}
            placeholder={t('Your email')} 
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          />
          <input
            type='password'
            name='password'
            onChange={onChangeHandler}
            value={data.password}
            placeholder={t('Password')}
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          />
          <button
            className='w-full mt-6 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300'
            type='submit'
          >
            {currState === 'Sign Up' ? t('createAccount') : t('Login')} 
          </button>
          <div className='mt-4 flex items-center'>
            <input
              type='checkbox'
              className='mr-2'
              required
            />
            <p className='text-sm text-gray-600'>
              {t("By continuing, I agree to the terms of use & privacy policy")} 
            </p>
          </div>
          {currState === 'Login' ? (
            <p className='mt-4 text-sm text-gray-600'>
              {t("Create a new account")}
              <span
                onClick={() => setCurrState('Sign Up')}
                className='text-blue-500 cursor-pointer ml-1'
              >
                {t("Click here")} 
              </span>
            </p>
          ) : (
            <p className='mt-4 text-sm text-gray-600'>
              {t("Already have an account?")}
              <span
                onClick={() => setCurrState('Login')}
                className='text-blue-500 cursor-pointer ml-1'
              >
                {t("Login here")} 
              </span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Registration;
