import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Product, Category } from '../lib/types';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SearchFilters from '../components/SearchFilters';

export default function Category() {
  const { slug } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState('newest');
  const [inStock, setInStock] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: categoryData } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', slug)
          .single();
        
        if (categoryData) {
          setCategory(categoryData);
          
          let query = supabase
            .from('products')
            .select('*')
            .eq('category_id', categoryData.id);

          // Apply filters
          if (searchQuery) {
            query = query.ilike('name', `%${searchQuery}%`);
          }

          if (inStock) {
            query = query.gt('stock', 0);
          }

          query = query.gte('price', priceRange[0]).lte('price', priceRange[1]);

          // Apply sorting
          switch (sortBy) {
            case 'price_asc':
              query = query.order('price', { ascending: true });
              break;
            case 'price_desc':
              query = query.order('price', { ascending: false });
              break;
            case 'name_asc':
              query = query.order('name', { ascending: true });
              break;
            case 'name_desc':
              query = query.order('name', { ascending: false });
              break;
            default:
              query = query.order('created_at', { ascending: false });
          }
          
          const { data: productsData } = await query;
          
          if (productsData) {
            setProducts(productsData);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug, searchQuery, priceRange, sortBy, inStock]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h2>
        <Link to="/" className="text-emerald-600 hover:text-emerald-700">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link 
          to="/" 
          className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to All Categories
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
      </div>

      {/* Search and Filters */}
      <SearchFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        sortBy={sortBy}
        onSortChange={setSortBy}
        inStock={inStock}
        onStockChange={setInStock}
        className="mb-8"
      />

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No products found in this category.
          </p>
        </div>
      )}
    </div>
  );
}