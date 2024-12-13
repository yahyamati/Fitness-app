import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import Chat from '../chat/chat';
import { FaHeart, FaTimes, FaRobot, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
          'x-rapidapi-key': 'fec3de3681msh09ba3c2f0450053p1458c4jsnc6febf322ccb',
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
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl text-center font-bold text-gray-800 mb-8">
          {bodyPart.charAt(0).toUpperCase() + bodyPart.slice(1)} Exercises
        </h1>

        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 text-xl" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredExercises.map((exercise) => (
            <div className="h-full">
              <Card key={exercise.id} className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg">
                <CardHeader className="p-4 bg-gradient-to-r from-blue-600 to-purple-600">
                  <CardTitle className="text-xl font-bold text-white leading-tight">
                    {exercise.name.length > 25 ? `${exercise.name.substring(0, 25)}...` : exercise.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                  <div className="aspect-square overflow-hidden rounded-md mb-4">
                    <img
                      src={exercise.gifUrl}
                      alt={exercise.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Target: {exercise.target}</p>
                  <p className="text-sm text-gray-600">Equipment: {exercise.equipment}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center p-4 bg-gray-50">
                  <Button variant="outline" asChild className="flex-1 mr-2">
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
                    } transition-colors duration-300`}
                    onClick={() => handleToggleCart(exercise.id)}
                  >
                    <FaHeart className="h-5 w-5" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="default"
        size="icon"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        onClick={toggleChat}
      >
        {showChat ? <FaTimes className="w-6 h-6" /> : <FaRobot className="w-6 h-6" />}
      </Button>

      {showChat && (
        <div className="fixed bottom-24 right-6 w-80 h-[500px] bg-white rounded-lg shadow-2xl overflow-hidden border-2 border-blue-300">
          <Chat />
        </div>
      )}
    </div>
  );
}

