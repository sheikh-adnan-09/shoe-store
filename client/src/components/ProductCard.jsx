import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const totalStock = product.sizes?.reduce((sum, s) => sum + s.stock, 0) || 0;

  return (
    <Link to={`/product/${product._id}`} className="card overflow-hidden group hover:shadow-md transition">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        {totalStock === 0 && (
          <span className="absolute top-2 left-2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
            Out of Stock
          </span>
        )}
        {hasDiscount && (
          <span className="absolute top-2 right-2 bg-brand-accent text-white text-xs px-2 py-1 rounded">
            SALE
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs text-gray-500 uppercase">{product.brand}</p>
        <h3 className="font-medium text-sm truncate">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          {hasDiscount ? (
            <>
              <span className="font-semibold">₹{product.discountPrice}</span>
              <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
            </>
          ) : (
            <span className="font-semibold">₹{product.price}</span>
          )}
        </div>
        {product.rating > 0 && (
          <div className="text-xs text-yellow-500 mt-1">
            {"★".repeat(Math.round(product.rating))}
            {"☆".repeat(5 - Math.round(product.rating))}
            <span className="text-gray-400"> ({product.numReviews})</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
