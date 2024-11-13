

import React, { useContext, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { StoreContext } from '../context/StoreContext'
import Chat from '../chat/chat'
import { FaHeart, FaTimes, FaRobot, FaSearch, FaPlay, FaPause } from 'react-icons/fa'
import axios from 'axios'
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function CategoryDetail() {
  const { exercisesByCategory, addToCart, removeFromCart, setCartItem, nmbrlike, setNmbrlike } = useContext(StoreContext)
  const { category } = useParams()
  const [showChat, setShowChat] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [playingVideo, setPlayingVideo] = useState(null)

  const toggleChat = () => {
    setShowChat(!showChat)
  }

  const handleToggleCart = (exerciseId) => {
    if (nmbrlike[exerciseId]) {
      console.log(`Removing exercise with ID: ${exerciseId} from cart`)
      removeFromCart(exerciseId)
     
      setNmbrlike((prev) => {
        const updatedLikes = { ...prev }
        delete updatedLikes[exerciseId]
        return updatedLikes
      })
    } else {
      console.log(`Adding exercise with ID: ${exerciseId} to cart`)
      addToCart(exerciseId)
      
      setNmbrlike((prev) => ({
        ...prev,
        [exerciseId]: true, 
      }))
    }
  }

  const exercises = exercisesByCategory.exercises.filter(
    (exercise) => exercise.category === category
  )

  const filteredExercises = exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    const loadCartData = async () => {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')
    
      if (userId && token) {
        try {
          const response = await axios.get('http://localhost:3000/spring-api/api/cart/fetch', {
            headers: { Authorization: `Bearer ${token}` },
            params: { userId },
          })
    
          console.log('Response Data:', response.data)
          
          const cartData = response.data
          setCartItem(cartData)
    
          const initialLikedState = {}
          for (const itemId of Object.keys(cartData)) {
            initialLikedState[itemId] = true
          }
          setNmbrlike(initialLikedState)
        } catch (error) {
          console.error('Error fetching cart data:', error)
        }
      }
    }

    loadCartData()
  }, [])

  const toggleVideo = (exerciseId) => {
    if (playingVideo === exerciseId) {
      setPlayingVideo(null)
    } else {
      setPlayingVideo(exerciseId)
    }
  }

  return (
    <div className="bg-backgroundExercice min-h-screen bg-cover bg-center flex flex-col items-center justify-center pt-28 pb-20">
      <h1 className="text-4xl text-white font-bold mb-6">
        {category} Exercises
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((exercise) => (
          <Card key={exercise._id} className="w-full max-w-sm bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
            <CardHeader className="p-4 bg-gradient-to-r from-blue-500 to-purple-500">
              <CardTitle className="text-xl font-semibold text-white">
                <Link to={`/exercise/detail/${exercise.name}`} className="hover:underline">
                  {exercise.name}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="aspect-w-16 aspect-h-9 mb-4 relative group">
                <video
                  src={exercise.video}
                 
                  className="w-full h-full object-cover rounded-md"
                >
                  Your browser does not support the video tag.
                </video>
              
              </div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="bg-gray-100">{exercise.category}</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {exercise.description || "Experience this effective exercise routine designed to improve your fitness and strength."}
              </p>
            </CardContent>
            <CardFooter className="p-4 bg-gray-50 flex justify-between items-center">
              <Button variant="outline" asChild className="flex-1 mr-2">
                <Link to={`/exercise/detail/${exercise.name}`}>
                  View Details
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`${nmbrlike[exercise._id] ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-gray-500'}`}
                onClick={() => handleToggleCart(exercise._id)}
              >
                <FaHeart className="h-5 w-5" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div
        className='bg-white rounded-full w-[50px] h-[50px] cursor-pointer fixed bottom-6 right-4 flex items-center justify-center shadow-lg'
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
  )
}