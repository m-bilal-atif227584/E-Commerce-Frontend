import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById } from '../../store/slices/orderSlice';
import { Loader, ArrowLeft } from 'lucide-react';

export default function AdminSingleOrder() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, loading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  let sum = 0;

  if (loading || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/admin/orders"
          className="flex items-center text-blue-600 hover:text-blue-700 font-medium mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" /> Back to Orders
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Order #{order.id}</h2>
          <span className='text-lg bg-amber-200 p-1 px-3 rounded-full'>{order.order_status}</span>
          <p className="text-gray-600 mb-4">
            Placed on {new Date(order.created_at).toLocaleDateString()}
          </p>

          <div className="border-t border-gray-200 mt-4 pt-4">
            <h3 className="font-semibold text-gray-900 mb-2">Shipping Information</h3>
            <p>{order.shipping_info.address}</p>
            <p>{order.shipping_info.city}, {order.shipping_info.country}</p>
            <p>Phone: {order.shipping_info.phone}</p>
          </div>

          <div className="border-t border-gray-200 mt-4 pt-4">
            <h3 className="font-semibold text-gray-900 mb-2">Items</h3>
            <div className="space-y-3">
              {order?.order_items?.map((item) => {
                sum += Number(item?.price) * Number(item?.quantity);
               return (<div key={item.order_item_id} className="flex justify-between border-b pb-2">
                  <p>{item.name} × {item.quantity}</p>
                  <p className="font-medium">Rs. {item.price * item.quantity}</p>
                </div>)
})}
            </div>
          </div>

          <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between">
            <span className="font-bold text-gray-900">Tax</span>
            <span className="text-lg font-bold text-gray-900">Rs. {(sum * 0.005).toFixed(2)} PKR (0.5%)</span>
          </div>
          <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between">
            <span className="font-bold text-gray-900">Shipping price</span>
            <span className="text-lg font-bold text-gray-900">Rs. {order.shipping_price} PKR</span>
          </div>
          <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between">
            <span className="font-bold text-gray-900">Total</span>
            <span className="text-lg font-bold text-gray-900">Rs. {order.total_price} PKR</span>
          </div>
        </div>
      </div>
    </div>
  );
}
