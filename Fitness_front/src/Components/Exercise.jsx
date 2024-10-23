import React, { useContext } from 'react';
import { Link } from 'react-router-dom'; 
import { useTranslation } from 'react-i18next';

import { StoreContext } from '../Context/StoreContext';


const Exercise = () => {

  const { t } = useTranslation(); 
  const {exercisesByCategory} = useContext(StoreContext);
  

  return (
    <div className="pt-10">
      <h1 className='font-bold text-4xl  text-white text-center mb-20'>{t('Planfit Exercises Guide')}</h1>
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
