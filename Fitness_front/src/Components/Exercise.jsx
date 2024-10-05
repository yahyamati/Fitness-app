import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import axios from 'axios';

const Exercise = () => {
  const [exercisesByCategory, setExercisesByCategory] = useState({});
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      } catch (error) {
        console.error('Error fetching exercises:', error);
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="pt-10">
      <h1 className='font-bold text-4xl  text-white text-center mb-20'>Planfit Exercises Guide</h1>
      <div className="flex flex-wrap justify-around gap-5 ">
        {Object.entries(exercisesByCategory).map(([category, exercises]) => (
          <div key={category} className="w-full md:w-1/3 lg:w-1/5">
            
            <h2 className="text-2xl font-bold text-center mb-4 text-white">{category}</h2>

           
            <div className="flex flex-col items-center ">
              {exercises.map((exercise) => (
                <Link
                  to={`/exercise/${exercise.name}`}
                  key={exercise._id}
                  className=" p-2 text-center "
                >
                  <strong className=" text-gray-300 hover:text-white hover:underline">{exercise.name}</strong>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Exercise;
