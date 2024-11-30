

import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { Link,useParams } from 'react-router-dom'
import { StoreContext } from '../context/StoreContext'
import { X, Dumbbell, Heart, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Favorites() {
  const { nmbrlike, removeFromCart, setNmbrlike, showFavorite, setShowFavorites } = useContext(StoreContext)
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const {bodyPart,name} = useParams();

  // useEffect(() => {
  //   const fetchExercises = async () => {
  //     try {
  //       const exercisePromises = Object.keys(nmbrlike).map((id) =>
  //         axios.get(`https://exercisedb.p.rapidapi.com/exercises/exercise/${id}`, {
  //           headers: {
  //             'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
  //             'x-rapidapi-key': '701756e02fmsh738bc48d73bfa7ap18dcb3jsn91e55002f279',
  //           },
  //         })
  //       );
  
  //       const responses = await Promise.all(exercisePromises);
  //       const fetchedExercises = responses.map((response) => response.data);
  //       setExercises(fetchedExercises);
  //     } catch (err) {
  //       console.error('Error fetching exercises:', err);
  //       setError(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  
  //   if (nmbrlike && Object.keys(nmbrlike).length > 0) {
  //     fetchExercises();
  //   } else {
  //     setLoading(false);
  //   }
  // }, [nmbrlike]);



  const handleRemove = (exerciseId) => {
    if (nmbrlike[exerciseId]) {
      console.log(`Removing exercise with ID: ${exerciseId} from cart`)
      removeFromCart(exerciseId)
     
      setNmbrlike((prev) => {
        const updatedLikes = { ...prev }
        delete updatedLikes[exerciseId]
        return updatedLikes
      })
    
      setExercises(prevExercises => prevExercises.filter(exercise => exercise.id !== exerciseId))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[77vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to fetch favorite exercises. Please try again later.</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center">
          <Heart className="mr-2 h-6 w-6 text-red-500" />
          My Favorite Exercises
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[60vh] pr-4">
          {exercises.length > 0 ? (
            exercises.map(exercise => (
              <Card key={exercise.id} className="mb-4 overflow-hidden">
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <Dumbbell className="h-8 w-8 text-primary" />
                    <div>
                      <Link
                        to={`/exercises/detail/${exercise.bodyPart}/${exercise.name}`}
                        onClick={() => setShowFavorites(false)}
                        className="text-lg font-semibold hover:underline"
                      >
                        {exercise.name}
                      </Link>
                      <div className="flex space-x-2 mt-1">
                        <Badge variant="secondary">{exercise.category}</Badge>
                        <Badge variant="outline">Difficulty: {exercise.difficulty || 'Medium'}</Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(exercise.id)}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                    aria-label={`Remove ${exercise.name} from favorites`}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-500">No favorite exercises yet</p>
              <p className="text-gray-400 mt-2">Start adding exercises to your favorites!</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}