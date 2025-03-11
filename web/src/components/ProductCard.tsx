'use client';

import Image from 'next/image';
import Link from 'next/link';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/hooks/useCart';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Link href={`/product/${product.id}`}>
        <div className="relative h-48 w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold mb-2 hover:text-blue-600">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xl font-bold text-blue-600">
            RWF {product.price.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500">
            {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <span key={index}>
                {index < Math.floor(product.rating) ? (
                  <StarIcon className="w-4 h-4 text-yellow-400" />
                ) : (
                  <StarOutlineIcon className="w-4 h-4 text-gray-300" />
                )}
              </span>
            ))}
            <span className="ml-1 text-sm text-gray-500">
              ({product.numReviews})
            </span>
          </div>
        </div>
        <button
          onClick={() => addToCart(product)}
          disabled={product.countInStock === 0}
          className={`w-full py-2 px-4 rounded-md font-medium ${
            product.countInStock === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
} 