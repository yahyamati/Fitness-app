import React, { useContext, useState } from 'react';
import { StoreContext } from '../context/StoreContext';
import { Link } from 'react-router-dom';
import Chat from '../chat/chat';
import { assets } from '../assets/assets';

const Exercise = () => {
  const { exercisesByCategory, category } = useContext(StoreContext);
  const [showChat, setShowChat] = useState(false);

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  if (!category.success || !exercisesByCategory.success) {
    return <p className="text-center text-gray-400">Loading data...</p>;
  }

  return (
    <div className="pb-20 bg-black min-h-screen"> {/* Add padding for the navbar */}
      <header className="relative h-[110vh] flex items-start justify-start">
        <img
          src={assets.gym}
          alt="Gym Background"
          className="absolute inset-0 object-cover w-full h-full z-0 opacity-50"
        />
        <div className="relative z-10 text-left p-20">
          <h1 className="text-7xl text-white mb-4 max-w-lg">
            Keep your body healthy & in shape
          </h1>
          <p className="text-gray-300 mb-10 text-lg max-w-md">
            In order to stay in shape and stay healthy, it is necessary to take a variety of steps, including a balanced ...
          </p>
        </div>
      </header>

      <div className="relative h-[120vh] flex items-center justify-center">
        <img
          src={assets.gyminverse}
          alt="Gym Background"
          className="absolute inset-0 object-cover w-full h-full z-0 opacity-50"
        />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 p-10">
          {[
            {
              title: "Weight Loss",
              description: "Weight loss can have causes that aren't due to underlying disease. Examples include dieting, exercise, malnutrition or lack of access to food."
            },
            {
              title: "Classic Yoga",
              description: 'The term "yoga" in the Western world often denotes a modern form of Hatha yoga and a posture-based physical fitness, stress-relief.'
            },
            {
              title: "Cycling",
              description: "Cycling, also, when on a two-wheeled bicycle, called bicycling or biking, is the use of cycles for transport, recreation, exercise or sport."
            },
            {
              title: "Body Building",
              description: "Bodybuilding is the use of progressive resistance exercise to control and develop one's muscles by muscle hypertrophy for aesthetic purposes."
            },
            {
              title: "Musculation",
              description: "Weight training is a common type of strength training for developing the strength, size of skeletal muscles and maintenance of strength."
            },
            {
              title: "Fitness Running",
              description: "Weight training is a common type of strength training for developing the strength, size of skeletal muscles and maintenance of strength"
            },
          ].map((item, index) => (
            <div key={index} className="flex flex-col">
              <h2 className="text-white text-center pb-5 text-xl">{item.title}</h2>
              <p className="text-gray-300">{item.description}</p>
              {index <= 5 && <hr className="border-gray-600 my-4" />} 
            </div>
          ))}
        </div>
      </div>

      <h1 className="font-bold text-4xl text-white text-center mb-20">
        Plan fit Exercises Guide
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 px-5">
        {category.categories.map((cat) => (
          <Link
            to={`/exercise/category/${cat.category}`} 
            key={cat._id}
            className="flex items-center p-4 bg-[#393939] rounded-lg shadow-md transition transform hover:scale-105 relative" // Make Link a relative container for absolute gradient
          >
            <img src={cat.image} alt={cat.category} className="w-20 h-20 mr-4" />
            <h2 className="text-2xl font-bold text-[#FFFFFF]">{cat.category}</h2>
            <div className="absolute inset-0 bg-gradient-to-b from-[#393939] to-transparent rounded-lg" />
          </Link>
        ))}
      </div>

      <div
        className='bg-white rounded-full w-[50px] h-[50px] cursor-pointer fixed bottom-6 right-4 flex items-center justify-center shadow-lg hover:scale-110'
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

export default Exercise;
