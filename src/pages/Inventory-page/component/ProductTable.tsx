import React, { useState } from 'react';
import { PencilIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  price: number;
  totalStock: number;
  image: string;
  stores: {
    name: string;
    stock: number;
  }[];
}
const mockProducts: Product[] = [{
  id: '1',
  name: 'Organic Bananas',
  category: 'Produce',
  sku: 'PRD-001',
  price: 2.99,
  totalStock: 500,
  image: 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=80&h=80&fit=crop&auto=format',
  stores: [{
    name: 'Downtown Grocery',
    stock: 200
  }, {
    name: 'Westside Market',
    stock: 300
  }]
}, {
  id: '2',
  name: 'Whole Milk',
  category: 'Dairy',
  sku: 'PRD-002',
  price: 3.99,
  totalStock: 200,
  image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=80&h=80&fit=crop&auto=format',
  stores: [{
    name: 'Downtown Grocery',
    stock: 100
  }, {
    name: 'Northside Pantry',
    stock: 100
  }]
}, {
  id: '3',
  name: 'Fresh Bread',
  category: 'Bakery',
  sku: 'PRD-003',
  price: 4.99,
  totalStock: 150,
  image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=80&h=80&fit=crop&auto=format',
  stores: [{
    name: 'Downtown Grocery',
    stock: 50
  }, {
    name: 'Westside Market',
    stock: 50
  }, {
    name: 'Northside Pantry',
    stock: 50
  }]
}, {
  id: '4',
  name: 'Ground Coffee',
  category: 'Beverages',
  sku: 'PRD-004',
  price: 12.99,
  totalStock: 100,
  image: 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=80&h=80&fit=crop&auto=format',
  stores: [{
    name: 'Downtown Grocery',
    stock: 40
  }, {
    name: 'Westside Market',
    stock: 60
  }]
}
// ... Add more mock products with similar structure
];
// Add 20 more products programmatically
const additionalProducts = Array.from({
  length: 20
}, (_, i) => ({
  id: `${i + 5}`,
  name: `Product ${i + 5}`,
  category: ['Produce', 'Dairy', 'Bakery', 'Meat', 'Frozen', 'Beverages'][i % 6],
  sku: `PRD-${(i + 5).toString().padStart(3, '0')}`,
  price: Math.round(Math.random() * 50 + 1),
  totalStock: Math.round(Math.random() * 1000),
  image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=80&h=80&fit=crop&auto=format',
  stores: [{
    name: 'Downtown Grocery',
    stock: Math.round(Math.random() * 200)
  }, {
    name: 'Westside Market',
    stock: Math.round(Math.random() * 200)
  }]
}));
mockProducts.push(...additionalProducts);
interface ProductTableProps {
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  searchQuery: string;
  selectedCategory: string;
}
export const ProductTable: React.FC<ProductTableProps> = ({
  onEdit,
  onDelete,
  searchQuery,
  selectedCategory
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  return <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Store Distribution
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedProducts.map(product => <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-full object-cover" src={product.image} alt="" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.totalStock}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="space-y-1">
                        {product.stores.map((store, idx) => <div key={idx} className="flex justify-between">
                            <span>{store.name}:</span>
                            <span>{store.stock}</span>
                          </div>)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => onEdit(product)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button onClick={() => onDelete(product.id)} className="text-red-600 hover:text-red-900">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button onClick={() => setCurrentPage(page => Math.max(page - 1, 1))} disabled={currentPage === 1} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))} disabled={currentPage === totalPages} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(startIndex + itemsPerPage, filteredProducts.length)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">{filteredProducts.length}</span>{' '}
                  results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button onClick={() => setCurrentPage(page => Math.max(page - 1, 1))} disabled={currentPage === 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Previous</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))} disabled={currentPage === totalPages} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};