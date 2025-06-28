"use client"
import { useState, useMemo } from "react"
import Link from "next/link"
import { CartIcon } from "@/components/cart-icon"
import { useCart } from "@/context/cart-context"

interface Laptop {
  id: string
  name: string
  brand: string
  price: number
  processor: string
  ram: string
  storage: string
  screen: string
  condition: "new" | "used" | "refurbished"
  image: string
  rating: number
  reviews: number
  inStock: boolean
}

const mockLaptops: Laptop[] = [
  {
    id: "1",
    name: 'MacBook Pro 16"',
    brand: "Apple",
    price: 2499,
    processor: "M2 Pro",
    ram: "16GB",
    storage: "512GB SSD",
    screen: '16.2" Retina',
    condition: "new",
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.8,
    reviews: 124,
    inStock: true,
  },
  {
    id: "2",
    name: "ThinkPad X1 Carbon",
    brand: "Lenovo",
    price: 1899,
    processor: "Intel i7-12th Gen",
    ram: "16GB",
    storage: "1TB SSD",
    screen: '14" WQHD',
    condition: "new",
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.6,
    reviews: 89,
    inStock: true,
  },
  {
    id: "3",
    name: "XPS 13",
    brand: "Dell",
    price: 1299,
    processor: "Intel i5-12th Gen",
    ram: "8GB",
    storage: "256GB SSD",
    screen: '13.4" FHD+',
    condition: "new",
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.4,
    reviews: 67,
    inStock: true,
  },
  {
    id: "4",
    name: "Surface Laptop 5",
    brand: "Microsoft",
    price: 1599,
    processor: "Intel i7-12th Gen",
    ram: "16GB",
    storage: "512GB SSD",
    screen: '13.5" PixelSense',
    condition: "new",
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.5,
    reviews: 45,
    inStock: true,
  },
  {
    id: "5",
    name: "MacBook Air M2",
    brand: "Apple",
    price: 1199,
    processor: "M2",
    ram: "8GB",
    storage: "256GB SSD",
    screen: '13.6" Liquid Retina',
    condition: "refurbished",
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.7,
    reviews: 156,
    inStock: true,
  },
  {
    id: "6",
    name: "ROG Zephyrus G14",
    brand: "ASUS",
    price: 1799,
    processor: "AMD Ryzen 9",
    ram: "32GB",
    storage: "1TB SSD",
    screen: '14" QHD',
    condition: "new",
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.6,
    reviews: 78,
    inStock: false,
  },
  {
    id: "7",
    name: "Pavilion 15",
    brand: "HP",
    price: 899,
    processor: "Intel i5-11th Gen",
    ram: "8GB",
    storage: "512GB SSD",
    screen: '15.6" FHD',
    condition: "used",
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.2,
    reviews: 34,
    inStock: true,
  },
  {
    id: "8",
    name: "Legion 5 Pro",
    brand: "Lenovo",
    price: 1699,
    processor: "AMD Ryzen 7",
    ram: "16GB",
    storage: "512GB SSD",
    screen: '16" WQXGA',
    condition: "new",
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.5,
    reviews: 92,
    inStock: true,
  },
]

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBrand, setSelectedBrand] = useState("")
  const [selectedCondition, setSelectedCondition] = useState("")
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 })
  const [sortBy, setSortBy] = useState("name")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const { addToCart } = useCart()

  const brands = Array.from(new Set(mockLaptops.map((laptop) => laptop.brand)))
  const conditions = Array.from(new Set(mockLaptops.map((laptop) => laptop.condition)))

  const filteredAndSortedLaptops = useMemo(() => {
    const filtered = mockLaptops.filter((laptop) => {
      const matchesSearch =
        laptop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        laptop.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        laptop.processor.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesBrand = !selectedBrand || laptop.brand === selectedBrand
      const matchesCondition = !selectedCondition || laptop.condition === selectedCondition
      const matchesPrice = laptop.price >= priceRange.min && laptop.price <= priceRange.max

      return matchesSearch && matchesBrand && matchesCondition && matchesPrice
    })

    // Sort laptops
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "name":
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return filtered
  }, [searchTerm, selectedBrand, selectedCondition, priceRange, sortBy])

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "new":
        return "bg-green-100 text-green-800"
      case "refurbished":
        return "bg-blue-100 text-blue-800"
      case "used":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                LaptopMarket
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-700 hover:text-gray-900">
                Home
              </Link>
              <Link
                href="/checkout"
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                <CartIcon />
                <span>Checkout</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Browse Laptops</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search laptops..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Brands</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              {/* Condition Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Conditions</option>
                  {conditions.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition.charAt(0).toUpperCase() + condition.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>$0</span>
                    <span>${priceRange.max.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedBrand("")
                  setSelectedCondition("")
                  setPriceRange({ min: 0, max: 5000 })
                  setSortBy("name")
                }}
                className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">
                Showing {filteredAndSortedLaptops.length} of {mockLaptops.length} laptops
              </p>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSortedLaptops.map((laptop) => (
                  <div
                    key={laptop.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={laptop.image || "/placeholder.svg"}
                        alt={laptop.name}
                        className="w-full h-48 object-cover"
                      />
                      {!laptop.inStock && (
                        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                          <span className="text-white font-semibold">Out of Stock</span>
                        </div>
                      )}
                      <span
                        className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full ${getConditionColor(laptop.condition)}`}
                      >
                        {laptop.condition}
                      </span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{laptop.name}</h3>
                      <p className="text-gray-600 mb-2">{laptop.brand}</p>
                      <div className="flex items-center mb-2">
                        <div className="flex">{renderStars(laptop.rating)}</div>
                        <span className="ml-2 text-sm text-gray-600">({laptop.reviews})</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600 mb-4">${laptop.price.toLocaleString()}</p>
                      <div className="space-y-1 text-sm text-gray-600 mb-4">
                        <p>
                          <span className="font-medium">Processor:</span> {laptop.processor}
                        </p>
                        <p>
                          <span className="font-medium">RAM:</span> {laptop.ram}
                        </p>
                        <p>
                          <span className="font-medium">Storage:</span> {laptop.storage}
                        </p>
                      </div>
                      <button
                        disabled={!laptop.inStock}
                        onClick={() => {
                          if (laptop.inStock) {
                            addToCart({
                              id: laptop.id,
                              name: laptop.name,
                              brand: laptop.brand,
                              price: laptop.price,
                              processor: laptop.processor,
                              ram: laptop.ram,
                              storage: laptop.storage,
                              screen: laptop.screen,
                              condition: laptop.condition,
                              image: laptop.image,
                            })
                          }
                        }}
                        className={`w-full py-2 px-4 rounded-md font-medium ${
                          laptop.inStock
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {laptop.inStock ? "Add to Cart" : "Out of Stock"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAndSortedLaptops.map((laptop) => (
                  <div key={laptop.id} className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-6">
                    <div className="relative flex-shrink-0">
                      <img
                        src={laptop.image || "/placeholder.svg"}
                        alt={laptop.name}
                        className="w-32 h-24 object-cover rounded"
                      />
                      {!laptop.inStock && (
                        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center rounded">
                          <span className="text-white text-xs font-semibold">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{laptop.name}</h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getConditionColor(laptop.condition)}`}
                        >
                          {laptop.condition}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{laptop.brand}</p>
                      <div className="flex items-center mb-2">
                        <div className="flex">{renderStars(laptop.rating)}</div>
                        <span className="ml-2 text-sm text-gray-600">({laptop.reviews})</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                        <p>
                          <span className="font-medium">Processor:</span> {laptop.processor}
                        </p>
                        <p>
                          <span className="font-medium">RAM:</span> {laptop.ram}
                        </p>
                        <p>
                          <span className="font-medium">Storage:</span> {laptop.storage}
                        </p>
                        <p>
                          <span className="font-medium">Screen:</span> {laptop.screen}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <p className="text-2xl font-bold text-blue-600">${laptop.price.toLocaleString()}</p>
                      <button
                        disabled={!laptop.inStock}
                        onClick={() => {
                          if (laptop.inStock) {
                            addToCart({
                              id: laptop.id,
                              name: laptop.name,
                              brand: laptop.brand,
                              price: laptop.price,
                              processor: laptop.processor,
                              ram: laptop.ram,
                              storage: laptop.storage,
                              screen: laptop.screen,
                              condition: laptop.condition,
                              image: laptop.image,
                            })
                          }
                        }}
                        className={`py-2 px-6 rounded-md font-medium ${
                          laptop.inStock
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {laptop.inStock ? "Add to Cart" : "Out of Stock"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredAndSortedLaptops.length === 0 && (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No laptops found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
