import { Product } from '@/types';

// Mock data for development
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 199.99,
    image: 'https://via.placeholder.com/300',
    category: 'Electronics',
    brand: 'AudioTech',
    countInStock: 10,
    rating: 4.5,
    numReviews: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model smartphone with advanced features',
    price: 899.99,
    image: 'https://via.placeholder.com/300',
    category: 'Electronics',
    brand: 'TechCo',
    countInStock: 5,
    rating: 4.8,
    numReviews: 24,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Laptop',
    description: 'Powerful laptop for work and gaming',
    price: 1299.99,
    image: 'https://via.placeholder.com/300',
    category: 'Electronics',
    brand: 'TechPro',
    countInStock: 8,
    rating: 4.7,
    numReviews: 18,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Smart Watch',
    description: 'Feature-rich smartwatch with health tracking',
    price: 299.99,
    image: 'https://via.placeholder.com/300',
    category: 'Electronics',
    brand: 'WearTech',
    countInStock: 15,
    rating: 4.6,
    numReviews: 32,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function getFeaturedProducts(): Promise<Product[]> {
  // TODO: Replace with actual API call
  return mockProducts;
}

export async function getProductById(id: string): Promise<Product | null> {
  // TODO: Replace with actual API call
  const product = mockProducts.find((p) => p.id === id);
  return product || null;
}

export async function getProducts(options?: {
  category?: string;
  brand?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<{ products: Product[]; total: number; pages: number }> {
  // TODO: Replace with actual API call
  let filtered = [...mockProducts];

  if (options?.category) {
    filtered = filtered.filter((p) => p.category === options.category);
  }

  if (options?.brand) {
    filtered = filtered.filter((p) => p.brand === options.brand);
  }

  if (options?.search) {
    const search = options.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
    );
  }

  if (options?.sort) {
    switch (options.sort) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
  }

  const page = options?.page || 1;
  const limit = options?.limit || 10;
  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    products: filtered.slice(start, end),
    total: filtered.length,
    pages: Math.ceil(filtered.length / limit),
  };
} 