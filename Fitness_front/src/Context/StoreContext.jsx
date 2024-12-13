import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { useParams } from 'react-router-dom';
// import { axiosInstanceSpring,axiosInstanceNode } from '@/api/axios';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  // const { bodyPart } = useParams();
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [showFavorite, setShowFavorites] = useState(false);
  const [category, setCategory] = useState([]);
  // const [exercisesByCategory, setExercisesByCategory] = useState([]);
  
  const [cartItem, setCartItem] = useState({});
  const [nmbrlike, setNmbrlike] = useState([]);
  
 

  const fetchLikedExercises = async () => {
    const token = localStorage.getItem('token'); 
    const userId = localStorage.getItem('userId'); 
    try {
      const response = await axios.get('http://localhost:3000/spring-api/api/cart/fetch', {
          headers: { Authorization: `Bearer ${token}` },
          params: { userId },
      });
  
      console.log("Fetched liked exercises:", response.data);
      setNmbrlike(response.data); 
    } catch (error) {
      console.error('Error fetching liked exercises:', error);
    }
  };
  
 


  useEffect(() => {
    if (token) {
      fetchLikedExercises(); 
    }
  }, [token]);




  const addToCart = async (exerciseId) => {
    console.log(`Attempting to add exercise with ID: ${exerciseId} to cart`);

    const token = localStorage.getItem('token'); 
    const userId = localStorage.getItem('userId'); 

    if (!userId) {
      console.error('Error: No user ID found.');
      return;
    }

    if (!cartItem[exerciseId]) {
      setCartItem((prev) => ({ ...prev, [exerciseId]: 1 }));

      try {
        const response = await axios.post(
          'http://localhost:3000/spring-api/api/cart/add',
          { userId, exerciseId },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        console.log('Response from server:', response.data);
        console.log(`Exercise with ID: ${exerciseId} successfully added to cart in the backend`);
      } catch (error) {
        console.error('Error adding to cart:', error.response ? error.response.data : error.message);
      }
    } else {
      console.warn(`Exercise with ID: ${exerciseId} is already in the cart.`);
    }
  };

  const removeFromCart = async (exerciseId) => {
    const token = localStorage.getItem('token'); 
    const userId = localStorage.getItem('userId'); 

    if (token) {
      try {
        await axios.post(
          'http://localhost:3000/spring-api/api/cart/remove', 
          { userId, exerciseId },
          { headers: { Authorization: `Bearer ${token}` } } 
        );

        setCartItem((prev) => ({ ...prev, [exerciseId]: prev[exerciseId] - 1 }));

        console.log(`Item with ID: ${exerciseId} successfully removed from cart in the backend`);
      } catch (error) {
        console.error('Error removing item from cart in the backend:', error);
      }
    } else {
      console.error('No token provided');
    }
  };

  useEffect(() => {
    const loadData = () => {
      const localToken = localStorage.getItem("token");
      if (localToken) {
        setToken(localToken);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
        try {
            const headers = {
                'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
                'x-rapidapi-key': 'fec3de3681msh09ba3c2f0450053p1458c4jsnc6febf322ccb',
            };

            const response = await axios.get(
                'https://exercisedb.p.rapidapi.com/exercises/bodyPartList',
                { headers }
            );
            setCategory(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    fetchCategories();
}, []);





// useEffect(() => {
//   const fetchExercises = async () => {
//       try {
//           const headers = {
//               'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
//               'x-rapidapi-key': 'c5df762021mshcb365ba86dc67bcp17aab3jsn6d764bb364bf',
//           };

//           const response = await axios.get(
//               `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`,
//               { headers }
//           );
//           setExercisesByCategory(response.data);
//       } catch (error) {
//           console.error('Error fetching exercises:', error);
//       }
//   };

//   if (bodyPart) {
//       fetchExercises();
//   } else {
//       console.error('Body part is undefined');
//   }
// }, [bodyPart]);


  const contextValue = {
    token,
    setToken,
    userId,
    setUserId,
    // setExercisesByCategory,
    // exercisesByCategory,
    setCategory,
    category,
    addToCart,
    removeFromCart,
    cartItem,
    setCartItem,
    nmbrlike,
    setNmbrlike,
    setShowFavorites,
    showFavorite,
    // bodyPart
    
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
