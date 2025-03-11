import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

interface OrderItem {
  name: string
  qty: number
  price: number
  image: string
}

interface ShippingAddress {
  address: string
  city: string
  postalCode: string
  country: string
}

interface Order {
  _id: string
  orderItems: OrderItem[]
  shippingAddress: ShippingAddress
  paymentMethod: string
  itemsPrice: number
  shippingPrice: number
  taxPrice: number
  totalPrice: number
  isPaid: boolean
  paidAt?: Date
  isDelivered: boolean
  deliveredAt?: Date
  createdAt: Date
}

const OrderPage = () => {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch order from API
    // Mock data for now
    const mockOrder: Order = {
      _id: id || '123',
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
      totalPrice: 229.98,
      isPaid: false,
      isDelivered: false,
      createdAt: new Date()
    }
    setOrder(mockOrder)
    setLoading(false)
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">Order not found</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          Order {order._id}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Shipping</h2>
              <p className="text-gray-600 mb-4">
                <strong>Address:</strong> {order.shippingAddress.address},{' '}
                {order.shippingAddress.city}, {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <div className="bg-green-100 text-green-700 p-3 rounded">
                  Delivered on {order.deliveredAt?.toLocaleDateString()}
                </div>
              ) : (
                <div className="bg-red-100 text-red-700 p-3 rounded">
                  Not Delivered
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Payment</h2>
              <p className="text-gray-600 mb-4">
                <strong>Method:</strong> {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <div className="bg-green-100 text-green-700 p-3 rounded">
                  Paid on {order.paidAt?.toLocaleDateString()}
                </div>
              ) : (
                <div className="bg-red-100 text-red-700 p-3 rounded">
                  Not Paid
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
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
                <span>${order.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${order.shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${order.taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-3">
                <span>Total:</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
              {!order.isPaid && (
                <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors mt-6">
                  Pay Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderPage 