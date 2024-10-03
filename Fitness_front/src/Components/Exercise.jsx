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
    <div>
      <div className="flex flex-wrap justify-between">
        {Object.entries(exercisesByCategory).map(([category, exercises]) => (
          <div key={category} className="w-1/4 mb-6 p-2">
            <h2 className="text-xl font-semibold text-blue-300 text-center">{category}</h2>
            <div className="flex flex-col mt-5 text-center">
              {exercises.map((exercise) => (
                <Link to={`/exercise/${exercise.name}`} key={exercise._id} className="p-2 text-white">
                  <strong>{exercise.name}</strong>
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
