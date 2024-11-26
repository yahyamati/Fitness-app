import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import StoreContextProvider from './context/StoreContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId ="532114250098-8po137bd8k7a2d72qqg8bkfr14krn2fr.apps.googleusercontent.com"; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <StoreContextProvider>
        <App />
      </StoreContextProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
