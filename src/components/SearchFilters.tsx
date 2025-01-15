import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { cn } from '../lib/utils';

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  inStock: boolean;
  onStockChange: (inStock: boolean) => void;
  className?: string;
}

export default function SearchFilters({
  searchQuery,
  onSearchChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange,
  inStock,
  onStockChange,
  className
}: SearchFiltersProps) {
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);

  return (
    <div className={cn("bg-white rounded-lg shadow-md", className)}>
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="mt-4 flex items-center text-gray-600 hover:text-gray-900"
        >
          <SlidersHorizontal className="h-5 w-5 mr-2" />
          <span>Filters</span>
        </button>
      </div>

      {isFiltersOpen && (
        <div className="border-t px-4 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                min="0"
                value={priceRange[0]}
                onChange={(e) => onPriceRangeChange([Number(e.target.value), priceRange[1]])}
                className="w-24 px-3 py-1 border rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <span>to</span>
              <input
                type="number"
                min="0"
                value={priceRange[1]}
                onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
                className="w-24 px-3 py-1 border rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="inStock"
              checked={inStock}
              onChange={(e) => onStockChange(e.target.checked)}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <label htmlFor="inStock" className="ml-2 text-sm text-gray-700">
              In Stock Only
            </label>
          </div>
        </div>
      )}
    </div>
  );
}