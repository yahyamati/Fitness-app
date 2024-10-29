import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { faTimes} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Favorits = () => {
  const { nmbrlike,removeFromCart,setNmbrlike,showFavorite,setShowFavorites } = useContext(StoreContext);
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

  const handleRemove = (exerciseId) => {
    if (nmbrlike[exerciseId]) {
      console.log(`Removing exercise with ID: ${exerciseId} from cart`);
      removeFromCart(exerciseId);
     
      setNmbrlike((prev) => {
        const updatedLikes = { ...prev };
        delete updatedLikes[exerciseId]; 
        return updatedLikes;
      });
    
    // Update the local state to remove the exercise immediately from the UI
    setExercises(prevExercises => prevExercises.filter(exercise => exercise._id !== exerciseId));
  }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching exercises: {error.message}</div>;
  }

  return (
    <div className='max-h-[77vh] overflow-y-scroll scrollbar-hide'>
     
      {exercises.length > 0 ? (
        exercises.map(exercise => (
          <div 
          key={exercise._id} 
          className="flex justify-between items-center bg-gray-800 text-white rounded-lg shadow-lg h-auto py-4 px-6 mb-4"
        >
          <Link
              to={`/exercise/detail/${exercise.name}`}   
              onClick={() => setShowFavorites(false)} 
              className="p-2 text-center"
            >
          <h3 className="text-lg font-semibold">{exercise.name}</h3>
          </Link>
          
          <button
            onClick={() => handleRemove(exercise._id)}
            className="text-gray-400 hover:text-red-500 transition duration-200"
            title="Remove from Favorites"
          >
            <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
          </button>
        </div>
        ))
      ) : (
        <p>No favorite exercises found.</p>
      )}
    </div>
  );
};

export default Favorits;
