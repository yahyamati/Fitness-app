import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Chat from '../chat/Chat'; 
import axios from 'axios';

const ExerciseDetail = () => {
  const { name } = useParams(); // Get the exercise name from the URL
  const [exercise, setExercise] = useState(null); // State to hold exercise data
  const [loading, setLoading] = useState(true); // State for loading
  const [showChat, setShowChat] = useState(false); // State to toggle Chat visibility

  const toggleChat = () => {
    setShowChat(!showChat); // Toggle chat visibility when button is clicked
  };


  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/Exercise/get');
        if (response.data.success && Array.isArray(response.data.exercises)) {
          const foundExercise = response.data.exercises.find((ex) => ex.name === name);
          if (foundExercise) {
            setExercise(foundExercise); // Set the found exercise
          } else {
            console.error('Exercise not found');
          }
        } else {
          console.error('Unexpected response structure', response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching exercise:', error);
        setLoading(false);
      }
    };

    fetchExercise();
  }, [name]); // Dependency on name

  if (loading) {
    return <div className="text-center text-xl text-gray-600">Loading...</div>;
  }

  if (!exercise) {
    return <div className="text-center text-xl text-red-500">Exercise not found</div>;
  }

  return (
    <div className="bg-backgroundExercice h-screen bg-cover bg-center flex flex-col md:items-center md:justify-center">
      {/* Wrapper to center content */}
      <div className="w-full max-w-5xl p-5">
        {/* Name Section */}
        <div className="flex justify-center mb-3 md:mb-5"> {/* Center the name */}
          <h1 className="text-2xl md:text-4xl font-bold text-white">{exercise.name}</h1>
        </div>
  
        {/* Video Section */}
        <div className="relative w-full flex justify-center items-center mb-3 md:mb-5">
          {/* Adjusts size and centering */}
          {exercise.video ? (
            <video
              className="w-full max-w-4xl h-auto rounded-lg"
              src={exercise.video}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <p className="text-lg text-red-500">No video available</p>
          )}
        </div>
  
        {/* Description Section */}
        <div className="p-5 text-white mt-3 md:mt-5">
          <p className="text-lg">
            Here you can add more information about the exercise, like instructions, details, etc.
          </p>
        </div>
      </div>

      <div
          className='bg-white rounded-full w-[50px] h-[50px] cursor-pointer fixed bottom-6 right-4 flex items-center justify-center shadow-lg'
          onClick={toggleChat} 
        >
         
          💬
        </div>

        
        {showChat && (
          <div className="fixed bottom-20 right-5 w-[350px] h-[500px] bg-white rounded-lg shadow-lg overflow-hidden">
            <Chat /> 
          </div>
        )}
    </div>
  );
  
};

export default ExerciseDetail;
