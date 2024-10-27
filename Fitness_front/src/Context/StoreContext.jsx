import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [category, setCategory] = useState({ success: false, categories: [] });
  const [exercisesByCategory, setExercisesByCategory] = useState({ success: false, exercises: [] });
  const [cartItem, setCartItem] = useState({});
  const [nmbrlike, setNmbrlike] = useState([]); 

  const fetchLikedExercises = async () => {
    const token = localStorage.getItem('token'); 
    const userId = localStorage.getItem('userId'); 
    try {
      const response = await axios.get('http://localhost:8080/api/cart/fetch', {
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
          'http://localhost:8080/api/cart/add',
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
          'http://localhost:8080/api/cart/remove', 
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
    const fetchData = async () => {
      try {
        const categoryResponse = await axios.get('http://localhost:4000/api/Exercise/getCategory'); 
        setCategory(categoryResponse.data);

        const exercisesResponse = await axios.get('http://localhost:4000/api/Exercise/get'); 
        setExercisesByCategory(exercisesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const contextValue = {
    token,
    setToken,
    userId,
    setUserId,
    setExercisesByCategory,
    exercisesByCategory,
    setCategory,
    category,
    addToCart,
    removeFromCart,
    cartItem,
    setCartItem,
    nmbrlike,
    setNmbrlike
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
