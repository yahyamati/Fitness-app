// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { account } from './Registration';  

// const OAuthCallback = () => {
//   const [loading, setLoading] = useState(true); // To manage loading state
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleCallback = async () => {
//       try {
//         // Ensure the user session is established
//         const session = await account.getSession('google');  // Check if the OAuth session exists
//         console.log("this is Session" +session)

//         if (session) {
//           // Session exists, user is authenticated
//           console.log("User logged in via Google with session:", session);

//           const user = await account.get();  // Fetch user data after login
//           const jwtToken = await account.createJWT(); // Fetch JWT token

//           if (user && jwtToken) {
//             console.log('User email:', user.email);
//             console.log('JWT Token:', jwtToken);

//             // Store token and email for future use
//             localStorage.setItem('Token', jwtToken);
//             localStorage.setItem('userEmail', user.email);

//             // Redirect to the home page
//             navigate('/callback');
//           }
//         } else {
//           console.log("No session found. Redirecting to login...");
//           navigate('/login');
//         }
//       } catch (error) {
//         console.error('Error during OAuth callback:', error);
//         navigate('/login');
//       } finally {
//         setLoading(false);
//       }
//     };

//     handleCallback(); // Handle OAuth callback logic

//   }, [navigate]);

//   if (loading) {
//     return <div>Redirecting...</div>;  // Show loading message until authentication completes
//   }

//   return null;
// };

// export default OAuthCallback;
