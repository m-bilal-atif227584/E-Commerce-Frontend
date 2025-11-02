// import { useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchProductById } from '../../store/slices/productSlice';
// import { Loader, ArrowLeft } from 'lucide-react';

// export default function AdminSingleProduct() {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const { product, loading } = useSelector((state) => state.product);

//   useEffect(() => {
//     dispatch(fetchProductById(id));
//   }, [dispatch, id]);

//   if (loading || !product) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader className="h-12 w-12 animate-spin text-blue-600" />
//       </div>
//     );
//   }

//   const p = product;

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         <Link
//           to="/admin/products"
//           className="flex items-center text-blue-600 hover:text-blue-700 font-medium mb-6"
//         >
//           <ArrowLeft className="h-5 w-5 mr-2" /> Back to Products
//         </Link>

//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
//             <img
//               src={p.images[0]?.url}
//               alt={p.name}
//               className="w-64 h-64 object-cover rounded-lg shadow"
//             />
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-2">{p.name}</h2>
//               <p className="text-gray-600 mb-4">{p.description}</p>
//               <p className="font-semibold text-gray-900 mb-1">Price: Rs. {p.price}</p>
//               <p className="font-semibold text-gray-900 mb-1">Stock: {p.stock}</p>
//               <p className="font-semibold text-gray-900 mb-1">Category: {p.category}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, updateProduct } from '../../store/slices/productSlice';
import { Loader, ArrowLeft } from 'lucide-react';

export default function AdminSingleProduct() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, loading } = useSelector((state) => state.product);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        stock: product.stock || '',
        category: product.category || '',
      });
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      stock: formData.stock,
      category: formData.category,
    };

    await dispatch(updateProduct({ id, formData: data }));
    navigate('/admin/products');
  };

  if (loading || !product) {
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
          to="/admin/products"
          className="flex items-center text-blue-600 hover:text-blue-700 font-medium mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" /> Back to Products
        </Link>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6 space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Edit Product Details
          </h2>

          {/* Product Image (only preview, not editable) */}
          <div className="flex justify-center mb-6">
            <img
              src={product.images?.[0]?.url || '/placeholder.png'}
              alt={product.name}
              className="w-64 h-64 object-cover rounded-lg shadow"
            />
          </div>

          {/* Editable Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Product Name"
              className="border rounded-md p-2 w-full"
              required
            />
            <input
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Price"
              type="number"
              className="border rounded-md p-2 w-full"
              required
            />
            <input
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              placeholder="Stock"
              type="number"
              className="border rounded-md p-2 w-full"
              required
            />
            <input
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="Category"
              className="border rounded-md p-2 w-full"
              required
            />
          </div>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Product Description"
            className="border rounded-md resize-none p-2 w-full min-h-[120px]"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
