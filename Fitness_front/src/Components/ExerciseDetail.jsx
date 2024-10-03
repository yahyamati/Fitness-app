import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ExerciseDetail = () => {
  const { name } = useParams(); // Get the exercise name from the URL
  const [exercise, setExercise] = useState(null); // State to hold exercise data
  const [loading, setLoading] = useState(true); // State for loading

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
    return <div>Loading...</div>;
  }

  if (!exercise) {
    return <div>Exercise not found</div>;
  }

  return (
    <div className='bg-backgroundExercice'>
      
      <div className="flex  "> {/* Center the name container */}
        <div className=" flex items-center justify-center w-[250px] h-[250px] text-center"> {/* Width and height set to 250px */}
          <h1 className="text-4xl font-bold text-black">{exercise.name}</h1>
        </div>
      </div>
      <div className="relative h-96 w-full"> {/* Set height to define the section size */}
        {exercise.video && (
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            src={exercise.video}
            autoPlay
            muted
            loop
            playsInline
          />
        )}
        {/* Overlay and Content */}
       
      </div>

      {/* Name Section below the video */}
      

      {/* Additional Content */}
      <div className="p-5 text-white mt-5">
        <p className="text-lg text-black">
          Here you can add more information about the exercise, like instructions, details, etc.
        </p>
        {/* More content can go here */}
      </div>
    </div>
  );
};

export default ExerciseDetail;
