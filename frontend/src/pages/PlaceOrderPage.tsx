import React from 'react'
import { useNavigate } from 'react-router-dom'

const PlaceOrderPage = () => {
  const navigate = useNavigate()

  // Mock order data (replace with actual data from context/state)
  const orderData = {
    orderItems: [
      { name: 'Sample Product', qty: 2, price: 99.99, image: '/sample.jpg' }
    ],
    shippingAddress: {
      address: '123 Main St',
      city: 'Sample City',
      postalCode: '12345',
      country: 'Sample Country'
    },
    paymentMethod: 'Credit Card',
    itemsPrice: 199.98,
    shippingPrice: 10.00,
    taxPrice: 20.00,
    totalPrice: 229.98
  }

  const handlePlaceOrder = () => {
    // TODO: Implement order creation
    navigate('/order/123') // Replace with actual order ID
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Order Summary</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Shipping</h2>
              <p className="text-gray-600">
                <strong>Address:</strong> {orderData.shippingAddress.address},{' '}
                {orderData.shippingAddress.city},{' '}
                {orderData.shippingAddress.postalCode},{' '}
                {orderData.shippingAddress.country}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <p className="text-gray-600">
                <strong>Method:</strong> {orderData.paymentMethod}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {orderData.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="ml-4">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-gray-600">
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Items:</span>
                <span>${orderData.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${orderData.shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${orderData.taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-3">
                <span>Total:</span>
                <span>${orderData.totalPrice.toFixed(2)}</span>
              </div>
              <button
                onClick={handlePlaceOrder}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors mt-6"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaceOrderPage 