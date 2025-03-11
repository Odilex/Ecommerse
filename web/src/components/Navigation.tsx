import Link from 'next/link'
import { useState } from 'react'
import { Bars3Icon, XMarkIcon, ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary-600">
            E-Commerce
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-gray-600 hover:text-primary-600">
              Products
            </Link>
            <Link href="/categories" className="text-gray-600 hover:text-primary-600">
              Categories
            </Link>
            <Link href="/deals" className="text-gray-600 hover:text-primary-600">
              Deals
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-primary-600">
              About
            </Link>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="text-gray-600 hover:text-primary-600">
              <ShoppingCartIcon className="h-6 w-6" />
            </Link>
            <Link href="/account" className="text-gray-600 hover:text-primary-600">
              <UserIcon className="h-6 w-6" />
            </Link>
            <button
              className="md:hidden text-gray-600 hover:text-primary-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <Link
                href="/products"
                className="text-gray-600 hover:text-primary-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/categories"
                className="text-gray-600 hover:text-primary-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/deals"
                className="text-gray-600 hover:text-primary-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Deals
              </Link>
              <Link
                href="/about"
                className="text-gray-600 hover:text-primary-600"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 