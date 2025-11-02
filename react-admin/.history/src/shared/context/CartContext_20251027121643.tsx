import React, { createContext, useContext, useState, useEffect } from "react";
import { message } from "antd";
import { useAuthStore } from "../stores/authStore"; // thêm dòng này

export interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, qty: number) => void;
  clearCart: () => void;
  totalPrice: number;
}

// ⚙️ Biến toàn cục dùng làm lock chống trùng message
let globalMessageLock = false;
let globalTimer: ReturnType<typeof setTimeout> | null = null;

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  // const [cart, setCart] = useState<CartItem[]>(() => {
  //   const saved = localStorage.getItem("cart");
  //   return saved ? JSON.parse(saved) : [];
  // });
  // const { user } = useAuthStore(); // lấy thông tin user đăng nhập


  // // 🔁 Lưu giỏ hàng khi thay đổi
  // useEffect(() => {
  //   localStorage.setItem("cart", JSON.stringify(cart));
  // }, [cart]);


  // 🧠 Load giỏ hàng theo user
const [cart, setCart] = useState<CartItem[]>(() => {
  const saved = localStorage.getItem(user ? `cart_${user.id}` : "cart_guest");
  return saved ? JSON.parse(saved) : [];
});

useEffect(() => {
  localStorage.setItem(
    user ? `cart_${user.id}` : "cart_guest",
    JSON.stringify(cart)
  );
}, [cart, user]);


  const showMessageOnce = (fn: () => void) => {
    if (globalMessageLock) return;
    globalMessageLock = true;
    fn();
    if (globalTimer) clearTimeout(globalTimer);
    globalTimer = setTimeout(() => (globalMessageLock = false), 400);
  };

  const addToCart = (product: any) => {
     if (!user) {
    message.warning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng 🔒");
    return;
  }
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        showMessageOnce(() =>
          message.info(`Đã tăng số lượng sản phẩm "${product.name}"`)
        );
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        showMessageOnce(() =>
          message.success(`Đã thêm "${product.name}" vào giỏ hàng 🛒`)
        );
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.salePrice,
            imageUrl: product.imageUrl,
            quantity: 1,
          },
        ];
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showMessageOnce(() => message.info("Đã xóa sản phẩm khỏi giỏ hàng 🗑️"));
  };

  const updateQuantity = (id: number, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: qty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    showMessageOnce(() => message.info("Đã xóa toàn bộ giỏ hàng 🧹"));
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
