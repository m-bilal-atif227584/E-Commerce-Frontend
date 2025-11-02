import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders } from '../../store/slices/orderSlice';
import { fetchProducts } from '../../store/slices/productSlice';
import { Package, ShoppingCart, DollarSign, Users, TrendingUp, Loader } from 'lucide-react';

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { orders, loading: ordersLoading } = useSelector((state) => state.order);
  const { products, loading: productsLoading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchAllOrders());
    dispatch(fetchProducts({ page: 1 }));
  }, [dispatch]);

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_price), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;

  const recentOrders = orders.slice(0, 5);

  if (ordersLoading || productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your store performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">Rs. { totalRevenue} PKR</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Package className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Pending Orders</p>
            <p className="text-2xl font-bold text-gray-900">
              {orders.filter((o) => o.order_status === 'Processing').length}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/products"
              className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition text-center"
            >
              <ShoppingCart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-900">Manage Products</p>
            </Link>

            <Link
              to="/admin/orders"
              className="p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition text-center"
            >
              <Package className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-900">Manage Orders</p>
            </Link>

            <Link
              to="/admin/users"
              className="p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition text-center"
            >
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-900">Manage Users</p>
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-blue-600 hover:text-blue-700 font-medium">
              View All
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-center text-gray-600 py-8">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Order ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Total</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">#{order.id}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                        Rs. {order?.total_price} PKR
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            order.order_status === 'Processing'
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.order_status === 'Shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : order.order_status === 'Delivered'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {order.order_status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
