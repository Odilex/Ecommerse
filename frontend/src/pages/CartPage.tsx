import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

interface CartItem {
  _id: string
  name: string
  image: string
  price: number
  countInStock: number
  qty: number
}

const CartPage = () => {
  const navigate = useNavigate()
  // TODO: Replace with actual cart state management
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      _id: '1',
      name: 'Wireless Headphones',
      image: 'https://via.placeholder.com/200',
      price: 199.99,
      countInStock: 5,
      qty: 2
    }
  ])

  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item._id !== id))
  }

  const updateQuantity = (id: string, qty: number) => {
    setCartItems(
      cartItems.map(item =>
        item._id === id ? { ...item, qty: qty } : item
      )
    )
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.qty, 0)
  }

  const handleCheckout = () => {
    navigate('/shipping')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link
            to="/"
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2">
            {cartItems.map(item => (
              <div
                key={item._id}
                className="bg-white p-6 rounded-lg shadow-md mb-4"
              >
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="ml-6 flex-grow">
                    <Link
                      to={`/product/${item._id}`}
                      className="text-lg font-semibold hover:text-blue-600"
                    >
                      {item.name}
                    </Link>
                    <div className="text-gray-600 mt-1">${item.price}</div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <select
                      value={item.qty}
                      onChange={(e) =>
                        updateQuantity(item._id, Number(e.target.value))
                      }
                      className="border rounded-lg px-3 py-2"
                    >
                      {[...Array(item.countInStock)].map((_, index) => (
                        <option key={index + 1} value={index + 1}>
                          {index + 1}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-xl font-semibold mb-4">
              Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}{' '}
              items)
            </h2>
            <div className="text-2xl font-bold mb-6">
              ${getCartTotal().toFixed(2)}
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartPage 