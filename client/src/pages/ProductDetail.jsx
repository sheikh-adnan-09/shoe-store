import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data.product);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) return toast.info("Please log in to add items to your cart");
    if (!selectedSize) return toast.warn("Please select a size");
    await addToCart(product._id, selectedSize, quantity);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await api.post(`/products/${id}/reviews`, reviewForm);
      toast.success("Review submitted!");
      setReviewForm({ rating: 5, comment: "" });
      fetchProduct();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <Loader />;
  if (!product) return <p className="text-center py-20">Product not found</p>;

  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const selectedSizeStock = product.sizes.find((s) => s.size === selectedSize)?.stock ?? 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div>
          <p className="text-sm text-gray-500 uppercase">{product.brand}</p>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-3 mb-4">
            {hasDiscount ? (
              <>
                <span className="text-2xl font-bold">₹{product.discountPrice}</span>
                <span className="text-gray-400 line-through">₹{product.price}</span>
              </>
            ) : (
              <span className="text-2xl font-bold">₹{product.price}</span>
            )}
          </div>

          {product.rating > 0 && (
            <div className="text-yellow-500 mb-4">
              {"★".repeat(Math.round(product.rating))}
              {"☆".repeat(5 - Math.round(product.rating))}
              <span className="text-gray-400 text-sm"> ({product.numReviews} reviews)</span>
            </div>
          )}

          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="mb-4">
            <p className="font-medium mb-2">Select Size (UK)</p>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((s) => (
                <button
                  key={s.size}
                  disabled={s.stock === 0}
                  onClick={() => setSelectedSize(s.size)}
                  className={`w-12 h-12 rounded border text-sm ${
                    selectedSize === s.size
                      ? "bg-brand text-white border-brand"
                      : s.stock === 0
                      ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                      : "hover:border-brand"
                  }`}
                >
                  {s.size}
                </button>
              ))}
            </div>
            {selectedSize && (
              <p className="text-xs text-gray-500 mt-1">
                {selectedSizeStock > 0 ? `${selectedSizeStock} in stock` : "Out of stock"}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <p className="font-medium">Quantity</p>
            <div className="flex items-center border rounded-md">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-1">
                -
              </button>
              <span className="px-3">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(selectedSizeStock || 10, q + 1))}
                className="px-3 py-1"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!selectedSize || selectedSizeStock === 0}
            className="btn-accent w-full md:w-auto px-8 py-3"
          >
            Add to Cart
          </button>
        </div>
      </div>

      <div className="mt-12 max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>

        {product.reviews?.length === 0 && (
          <p className="text-gray-500 text-sm mb-6">No reviews yet. Be the first to review this product!</p>
        )}

        <div className="space-y-4 mb-8">
          {product.reviews?.map((r, i) => (
            <div key={i} className="border-b pb-3">
              <div className="flex justify-between items-center">
                <p className="font-medium text-sm">{r.name}</p>
                <span className="text-yellow-500 text-sm">{"★".repeat(r.rating)}</span>
              </div>
              <p className="text-gray-600 text-sm mt-1">{r.comment}</p>
            </div>
          ))}
        </div>

        {user ? (
          <form onSubmit={handleReviewSubmit} className="card p-4 space-y-3">
            <h3 className="font-medium">Write a review</h3>
            <select
              value={reviewForm.rating}
              onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
              className="input-field"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} Star{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
            <textarea
              required
              placeholder="Share your experience..."
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              className="input-field"
              rows={3}
            />
            <button type="submit" disabled={submittingReview} className="btn-primary">
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        ) : (
          <p className="text-sm text-gray-500">Log in to write a review.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
