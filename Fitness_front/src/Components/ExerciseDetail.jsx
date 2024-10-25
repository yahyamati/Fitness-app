import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Chat from '../chat/chat'; 
import axios from 'axios';

const ExerciseDetail = () => {
  const { name } = useParams(); 
  const [exercise, setExercise] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [showChat, setShowChat] = useState(false); 

  const toggleChat = () => {
    setShowChat(!showChat); 
  };


  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/Exercise/get');
        if (response.data.success && Array.isArray(response.data.exercises)) {
          const foundExercise = response.data.exercises.find((ex) => ex.name === name);
          if (foundExercise) {
            setExercise(foundExercise); 
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
  }, [name]); 

  if (!exercise) {
    return <div className="text-center text-xl text-red-500">Exercise not found</div>;
  }

  return (
    <div className="bg-backgroundExercice min-h-screen bg-cover bg-center flex flex-col md:items-center md:justify-center ">
     
      <div className="w-full max-w-5xl pt-20">
        
        <div className="flex justify-center mb-3 md:mb-5"> 
          <h1 className="text-2xl md:text-4xl font-bold text-white">{exercise.name}</h1>
        </div>
  
        
        <div className="relative w-full flex justify-center items-center mb-3 md:mb-5">
          
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
