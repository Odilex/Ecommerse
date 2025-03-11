import Link from 'next/link'
import Image from 'next/image'
import { ProductCard } from "@/components/ProductCard";
import { getFeaturedProducts } from "@/lib/api";

export default async function Home() {
  const products = await getFeaturedProducts();

  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-24">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-5xl font-bold mb-6">
              Welcome to Our E-Commerce Platform
            </h1>
            <p className="text-xl mb-8 max-w-2xl">
              Discover a world of products with AI-powered recommendations and seamless shopping experience.
            </p>
            <Link
              href="/products"
              className="bg-white text-primary-600 px-8 py-3 rounded-full font-semibold hover:bg-primary-50 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="w-full bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="w-full py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
        </div>
      </section>

      {/* Special Offers */}
      <section className="w-full bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Special Offers</h2>
          <p className="mb-8">Get up to 50% off on selected items.</p>
          <Link
            href="/products"
            className="bg-white text-primary-600 px-8 py-3 rounded-full font-semibold hover:bg-primary-50 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="w-full bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="mb-8">Subscribe to our newsletter for the latest products and exclusive offers.</p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md text-gray-900"
            />
            <button
              type="submit"
              className="bg-white text-primary-600 px-6 py-2 rounded-md font-semibold hover:bg-primary-50 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  )
} 