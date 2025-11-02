import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductById,
  createReview,
  deleteReview,
} from "../store/slices/productSlice";
import { addToCart } from "../store/slices/cartSlice";
import { Star, ShoppingCart, Loader, Trash2, Minus, Plus } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading } = useSelector((state) => state.product);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [selectedImage, setSelectedImage] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      // dispatch(fetchProductReviews(id));
    }
  }, [id, dispatch]);

  const maxQty = product ? Math.min(product.stock) : 100;

  const handleIncrease = () => {
    setQuantity((q) => {
      if (q >= maxQty) return q;
      return q + 1;
    });
  };

  const handleDecrease = () => {
    setQuantity((q) => {
      if (q <= 1) return q;
      return q - 1;
    });
  };

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product?.images[0]?.url,
          stock: product.stock,
          quantity,
        })
      );
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (id) {
      const result = await dispatch(
        createReview({ productId: id, rating, comment })
      );
      setComment("");
      setRating(5);
      if (createReview.fulfilled.match(result)) {
        alert(result.payload.message || "Review submitted successfully!");
      } else {
        alert(result.payload || "Failed to submit review");
      }
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (id) {
      await dispatch(deleteReview({ productId: id, reviewId }));
    }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Product Details */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Images */}
            <div>
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
                <img
                  src={product.images[selectedImage].url || "/placeholder.jpg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden ${
                        selectedImage === index ? "ring-2 ring-blue-600" : ""
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  {product?.rating?.toFixed(1)} ({product.numReviews} reviews)
                </span>
              </div>

              <p className="text-4xl font-bold text-blue-600 mb-6">
                Rs. {product?.price} PKR
              </p>

              <p className="text-gray-700 mb-6 leading-relaxed">
                {product.description}
              </p>

              <div className="mb-6">
                <span className="text-sm font-medium text-gray-700">
                  Category:
                </span>
                <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {product.category}
                </span>
              </div>

              <div className="mb-6">
                <span
                  className={`text-lg font-semibold ${
                    product.stock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.stock > 0 ? `In Stock` : "Out of Stock"}
                </span>
              </div>

               {product.stock > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>

                  {/* ---------- Plus / Minus Quantity Control (Updated) ---------- */}
                  <div className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={handleDecrease}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-5 w-5" />
                    </button>

                    <div className="px-6 py-2 text-lg font-medium">
                      {quantity}
                    </div>

                    <button
                      type="button"
                      onClick={handleIncrease}
                      disabled={quantity >= maxQty}
                      aria-label="Increase quantity"
                      className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>

                  {/* <p className="mt-2 text-sm text-gray-500">
                    {product.stock >= 10 ? `Up to 10 per order` : `Only ${product.stock} available`}
                  </p> */}
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Customer Reviews
          </h2>

          {/* Review Form */}
          {isAuthenticated && (
            <form
              onSubmit={handleSubmitReview}
              className="mb-8 p-6 bg-gray-50 rounded-lg"
            >
              <h3 className="text-lg font-semibold mb-4">Write a Review</h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none resize-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Share your experience with this product..."
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Submit Review
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {product?.reviews?.length === 0 ? (
              <p className="text-center text-gray-600 py-8">
                No reviews yet. Be the first to review!
              </p>
            ) : (
              product?.reviews?.map((review) => (
                <div
                  key={review.review_id}
                  className="border-b border-gray-200 pb-6 last:border-0"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <img
                        src={
                          review?.reviewer?.avatar?.url || "/default-avatar.jpg"
                        }
                        alt={review?.reviewer?.name}
                        className="w-10 h-10 object-cover rounded-full"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {review?.reviewer?.name}
                        </p>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review?.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {user?.id === review?.reviewer?.id && (
                      <button
                        onClick={() => handleDeleteReview(review.review_id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 ml-13">{review.comment}</p>
                  <p className="text-sm text-gray-500 mt-2 ml-13">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
