import React, { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  HomeIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    { name: 'Products', href: '/admin/products', icon: ShoppingBagIcon },
    { name: 'Orders', href: '/admin/orders', icon: ClipboardDocumentListIcon },
    { name: 'Users', href: '/admin/users', icon: UserGroupIcon },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-gray-900">
          <Link to="/admin" className="text-xl font-bold text-white">
            Admin Panel
          </Link>
          <button
            className="p-1 text-gray-400 md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <nav className="mt-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium ${
                  isActive
                    ? 'text-white bg-gray-900'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="md:pl-64">
        {/* Mobile Header */}
        <div className="sticky top-0 z-10 md:hidden bg-white">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <button
              className="p-1 text-gray-600"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            <span className="text-xl font-semibold">Admin Panel</span>
          </div>
        </div>

        {/* Content */}
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout 