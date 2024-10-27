import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { StoreContext } from '../context/StoreContext';

const Favorits = () => {
  const { nmbrlike } = useContext(StoreContext);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        
        const exercisePromises = Object.keys(nmbrlike).map(id =>
          axios.get(`http://localhost:4000/api/Exercise/${id}`)
        );

        
        const responses = await Promise.all(exercisePromises); //waiting all data to come

        
        const fetchedExercises = responses.map(response => response.data.exercise);
        setExercises(fetchedExercises);
      } catch (err) {
        console.error('Error fetching exercises:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (nmbrlike && Object.keys(nmbrlike).length > 0) {
      fetchExercises();
    } else {
      setLoading(false); 
    }
  }, [nmbrlike]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching exercises: {error.message}</div>;
  }

  return (
    <div>
     
      {exercises.length > 0 ? (
        exercises.map(exercise => (
          <div key={exercise._id}>
            <h3>{exercise.name}</h3>
            {/* <video controls>
              <source src={exercise.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video> */}
            
          </div>
        ))
      ) : (
        <p>No favorite exercises found.</p>
      )}
    </div>
  );
};

export default Favorits;
