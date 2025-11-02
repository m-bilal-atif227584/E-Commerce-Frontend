import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrders,
  updateOrderStatus,
} from "../../store/slices/orderSlice";
import { ArrowLeft, Loader, Package } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminOrders() {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.order);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleUpdateStatus = async (orderId) => {
    if (newStatus) {
      await dispatch(updateOrderStatus({ orderId, status: newStatus }));
      setSelectedOrder(null);
      setNewStatus("");
          dispatch(fetchAllOrders());
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to={'/admin/dashboard'} className="flex text-blue-500 text-md mb-2.5" > <ArrowLeft/> <span className="font-medium">Back to dashboard</span> </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package className="h-24 w-24 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-600">
              Orders will appear here once customers start purchasing
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                      Order ID
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                      Customer
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                      Total
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-6 hover:cursor-pointer hover:text-blue-500 text-sm text-gray-900 font-medium" onClick={() => navigate(`/admin/orders/${order.id}`)}>
                        #{order.id}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">
                        <div>
                          <p className="font-medium">
                            {order?.shipping_info?.city}
                          </p>
                          <p className="text-gray-500">
                            {order?.shipping_info?.country}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm font-semibold text-gray-900">
                        Rs. {order?.total_price} PKR
                      </td>
                      <td className="py-4 px-6">
                        {selectedOrder === order.id ? (
                          <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select status</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              order.order_status === "Processing"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.order_status === "Shipped"
                                ? "bg-blue-100 text-blue-800"
                                : order.order_status === "Delivered"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {order.order_status}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {selectedOrder === order.id ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleUpdateStatus(order.id)}
                              className="text-sm text-green-600 hover:bg-gray-300 bg-gray-200 p-1 rounded-sm font-medium"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setSelectedOrder(null);
                                setNewStatus("");
                              }}
                              className="text-sm text-gray-600 hover:bg-gray-300 font-medium bg-gray-200 p-1 rounded-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedOrder(order.id);
                              setNewStatus(order.order_status);
                            }}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Update Status
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
