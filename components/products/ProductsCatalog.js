"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchAllProducts } from "../../lib/api/products";
import { fetchCategoryNames } from "../../lib/api/categories";
import { sortOptions } from "../../lib/data/products";
import ProductCard from "./ProductCard";
import ProductFilters, { countActiveFilters } from "./ProductFilters";
import { ProductGridShimmer } from "../ui/LandingShimmers";
import { PRODUCT_CATALOG_GRID_CLASS } from "../../lib/ui/product-card-layout";
import Reveal from "../ui/Reveal";
import Pagination from "../ui/Pagination";

const PRODUCTS_PER_PAGE = 13;
const DEFAULT_PRICE_BOUNDS = { min: 0, max: 100000 };

function getDiscountPercent(product) {
  if (!product.originalPrice || product.originalPrice <= product.price) {
    return 0;
  }

  return Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );
}

function getPriceBounds(products) {
  if (!products.length) {
    return DEFAULT_PRICE_BOUNDS;
  }

  return products.reduce(
    (bounds, product) => ({
      min: Math.min(bounds.min, product.price),
      max: Math.max(bounds.max, product.price),
    }),
    { min: Infinity, max: 0 },
  );
}

function sortProducts(products, sort) {
  const list = [...products];

  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "name-asc":
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case "discount":
      return list.sort((a, b) => getDiscountPercent(b) - getDiscountPercent(a));
    default:
      return list;
  }
}

export default function ProductsCatalog() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "all";
  const [products, setProducts] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("featured");
  const [minPrice, setMinPrice] = useState(DEFAULT_PRICE_BOUNDS.min);
  const [maxPrice, setMaxPrice] = useState(DEFAULT_PRICE_BOUNDS.max);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const priceBounds = useMemo(() => getPriceBounds(products), [products]);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      setLoading(true);

      try {
        const [data, names] = await Promise.all([
          fetchAllProducts(),
          fetchCategoryNames(),
        ]);

        if (!active) return;

        setProducts(data);
        setCategoryOptions(Array.isArray(names) ? names : []);

        if (data.length) {
          const bounds = getPriceBounds(data);
          setMinPrice(bounds.min);
          setMaxPrice(bounds.max);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, sort, minPrice, maxPrice, onSaleOnly, inStockOnly]);

  const activeFilterCount = countActiveFilters({
    category,
    sort,
    minPrice,
    maxPrice,
    onSaleOnly,
    inStockOnly,
    priceBounds,
  });

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query) ||
        product.badge?.toLowerCase().includes(query);

      const matchesCategory =
        category === "all" || product.category === category;

      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;

      const matchesSale =
        !onSaleOnly ||
        (product.originalPrice && product.originalPrice > product.price);

      const matchesStock = !inStockOnly || product.stock > 0;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesSale &&
        matchesStock
      );
    });

    return sortProducts(filtered, sort);
  }, [
    products,
    search,
    category,
    sort,
    minPrice,
    maxPrice,
    onSaleOnly,
    inStockOnly,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE),
  );

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  function resetFilters() {
    setSearch("");
    setCategory("all");
    setSort("featured");
    setMinPrice(priceBounds.min);
    setMaxPrice(priceBounds.max);
    setOnSaleOnly(false);
    setInStockOnly(false);
  }

  return (
    <div className="pb-10 pt-10 sm:pt-12 lg:pt-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-6">
            <p className="mb-3 inline-flex items-center rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-300">
              Zanvara Store
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              All Products
            </h1>
            <p className="mt-3 truncate text-sm text-zinc-400 sm:text-base">
              Explore our full catalog — filter by price, category, and deals.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <ProductFilters
            categoryOptions={categoryOptions}
            search={search}
            onSearchChange={setSearch}
            category={category}
            onCategoryChange={setCategory}
            sort={sort}
            onSortChange={setSort}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinPriceChange={setMinPrice}
            onMaxPriceChange={setMaxPrice}
            onSaleOnly={onSaleOnly}
            onSaleOnlyChange={setOnSaleOnly}
            inStockOnly={inStockOnly}
            onInStockOnlyChange={setInStockOnly}
            priceBounds={priceBounds}
            sortOptions={sortOptions}
            onReset={resetFilters}
            resultCount={filteredProducts.length}
            activeFilterCount={activeFilterCount}
            filterOpen={filterOpen}
            onFilterOpen={() => setFilterOpen(true)}
            onFilterClose={() => setFilterOpen(false)}
          />
        </Reveal>

        {loading ? (
          <ProductGridShimmer count={9} />
        ) : filteredProducts.length > 0 ? (
          <>
            <div className={PRODUCT_CATALOG_GRID_CLASS}>
              {paginatedProducts.map((product, index) => (
                <Reveal key={product.id} delay={Math.min(index * 40, 240)}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              className="mt-10 border-t border-white/[0.06] pt-8"
            />
          </>
        ) : (
          <Reveal delay={120}>
            <div className="mt-10 rounded-[1.75rem] border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
              <p className="text-lg font-semibold text-white">
                {products.length === 0 ? "No products available yet" : "No products found"}
              </p>
              <p className="mt-2 text-sm text-zinc-400">
                {products.length === 0
                  ? "Published products from the admin dashboard will appear here."
                  : "Try changing your search, category, or price range."}
              </p>
              {products.length > 0 ? (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-6 cursor-pointer rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_0_28px_rgba(139,92,246,0.28)]"
                >
                  Clear all filters
                </button>
              ) : null}
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
