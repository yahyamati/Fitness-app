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
    <div className="p-6">
      <div className="flex flex-wrap justify-around gap-10">
        {Object.entries(exercisesByCategory).map(([category, exercises]) => (
          <div key={category} className="w-full md:w-1/3 lg:w-1/5">
            {/* Category Title */}
            <h2 className="text-2xl font-bold text-center mb-6 text-blue-500">{category}</h2>

            {/* Exercise Links in Column under each category */}
            <div className="flex flex-col items-center ">
              {exercises.map((exercise) => (
                <Link
                  to={`/exercise/${exercise.name}`}
                  key={exercise._id}
                  className=" p-4 text-center w-full"
                >
                  <strong className="text-lg text-white">{exercise.name}</strong>
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
