import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '/placeholder.jpg',
        stock: product.stock,
        quantity: 1,
      })
    );
  };

  const getProductTag = () => {
    const daysSinceCreation = Math.floor(
      (Date.now() - new Date(product.created_at).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceCreation <= 7) {
      return (
        <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          NEW
        </span>
      );
    }

    if (product.ratings >= 4.5) {
      return (
        <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          TOP RATED
        </span>
      );
    }

    if (product.stock <= 10 && product.stock > 0) {
      return (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          LIMITED STOCK
        </span>
      );
    }

    if (product.stock === 0) {
      return (
        <span className="absolute top-2 left-2 bg-gray-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          OUT OF STOCK
        </span>
      );
    }

    return null;
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="relative overflow-hidden bg-gray-100 aspect-square">
        {getProductTag()}
        <img
          src={product?.images[0]?.url || '/placeholder.jpg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition">
          {product.name}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center mb-3">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="ml-1 text-sm font-medium text-gray-700">
              {product?.ratings}
            </span>
          </div>
          <span className="ml-2 text-sm text-gray-500">({product.review_count} reviews)</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-gray-900">Rs. {product?.price} PKR</p>
            {/* <p className="text-xs text-gray-500">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p> */}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`p-3 rounded-lg transition-all ${
              product.stock === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-110'
            }`}
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </Link>
  );
}
