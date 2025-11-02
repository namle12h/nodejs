import React, { createContext, useContext, useState, useEffect } from "react";
import { message } from "antd";
import { useAuthStore } from "../stores/authStore";

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

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();

  // 🧠 Mỗi user (hoặc guest) có key riêng
  const getCartKey = () => (user ? `cart_${user.id}` : "cart_guest");

  // ✅ Load giỏ hàng đúng user mỗi lần user thay đổi
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const key = getCartKey();
    const saved = localStorage.getItem(key);
    setCart(saved ? JSON.parse(saved) : []);
  }, [user]); // <-- Chạy lại MỖI KHI user đổi

  // ✅ Tự động lưu giỏ hàng tương ứng với user hiện tại
  useEffect(() => {
    const key = getCartKey();
    localStorage.setItem(key, JSON.stringify(cart));
  }, [cart, user]);

  // ⚙️ Show message một lần
  let messageLock = false;
  const showMessageOnce = (fn: () => void) => {
    if (messageLock) return;
    messageLock = true;
    fn();
    setTimeout(() => (messageLock = false), 400);
  };

  // 🛒 Thêm sản phẩm
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
            price: product.salePrice ?? product.price ?? 0,
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
