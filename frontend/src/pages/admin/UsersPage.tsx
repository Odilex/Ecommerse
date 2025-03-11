import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  SearchIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  TrashIcon,
  DownloadIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    fetchUsers();
  }, [page, keyword]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `/api/admin/users?page=${page}&keyword=${keyword}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setUsers(response.data.users);
      setPages(response.data.pages);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Users fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId: string, isAdmin: boolean) => {
    try {
      await axios.put(
        `/api/admin/users/${userId}/role`,
        { isAdmin },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      toast.success('User role updated successfully');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update user role');
      console.error('User role update error:', err);
    }
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/admin/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (err) {
        toast.error('Failed to delete user');
        console.error('User delete error:', err);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) {
      try {
        await axios.delete('/api/admin/users/bulk', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          data: { userIds: selectedUsers },
        });
        toast.success('Users deleted successfully');
        setSelectedUsers([]);
        fetchUsers();
      } catch (err) {
        toast.error('Failed to delete users');
        console.error('Bulk delete error:', err);
      }
    }
  };

  const handleBulkRoleUpdate = async (isAdmin: boolean) => {
    try {
      await axios.put(
        '/api/admin/users/bulk/role',
        { userIds: selectedUsers, isAdmin },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      toast.success('Users roles updated successfully');
      setSelectedUsers([]);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update users roles');
      console.error('Bulk role update error:', err);
    }
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      const response = await axios.get(`/api/admin/users/export?format=${format}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `users.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error('Failed to export users');
      console.error('Export error:', err);
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user._id));
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Users Management</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p>Users list will go here</p>
      </div>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
        <div className="flex space-x-2">
          {selectedUsers.length > 0 && (
            <>
              <button
                onClick={handleBulkDelete}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                <TrashIcon className="h-5 w-5 mr-2" />
                Delete Selected
              </button>
              <button
                onClick={() => handleBulkRoleUpdate(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
              >
                <ShieldCheckIcon className="h-5 w-5 mr-2" />
                Make Admin
              </button>
              <button
                onClick={() => handleBulkRoleUpdate(false)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700"
              >
                <ShieldExclamationIcon className="h-5 w-5 mr-2" />
                Remove Admin
              </button>
            </>
          )}
          <button
            onClick={() => handleExport('csv')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <DownloadIcon className="h-5 w-5 mr-2" />
            Export CSV
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <DownloadIcon className="h-5 w-5 mr-2" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search users..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          <li className="px-4 py-4 sm:px-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedUsers.length === users.length}
                onChange={handleSelectAll}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-500">Select All</span>
            </div>
          </li>
          {users.map((user) => (
            <li key={user._id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleSelectUser(user._id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <UserCircleIcon className="ml-4 h-10 w-10 text-gray-400" />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isAdmin
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.isAdmin ? 'Admin' : 'User'}
                    </span>
                    <button
                      onClick={() => handleRoleUpdate(user._id, !user.isAdmin)}
                      className={`inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white ${
                        user.isAdmin
                          ? 'bg-yellow-600 hover:bg-yellow-700'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {user.isAdmin ? (
                        <>
                          <ShieldExclamationIcon className="h-4 w-4 mr-1" />
                          Remove Admin
                        </>
                      ) : (
                        <>
                          <ShieldCheckIcon className="h-4 w-4 mr-1" />
                          Make Admin
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-sm text-gray-500">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center space-x-2">
          {[...Array(pages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersPage; 