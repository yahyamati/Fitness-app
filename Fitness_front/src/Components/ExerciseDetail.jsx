import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Chat from '../chat/chat';
import { FaTimes, FaRobot, FaDumbbell, FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const ExerciseDetail = () => { 
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [error, setError] = useState(null);
  const { bodyPart, name } = useParams();

  const toggleChat = () => {
    setShowChat((prev) => !prev);
  };

  // useEffect(() => {
  //   const fetchExercise = async () => {
  //     try {
  //       const headers = {
  //         'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
  //         'x-rapidapi-key': '701756e02fmsh738bc48d73bfa7ap18dcb3jsn91e55002f279',
  //       };

  //       const response = await axios.get(
  //         `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`,
  //         { headers }
  //       );

  //       if (Array.isArray(response.data)) {
  //         const foundExercise = response.data.find(
  //           (ex) => ex.name.toLowerCase() === name?.toLowerCase()
  //         );
  //         if (foundExercise) {
  //           setExercise(foundExercise);
  //         } else {
  //           setError('Exercise not found');
  //         }
  //       } else {
  //         setError('Unexpected response structure');
  //       }
  //     } catch (error) {
  //       console.error('Error fetching exercise:', error);
  //       setError('Failed to fetch exercise');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchExercise();
  // }, [name, bodyPart]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-32 h-32 bg-blue-300 rounded-full mb-4"></div>
          <div className="h-4 bg-blue-300 rounded w-48 mb-2"></div>
          <div className="h-4 bg-blue-300 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-800">Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Exercise not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl text-center font-bold text-gray-800 mb-8">
          {exercise.name}
        </h1>
        <div className="flex justify-center space-x-4 mb-12">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {exercise.bodyPart}
          </Badge>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {exercise.target}
          </Badge>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <img
                  src={exercise.gifUrl}
                  alt={exercise.name}
                  className="w-full h-full object-cover"
                />
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold mb-4 flex items-center text-gray-800">
                    <FaDumbbell className="mr-2 text-blue-500" /> Equipment
                  </h3>
                  <p className="text-gray-600 text-lg">{exercise.equipment}</p>
                </div>
                
                <div>
                  <h3 className="text-2xl font-semibold mb-4 flex items-center text-gray-800">
                    <FaInfoCircle className="mr-2 text-blue-500" /> Secondary Muscles
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {exercise.secondaryMuscles.map((muscle, index) => (
                      <Badge key={index} variant="outline" className="text-sm px-2 py-1">
                        {muscle}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">Instructions</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600">
                    {exercise.instructions.map((instruction, index) => (
                      <li key={index} className="text-lg">{instruction}</li>
                    ))}
                  </ol>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

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
};

export default ExerciseDetail;

