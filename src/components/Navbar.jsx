import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, LogOut, Package, LayoutDashboard } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <ShoppingCart className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">ShopMate</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    navigate(`/products?search=${e.currentTarget.value}`);
                  }
                }}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center space-x-6">
            <Link to="/cart" className="relative hover:text-blue-600 transition">
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {user?.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center space-x-1 hover:text-blue-600 transition"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span className="hidden lg:inline">Admin</span>
                  </Link>
                )}

                <Link
                  to="/orders"
                  className="flex items-center space-x-1 hover:text-blue-600 transition"
                >
                  <Package className="h-5 w-5" />
                  <span className="hidden lg:inline">Orders</span>
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center space-x-1 hover:text-blue-600 transition"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden lg:inline">{user?.name}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 hover:text-red-600 transition"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
