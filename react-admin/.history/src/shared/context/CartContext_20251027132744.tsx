import React, { createContext, useContext, useState, useEffect, useRef } from "react";
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

// ⚙️ Biến toàn cục chống trùng message
let globalMessageLock = false;
let globalTimer: ReturnType<typeof setTimeout> | null = null;

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  const prevUserRef = useRef<any>(null);

  // 🧠 Load giỏ hàng ban đầu
  const [cart, setCart] = useState<CartItem[]>(() => {
    const key = user ? `cart_${user.id}` : "cart_guest";
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  });

  // 🔁 Lưu giỏ hàng khi thay đổi
  useEffect(() => {
    const key = user ? `cart_${user.id}` : "cart_guest";
    localStorage.setItem(key, JSON.stringify(cart));
  }, [cart, user]);

  // 🧠 Khi user login / logout
  useEffect(() => {
    const prevUser = prevUserRef.current;

    // Khi có user mới đăng nhập
    if (user) {
      const saved = localStorage.getItem(`cart_${user.id}`);
      const guestCart = localStorage.getItem("cart_guest");

      // Nếu user mới chưa có giỏ riêng mà guest có cart -> copy cho user
      if (!saved && guestCart) {
        localStorage.setItem(`cart_${user.id}`, guestCart);
        localStorage.removeItem("cart_guest");
      }

      // Load giỏ hàng user
      const load = localStorage.getItem(`cart_${user.id}`);
      setCart(load ? JSON.parse(load) : []);
    }

    // Khi user logout
    if (!user && prevUser) {
      // Lưu lại giỏ hàng của user vừa logout
      localStorage.setItem(`cart_${prevUser.id}`, JSON.stringify(cart));
      // Xoá state hiện tại (chuyển về guest)
      const guest = localStorage.getItem("cart_guest");
      setCart(guest ? JSON.parse(guest) : []);
    }

    prevUserRef.current = user;
  }, [user]);

  // 🧩 Hàm hiển thị message không trùng
  const showMessageOnce = (fn: () => void) => {
    if (globalMessageLock) return;
    globalMessageLock = true;
    fn();
    if (globalTimer) clearTimeout(globalTimer);
    globalTimer = setTimeout(() => (globalMessageLock = false), 400);
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

  // ❌ Xoá sản phẩm
  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showMessageOnce(() => message.info("Đã xóa sản phẩm khỏi giỏ hàng 🗑️"));
  };

  // 🔢 Cập nhật số lượng
  const updateQuantity = (id: number, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: qty } : item
      )
    );
  };

  // 🧹 Xoá toàn bộ giỏ hàng
  const clearCart = () => {
    setCart([]);
    showMessageOnce(() => message.info("Đã xóa toàn bộ giỏ hàng 🧹"));
  };

  // 💰 Tổng tiền
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
