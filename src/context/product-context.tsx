"use client"

import type React from "react"

import { createContext, useContext, useReducer, useEffect } from "react"

interface Product {
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

interface ProductsState {
  products: Product[]
}

type ProductsAction =
  | { type: "SET_PRODUCTS"; payload: Product[] }
  | { type: "ADD_PRODUCT"; payload: Product }
  | { type: "UPDATE_PRODUCT"; payload: Product }
  | { type: "DELETE_PRODUCT"; payload: string }

const ProductsContext = createContext<{
  state: ProductsState
  dispatch: React.Dispatch<ProductsAction>
  addProduct: (product: Omit<Product, "id">) => void
  updateProduct: (product: Product) => void
  deleteProduct: (id: string) => void
} | null>(null)

const initialProducts: Product[] = [
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

function productsReducer(state: ProductsState, action: ProductsAction): ProductsState {
  switch (action.type) {
    case "SET_PRODUCTS":
      return { products: action.payload }
    case "ADD_PRODUCT":
      return { products: [...state.products, action.payload] }
    case "UPDATE_PRODUCT":
      return {
        products: state.products.map((product) =>
          product.id === action.payload.id ? action.payload : product,
        ),
      }
    case "DELETE_PRODUCT":
      return {
        products: state.products.filter((product) => product.id !== action.payload),
      }
    default:
      return state
  }
}

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(productsReducer, { products: [] })

  // Load products from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem("laptop-products")
    if (savedProducts) {
      try {
        const products = JSON.parse(savedProducts)
        dispatch({ type: "SET_PRODUCTS", payload: products })
      } catch (error) {
        console.error("Error loading products from localStorage:", error)
        dispatch({ type: "SET_PRODUCTS", payload: initialProducts })
      }
    } else {
      dispatch({ type: "SET_PRODUCTS", payload: initialProducts })
    }
  }, [])

  // Save products to localStorage whenever they change
  useEffect(() => {
    if (state.products.length > 0) {
      localStorage.setItem("laptop-products", JSON.stringify(state.products))
    }
  }, [state.products])

  const addProduct = (productData: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
    }
    dispatch({ type: "ADD_PRODUCT", payload: newProduct })
  }

  const updateProduct = (product: Product) => {
    dispatch({ type: "UPDATE_PRODUCT", payload: product })
  }

  const deleteProduct = (id: string) => {
    dispatch({ type: "DELETE_PRODUCT", payload: id })
  }

  return (
    <ProductsContext.Provider
      value={{
        state,
        dispatch,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider")
  }
  return context
}
