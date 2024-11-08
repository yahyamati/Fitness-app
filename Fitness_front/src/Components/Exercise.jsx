import React, { useContext, useState } from 'react';
import { StoreContext } from '../context/StoreContext';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Chat from '../chat/chat';
import { FaTimes,FaRobot   } from 'react-icons/fa';
import { assets } from '../assets/assets';
import { Button } from "@/components/ui/button"

const Exercise = () => {
  const { exercisesByCategory, category } = useContext(StoreContext);
  const [showChat, setShowChat] = useState(false);
  const { t, i18n } = useTranslation();

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  if (!category.success || !exercisesByCategory.success) {
    return <p className="text-center text-gray-400">Loading data...</p>;
  }

  const exerciseData = [
    {
      image: assets.weight_lifting, 
      title: t("Weight Loss"),
      description: t("Weight loss can have causes that aren't due to underlying disease. Examples include dieting, exercise, malnutrition or lack of access to food.")
    },
    {
      image: assets.yoga, 
      title: t("Classic Yoga"),
      description: t("The term 'yoga' in the Western world often denotes a modern form of Hatha yoga and a posture-based physical fitness, stress-relief.")
    },
    {
      image: assets.cyclisme, 
      title: t("Cycling"),
      description: t("Cycling, also, when on a two-wheeled bicycle, called bicycling or biking, is the use of cycles for transport, recreation, exercise or sport.")
    },
    {
      image: assets.muscle, 
      title: t("Body Building"),
      description: t("Bodybuilding is the use of progressive resistance exercise to control and develop one's muscles by muscle hypertrophy for aesthetic purposes.")
    },
    {
      image: assets.alter, 
      title: t("Musculation"),
      description: t("Weight training is a common type of strength training for developing the strength, size of skeletal muscles and maintenance of strength.")
    },
    {
      image: assets.run, 
      title: t("Fitness Running"),
      description: t("Running is a method of dynamic terrestrial locomotion allowing humans and other animals to move quickly and rapidly on foot with great efficiency.")
    },
  ];

  return (
    <div className="pb-20 bg-black min-h-screen">
      <header className="relative flex items-start justify-start h-[60vh] md:h-[110vh]">
        <img
          src={assets.gym}
          alt="Gym Background"
          className="absolute inset-0 object-cover w-full h-full z-0 opacity-50"
        />
        <div className="relative z-10 text-left p-20 md:p-20">
          <h1 className="text-4xl md:text-7xl text-white mb-4 max-w-lg">
            {t("Keep your body healthy & in shape")}
          </h1>
          <p className="text-gray-300 mb-10 text-lg max-w-md">
            {t("In order to stay in shape and stay healthy, it is necessary to take a variety of steps, including a balanced diet and regular exercise.")}
          </p>
          <Button
           
            className="px-6 py-2 text-white bg-[#FF921B] rounded transition duration-200"
          >
            {t("Start")}
          </Button>
        </div>
      </header>

      <div className="relative flex items-center justify-center h-auto">
        <img
          src={assets.gyminverse}
          alt="Gym Background"
          className="absolute inset-0 object-cover w-full h-full z-0 opacity-50"
        />
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 p-5 md:p-10">
          {exerciseData.map((exercise, index) => (
            <div key={index} className="flex flex-col items-center ">
              <img src={exercise.image} alt={exercise.title} className="w-20 h-20 mb-2" />
              <h2 className="text-white text-xl text-center pb-2">{exercise.title}</h2>
              <p className="text-gray-300 text-center">{exercise.description}</p>
              <hr className="w-full my-4 border-t border-gray-600" />
            </div>
          ))}
        </div>
      </div>

      <h1 className="font-bold text-4xl text-white text-center mb-20">
        {t("Planfit Exercises Guide")}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 px-5">
        {category.categories.map((cat) => (
          <Link
            to={`/exercise/category/${cat.category}`}
            key={cat._id}
            className="flex items-center p-4 bg-[#393939] rounded-lg shadow-md transition transform hover:scale-105 relative"
          >
            <img src={cat.image} alt={cat.category} className="w-20 h-20 mr-4" />
            <h2 className="text-2xl font-bold text-[#FFFFFF]">{cat.category}</h2>
            <div className="absolute inset-0 bg-gradient-to-b from-[#393939] to-transparent rounded-lg" />
          </Link>
        ))}
      </div>

      <div
        className='bg-white rounded-full w-[50px] h-[50px] cursor-pointer fixed bottom-6 right-4 flex items-center justify-center shadow-lg hover:scale-110 z-50'
        onClick={toggleChat}
      >
        {showChat ? <FaTimes className="text-black w-7 h-7" /> : <FaRobot  className="text-black w-7 h-7" />} 
      </div>

      {showChat && (
        <div className="fixed bottom-20 right-5 w-[350px] h-[500px] bg-white rounded-lg shadow-lg overflow-hidden z-50">
          <Chat />
        </div>
      )}
    </div>
  );
};

export default Exercise;
