import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [token, setToken] = useState("");
  const [category, setCategory] = useState({ success: false, categories: [] });
  const [exercisesByCategory, setExercisesByCategory] = useState({ success: false, exercises: [] });



  



  useEffect(() => {
    const loadData = () => {
      const localToken = localStorage.getItem("token");
      if (localToken) {
        setToken(localToken);
      }
    };
    loadData();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // Fetch exercises
  //       const exerciseResponse = await axios.get('http://localhost:4000/api/Exercise/get');
  //       if (exerciseResponse.data.success && Array.isArray(exerciseResponse.data.exercises)) {
  //         const groupedExercises = exerciseResponse.data.exercises.reduce((acc, exercise) => {
  //           const { category } = exercise;
  //           if (!acc[category]) acc[category] = [];
  //           acc[category].push(exercise);
  //           return acc;
  //         }, {});

  //         setExercisesByCategory(groupedExercises);
  //       }

        
  //       const categoryResponse = await axios.get('http://localhost:4000/api/Exercise/getCategory');
  //       setCategory(categoryResponse.data);
  //       console.log(categoryResponse.data);
        
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);

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
    setExercisesByCategory,
    exercisesByCategory,
    setCategory,
    category,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
