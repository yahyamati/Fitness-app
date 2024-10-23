import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [token, setToken] = useState("");
  const [exercisesByCategory, setExercisesByCategory] = useState({});



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
    const fetchExercises = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/Exercise/get');
        if (response.data.success && Array.isArray(response.data.exercises)) {
          const groupedExercises = response.data.exercises.reduce((acc, exercise) => {
            const { category } = exercise;
            if (!acc[category]) acc[category] = [];
            acc[category].push(exercise);
            return acc;
          }, {});

          setExercisesByCategory(groupedExercises);
        }
       
      } catch (error) {
        console.error('Error fetching exercises:', error);
        
      }
    };

    fetchExercises();
  }, []);










  const contextValue = {
    token,
    setToken,
    setExercisesByCategory,
    exercisesByCategory

  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
