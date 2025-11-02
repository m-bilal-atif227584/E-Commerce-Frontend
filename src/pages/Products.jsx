import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, searchProductsWithAI, setFilters } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';
import Filters from '../components/Filters';
import { Sparkles, Loader, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [aiPrompt, setAiPrompt] = useState('');
  const dispatch = useDispatch();
  const { products, loading, filters, currentPage, totalPages } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    const search = searchParams.get('search') || '';
    dispatch(setFilters({ search }));
    dispatch(fetchProducts({ page: 1, search, ...filters }));
  }, [searchParams]);

  const handleFilterApply = (newFilters) => {
    dispatch(setFilters(newFilters));
    dispatch(fetchProducts({ page: 1, ...newFilters }));
  };

  const handleAISearch = async (e) => {
    e.preventDefault();
    if (aiPrompt.trim()) {
      await dispatch(searchProductsWithAI(aiPrompt));
    }
  };

  const handlePageChange = (page) => {
    dispatch(fetchProducts({ page, ...filters }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* AI Search Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
              <Sparkles className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold mb-2">AI-Powered Product Search</h1>
            <p className="text-blue-100">Describe what you're looking for in natural language</p>
          </div>

          <form onSubmit={handleAISearch} className="max-w-3xl mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g., 'I need a laptop for gaming under $1000'"
                className="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition disabled:opacity-50"
              >
                {loading ? <Loader className="h-6 w-6 animate-spin" /> : 'Search'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">All Products</h2>
            <p className="text-gray-600 mt-1">{products.length} products found</p>
          </div>
          <Filters onApplyFilters={handleFilterApply} />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="h-12 w-12 animate-spin text-blue-600" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No products found</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-12">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
