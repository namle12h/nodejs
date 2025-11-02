import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { message } from "antd";

// 🧩 Kiểu dữ liệu giỏ hàng
export interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

// 🧠 Interface cho context
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
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // 🔄 Lưu giỏ hàng vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ✅ Chống double message (React.StrictMode render 2 lần)
  const messageLock = useRef(false);

  const addToCart = (product: any) => {
    // 🔒 Nếu đang lock thì bỏ qua (tránh gọi 2 lần)
    if (messageLock.current) return;
    messageLock.current = true;
    setTimeout(() => (messageLock.current = false), 300); // mở khóa sau 300ms

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        message.info(`Đã tăng số lượng sản phẩm "${product.name}"`);
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        message.success(`Đã thêm "${product.name}" vào giỏ hàng 🛒`);
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
    message.info("Đã xóa sản phẩm khỏi giỏ hàng 🗑️");
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
    message.info("Đã xóa toàn bộ giỏ hàng 🧹");
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

// 🔗 Hook tiện dụng để sử dụng trong component
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
