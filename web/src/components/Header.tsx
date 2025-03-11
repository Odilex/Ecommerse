'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            E-Commerce
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              href="/products"
              className={`text-gray-600 hover:text-blue-600 ${
                pathname === '/products' ? 'text-blue-600' : ''
              }`}
            >
              Products
            </Link>
            
            <Link
              href="/cart"
              className={`flex items-center text-gray-600 hover:text-blue-600 ${
                pathname === '/cart' ? 'text-blue-600' : ''
              }`}
            >
              <ShoppingCartIcon className="w-6 h-6 mr-1" />
              Cart
            </Link>

            {session ? (
              <div className="relative group">
                <button className="flex items-center text-gray-600 hover:text-blue-600">
                  <UserIcon className="w-6 h-6 mr-1" />
                  {session.user?.name}
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Orders
                  </Link>
                  {session.user?.isAdmin && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center text-gray-600 hover:text-blue-600"
              >
                <UserIcon className="w-6 h-6 mr-1" />
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
} 