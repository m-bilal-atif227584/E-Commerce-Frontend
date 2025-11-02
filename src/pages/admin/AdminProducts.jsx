import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct } from "../../store/slices/productSlice";
import { Loader, Trash2, Eye, ArrowLeft } from "lucide-react";

export default function AdminProducts() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchProducts({ page: 1 }));
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct({ productId: id }));
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
        <Link
          to={"/admin/dashboard"}
          className="flex text-blue-500 text-md mb-2.5"
        >
          {" "}
          <ArrowLeft /> <span className="font-medium">
            Back to dashboard
          </span>{" "}
        </Link>
        <div className="flex justify-between">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Manage Products
        </h1>
        <Link
  to="/admin/newProduct"
  className="inline-block mb-6 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
>
  + Add New Product
</Link>

        </div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                  Image
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                  Price
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                  Stock
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-6">
                    <img
                      src={p.images[0]?.url}
                      alt={p.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">{p.name}</td>
                  <td className="py-4 px-6 text-sm text-gray-900">
                    Rs. {p.price}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">{p.stock}</td>
                  <td className="py-4 px-6 flex space-x-3">
                    <Link
                      to={`/admin/products/${p.id}`}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
