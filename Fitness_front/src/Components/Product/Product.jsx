'use client'

import { useState, useEffect } from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Star } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function FitnessProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1) 

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `https://real-time-amazon-data.p.rapidapi.com/search?query=fitness+product&page=${page}&country=US&sort_by=RELEVANCE&product_condition=ALL&is_prime=false&deals_and_discounts=NONE`, 
        {
          method: 'GET',
          headers: {
            'x-rapidapi-host': 'real-time-amazon-data.p.rapidapi.com',
            'x-rapidapi-key': '701756e02fmsh738bc48d73bfa7ap18dcb3jsn91e55002f279',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setProducts(data.data.products || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching products:', error)
      setError('Failed to fetch products. Please try again later.')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [page]) 

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1)
  }

  const handlePreviousPage = () => {
    setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1))
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="pt-[15vh] container mx-auto px-4 py-8">
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-40 w-full" />
              <CardContent className="p-3">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product, index) => (
            <Card key={index} className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-[46vh]">
                <img
                  src={product.product_photo || '/placeholder.svg'}
                  alt={product.product_title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardContent className="p-3 flex-grow">
                <h2 className="font-semibold text-sm mb-1 line-clamp-2" title={product.product_title}>
                  {product.product_title}
                </h2>
                <p className="text-lg font-bold text-primary mb-1">{product.product_price}</p>
                <div className="flex items-center text-sm">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span>{product.product_star_rating}</span>
                  <span className="text-gray-500 ml-1 text-xs">({product.product_num_ratings})</span>
                </div>
              </CardContent>
              <CardFooter className="p-3">
                <Button className="w-full text-sm" size="sm" asChild>
                  <a href={product.product_url} target="_blank" rel="noopener noreferrer">
                    View on Amazon
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      
      <div className="flex justify-center mt-6 space-x-4">
        <Button onClick={handlePreviousPage} disabled={page === 1}>
          Previous
        </Button>
        <span className="text-gray-700">Page {page}</span>
        <Button onClick={handleNextPage}>Next</Button>
      </div>
    </div>
  )
}
