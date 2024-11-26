// import { Client, Account } from "appwrite";

// // Initialize Appwrite client
// const client = new Client();
// const account = new Account(client);

// // Set the Appwrite endpoint and project ID
// client
//   .setEndpoint('https://cloud.appwrite.io/v1') 
//   .setProject('6741c0750036fb2ccf69'); 

// // Initiate the OAuth2 login with Google, redirecting to the callback URL
// const startOAuth = () => {
//   account.createOAuth2Session('google', 'http://localhost:5173/oauth/callback')  // Ensure this matches your callback route
//     .then(() => {
//       console.log("User logged in with Google!");
//     })
//     .catch((error) => {
//       console.error("Login failed:", error.message);
//     });
// };

// startOAuth();  // Call this when the user clicks on a 'Login with Google' button

// export { account };
