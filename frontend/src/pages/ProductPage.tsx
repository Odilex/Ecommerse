import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

interface Product {
  _id: string
  name: string
  image: string
  description: string
  price: number
  rating: number
  numReviews: number
  countInStock: number
}

const ProductPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Replace with actual API call
    const mockProduct: Product = {
      _id: id || '1',
      name: 'Wireless Headphones',
      image: 'https://via.placeholder.com/600',
      description: 'High-quality wireless headphones with noise cancellation. Experience premium sound quality and comfort.',
      price: 199.99,
      rating: 4.5,
      numReviews: 12,
      countInStock: 5
    }
    setProduct(mockProduct)
    setLoading(false)
  }, [id])

  const handleAddToCart = () => {
    navigate(`/cart/${id}?qty=${quantity}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">Product not found</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-lg shadow-md"
          />
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  className={`w-5 h-5 ${
                    index < Math.floor(product.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-gray-600">
                ({product.numReviews} reviews)
              </span>
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-600 mb-4">
            ${product.price}
          </div>
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Stock and Quantity */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <span className="font-semibold mr-2">Status:</span>
              {product.countInStock > 0 ? (
                <span className="text-green-600">In Stock</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </div>
            {product.countInStock > 0 && (
              <div className="flex items-center">
                <span className="font-semibold mr-2">Quantity:</span>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="border rounded-lg px-3 py-2"
                >
                  {[...Array(product.countInStock)].map((_, index) => (
                    <option key={index + 1} value={index + 1}>
                      {index + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            className={`w-full py-3 rounded-lg text-white font-semibold ${
              product.countInStock === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductPage 