import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline'

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              E-Commerce
            </Link>
            <div className="flex items-center space-x-6">
              <Link 
                to="/cart" 
                className="flex items-center text-gray-600 hover:text-blue-600"
              >
                <ShoppingCartIcon className="w-6 h-6 mr-1" />
                Cart
              </Link>
              <Link 
                to="/login" 
                className="flex items-center text-gray-600 hover:text-blue-600"
              >
                <UserIcon className="w-6 h-6 mr-1" />
                Login
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-gray-300">
                Your trusted online shopping destination for quality products.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/products" className="text-gray-300 hover:text-white">
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-300 hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-300 hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Email: support@example.com</li>
                <li>Phone: (123) 456-7890</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
            <p>&copy; 2024 E-Commerce. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout 