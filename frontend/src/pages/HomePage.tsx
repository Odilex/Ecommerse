import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/mockData';

interface Product {
  _id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  countInStock: number;
  rating: number;
  numReviews: number;
}

const HomePage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to Our E-Commerce Store</h1>
      
      {/* Featured Products */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Link to={`/product/${product._id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                </Link>
                <div className="p-4">
                  <Link to={`/product/${product._id}`}>
                    <h3 className="text-lg font-semibold mb-2 hover:text-blue-600">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600">
                      RWF {product.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">
                      {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <svg
                          key={index}
                          className={`w-4 h-4 ${
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
                      <span className="ml-1 text-sm text-gray-500">
                        ({product.numReviews})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No products available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Electronics</h3>
            <p className="text-gray-600">Latest gadgets and devices</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Fashion</h3>
            <p className="text-gray-600">Trending clothing and accessories</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Home & Living</h3>
            <p className="text-gray-600">Furniture and home decor</p>
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Special Offers</h2>
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Summer Sale!</h3>
          <p className="mb-4">Get up to 50% off on selected items.</p>
          <Link
            to="/products"
            className="inline-block bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-50 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 