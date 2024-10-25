import React, { useContext, useState } from 'react';
import { useParams , Link} from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import Chat from '../chat/chat'; 

const CategoryDetail = () => {
  const { exercisesByCategory } = useContext(StoreContext);
  const { category } = useParams();
  const [showChat, setShowChat] = useState(false); 

  const toggleChat = () => {
    setShowChat(!showChat); 
  };


  
  const exercises = exercisesByCategory.exercises.filter(
    (exercise) => exercise.category === category
  );

  return (
    <div className="bg-backgroundExercice min-h-screen bg-cover bg-center flex flex-col items-center justify-center">
      <h1 className="text-4xl text-white font-bold mb-10">
        {category} Exercises
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map((exercise) => (
          <div key={exercise._id} className="text-center ">
            <Link
                    to={`/exercise/detail/${exercise.name}`}
                    key={exercise._id}
                    className="p-2 text-center"
                  >
            <h2 className="text-2xl font-bold text-white underline">{exercise.name}</h2>
            </Link>
            
           
          </div>
        ))}
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

export default CategoryDetail;
