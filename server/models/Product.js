import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true },
);

const sizeStockSchema = new mongoose.Schema(
  {
    size: { type: Number, required: true }, // e.g. 6,7,8,9,10,11
    stock: { type: Number, required: true, default: 0 },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["running", "casual", "formal", "sports", "sandals", "boots"],
    },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: 0 },
    images: [{ type: String, required: true }],
    sizes: [sizeStockSchema],
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

productSchema.index({ name: "text", brand: "text", description: "text" });

productSchema.methods.totalStock = function () {
  return this.sizes.reduce((sum, s) => sum + s.stock, 0);
};

const Product = mongoose.model("Product", productSchema, "products");
export default Product;
