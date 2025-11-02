import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { createProduct } from "../../store/slices/productSlice";
import { ArrowLeft } from "lucide-react";

export default function AdminCreateProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.product)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    images: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("stock", formData.stock);
    formData.images.forEach((img) => data.append("images", img));

    await dispatch(createProduct(data));
    navigate("/admin/products");
  };

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
            Add New Product
          </h2>

          {/* Product Inputs */}
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
            className="border resize-none rounded-md p-2 w-full min-h-[120px]"
            required
          />

          {/* Images Upload */}
          <div>
            <label className="block font-medium mb-2">Product Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="border rounded-md p-2 w-full"
            />
            <div className="mt-4 flex flex-wrap gap-4">
              {formData.images.map((img, index) => (
                <div
                  key={index}
                  className="relative w-24 h-24 border rounded-md overflow-hidden"
                >
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`Preview ${index}`}
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            { loading ? 'Creating...' : 'Create Product' }
          </button>
        </form>
      </div>
    </div>
  );
}
