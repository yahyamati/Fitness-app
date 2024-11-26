import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Chat from '../chat/chat';
import { FaTimes, FaRobot, FaDumbbell, FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const ExerciseDetail = () => { 
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [error, setError] = useState(null);
  const { bodyPart, name } = useParams();

  const toggleChat = () => {
    setShowChat((prev) => !prev);
  };

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const headers = {
          'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
          'x-rapidapi-key': 'c5df762021mshcb365ba86dc67bcp17aab3jsn6d764bb364bf',
        };

        const response = await axios.get(
          `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`,
          { headers }
        );

        if (Array.isArray(response.data)) {
          const foundExercise = response.data.find(
            (ex) => ex.name.toLowerCase() === name?.toLowerCase()
          );
          if (foundExercise) {
            setExercise(foundExercise);
          } else {
            setError('Exercise not found');
          }
        } else {
          setError('Unexpected response structure');
        }
      } catch (error) {
        console.error('Error fetching exercise:', error);
        setError('Failed to fetch exercise');
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [name, bodyPart]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Exercise not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Card className="overflow-hidden ">
          <CardHeader className="bg-gray-100">
            <CardTitle className="text-3xl font-bold text-center">{exercise.name}</CardTitle>
            <CardDescription className="text-center">
              <Badge variant="secondary" className="mr-2">
                {exercise.bodyPart}
              </Badge>
              <Badge variant="secondary">
                {exercise.target}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img
                  src={exercise.gifUrl}
                  alt={exercise.name}
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <FaDumbbell className="mr-2" /> Equipment
                  </h3>
                  <p>{exercise.equipment}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <FaInfoCircle className="mr-2" /> Secondary Muscles
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {exercise.secondaryMuscles.map((muscle, index) => (
                      <Badge key={index} variant="outline">{muscle}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Instructions</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    {exercise.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Toggle Button */}
      <Button
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 p-0"
        onClick={toggleChat}
      >
        {showChat ? (
          <FaTimes className="w-6 h-6" />
        ) : (
          <FaRobot className="w-6 h-6" />
        )}
      </Button>

      {/* Chat Window */}
      {showChat && (
        <div className="fixed bottom-24 right-6 w-80 h-[500px] bg-white rounded-lg shadow-lg overflow-hidden">
          <Chat />
        </div>
      )}
    </div>
  );
};

export default ExerciseDetail;
