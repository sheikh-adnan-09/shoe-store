import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ brands: [], categories: [] });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";
  const brand = searchParams.get("brand") || "";
  const sort = searchParams.get("sort") || "";

  useEffect(() => {
    api.get("/products/meta/filters").then(({ data }) => setFilters(data));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (keyword) params.set("keyword", keyword);
        if (category) params.set("category", category);
        if (brand) params.set("brand", brand);
        if (sort) params.set("sort", sort);
        params.set("page", page);

        const { data } = await api.get(
          `${import.meta.env.VITE_API_URL}/products?${params.toString()}`,
        );
        setProducts(data.products);
        setPages(data.pages);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword, category, brand, sort, page]);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
    setPage(1);
  };

  return (
    <div className="max-w-auto mx-auto px-4 py-6">
      {!keyword && !category && !brand && (
        <div className="bg-brand text-white rounded-lg p-8 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Step Into Style</h1>
            <p className="text-gray-300">
              Premium shoes for every step of your journey.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        <aside className="md:w-56 shrink-0">
          <h3 className="font-semibold mb-2">Category</h3>
          <div className="flex flex-wrap md:flex-col gap-2 mb-4">
            <button
              onClick={() => updateFilter("category", "")}
              className={`text-left text-sm px-2 py-1 rounded ${!category ? "bg-brand text-white" : "hover:bg-gray-100"}`}
            >
              All
            </button>
            {filters.categories.map((c) => (
              <button
                key={c}
                onClick={() => updateFilter("category", c)}
                className={`text-left text-sm px-2 py-1 rounded capitalize ${category === c ? "bg-brand text-white" : "hover:bg-gray-100"}`}
              >
                {c}
              </button>
            ))}
          </div>

          <h3 className="font-semibold mb-2">Brand</h3>
          <div className="flex flex-wrap md:flex-col gap-2 mb-4">
            <button
              onClick={() => updateFilter("brand", "")}
              className={`text-left text-sm px-2 py-1 rounded ${!brand ? "bg-brand text-white" : "hover:bg-gray-100"}`}
            >
              All
            </button>
            {filters.brands.map((b) => (
              <button
                key={b}
                onClick={() => updateFilter("brand", b)}
                className={`text-left text-sm px-2 py-1 rounded ${brand === b ? "bg-brand text-white" : "hover:bg-gray-100"}`}
              >
                {b}
              </button>
            ))}
          </div>

          <h3 className="font-semibold mb-2">Sort By</h3>
          <select
            value={sort}
            onChange={(e) => updateFilter("sort", e.target.value)}
            className="input-field text-sm"
          >
            <option value="">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </aside>

        <main className="flex-1">
          {keyword && (
            <p className="mb-4 text-gray-600">
              Search results for: <strong>{keyword}</strong>
            </p>
          )}
          {loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <p className="text-gray-500 py-10 text-center">
              No products found.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded ${page === p ? "bg-brand text-white" : "bg-white border"}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
