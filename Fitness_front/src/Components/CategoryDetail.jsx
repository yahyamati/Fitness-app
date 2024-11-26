import React, { useContext, useEffect, useState } from 'react';
import { useParams,Link } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import Chat from '../chat/chat';
import { FaHeart, FaTimes, FaRobot, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loading from '../Loading';

export default function CategoryDetail() {
  const { addToCart, removeFromCart, setCartItem, nmbrlike, setNmbrlike } = useContext(StoreContext);
  const { category, bodyPart } = useParams();
  const [showChat, setShowChat] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [exercisesByCategory, setExercisesByCategory] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  const handleToggleCart = (exerciseId) => {
    if (nmbrlike[exerciseId]) {
      removeFromCart(exerciseId);
      setNmbrlike((prev) => {
        const updatedLikes = { ...prev };
        delete updatedLikes[exerciseId];
        return updatedLikes;
      });
    } else {
      addToCart(exerciseId);
      setNmbrlike((prev) => ({
        ...prev,
        [exerciseId]: true,
      }));
    }
  };

  useEffect(() => {
    const loadCartData = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (userId && token) {
        try {
          const response = await axios.get('http://localhost:3000/spring-api/api/cart/fetch', {
            headers: { Authorization: `Bearer ${token}` },
            params: { userId },
          });
          const cartData = response.data;
          setCartItem(cartData);
          const initialLikedState = {};
          for (const itemId of Object.keys(cartData)) {
            initialLikedState[itemId] = true;
          }
          setNmbrlike(initialLikedState);
        } catch (error) {
          console.error('Error fetching cart data:', error);
        }
      }
    };

    loadCartData();
  }, [setCartItem, setNmbrlike]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const headers = {
          'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
          'x-rapidapi-key': 'c5df762021mshcb365ba86dc67bcp17aab3jsn6d764bb364bf',
        };

        const response = await axios.get(
          `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`,
          { headers }
        );
        setExercisesByCategory(response.data);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      } finally {
        setLoading(false);
      }
    };

    if (bodyPart) {
      fetchExercises();
    } else {
      console.error('Body part is undefined');
    }
  }, [bodyPart]);

  const filteredExercises = exercisesByCategory.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="bg-backgroundExercice min-h-screen bg-cover bg-center flex flex-col items-center justify-center pt-28 pb-20">
      <h1 className="text-4xl text-white font-bold mb-6">
        {bodyPart} Exercises
      </h1>

      <div className="w-full max-w-md mb-8">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredExercises.map((exercise) => (
          <div
            key={exercise.id}
            className="w-full max-w-sm bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
          >
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500">
              <h3 className="text-[14px] font-semibold text-white">{exercise.name}</h3>
            </div>
            <div className="p-4">
              <img
                src={exercise.gifUrl}
                alt={exercise.name}
                className="w-full h-[25vh] object-cover rounded-md mb-4"
              />
              <p className="text-sm text-gray-600">Target: {exercise.target}</p>
              <p className="text-sm text-gray-600">Equipment: {exercise.equipment}</p>
            </div>
            <Button variant="outline" asChild className="flex-1 ml-5">
                <Link to={`/exercises/detail/${bodyPart}/${exercise.name}`}>
                  View Details
                </Link>
              </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`${
                nmbrlike[exercise.id]
                  ? 'text-red-500 hover:text-red-600'
                  : 'text-gray-400 hover:text-gray-500'
              }`}
              onClick={() => handleToggleCart(exercise.id)}
            >
              <FaHeart className="h-5 w-5" />
            </Button>
          </div>
        ))}
      </div>

      <div
        className="bg-white rounded-full w-[50px] h-[50px] cursor-pointer fixed bottom-6 right-4 flex items-center justify-center shadow-lg"
        onClick={toggleChat}
      >
        {showChat ? <FaTimes className="text-black w-7 h-7" /> : <FaRobot className="text-black w-7 h-7" />}
      </div>

      {showChat && (
        <div className="fixed bottom-20 right-5 w-[350px] h-[500px] bg-white rounded-lg shadow-lg overflow-hidden">
          <Chat />
        </div>
      )}
    </div>
  );
}
